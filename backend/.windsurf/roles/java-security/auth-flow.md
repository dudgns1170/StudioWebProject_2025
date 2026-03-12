---
trigger:
  on_file_change: true
  file_patterns: 
    - "src/main/java/**/*Security*.java"
    - "src/main/java/**/*Auth*.java"
    - "src/main/java/**/*Jwt*.java"
    - "src/main/resources/application.yml"
  exclude_patterns:
    - "build/**"
    - ".gradle/**"
    - "**/*.class"
description: Spring Security + JWT 인증 규칙
globs: ["**/security/**", "**/auth/**", "**/*Security*.java", "**/*Auth*.java"]
conditional_load:
  if_exists:
    - "src/main/java"
  config_contains:
    - "spring-security"
    - "jwt"
  in_files:
    - "build.gradle"
  then_load: true
---

# Spring Security + JWT 인증 규칙

## 1. 인증 아키텍처

- **[JWT 기반 Stateless 인증]**
  - Access Token: 15분 유효기간, stateless 처리
  - Refresh Token: 7일 유효기간, Redis에 저장
  - 토큰 재발급은 별도 엔드포인트 처리

- **[인증 흐름]**
  1. 로그인 → Access Token + Refresh Token 발급
  2. API 요청 → Authorization 헤더에 Bearer Token
  3. 필터에서 토큰 검증 → SecurityContext 설정
  4. 만료 시 Refresh Token으로 Access Token 재발급

## 2. SecurityConfig 설정

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/health/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
}
```

## 3. JWT 토큰 처리

### 토큰 생성
```java
@Service
@RequiredArgsConstructor
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;
    
    public String generateAccessToken(UserDetails userDetails) {
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
            .signWith(SignatureAlgorithm.HS256, secret)
            .compact();
    }
    
    public String extractUsername(String token) {
        return Jwts.parser()
            .setSigningKey(secret)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
    
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
```

### 인증 필터
```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt);
        
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

## 4. 인증 컨트롤러

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthenticationService authService;
    
    @PostMapping("/register")
    public ResponseEntity<CommonResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        return ResponseEntity.ok(
            CommonResponse.success("user_registered", user)
        );
    }
    
    @PostMapping("/login")
    public ResponseEntity<CommonResponse<TokenResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        TokenResponse tokens = authService.login(request);
        return ResponseEntity.ok(
            CommonResponse.success("login_success", tokens)
        );
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<CommonResponse<TokenResponse>> refresh(
            @RequestBody RefreshTokenRequest request) {
        TokenResponse tokens = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(
            CommonResponse.success("token_refreshed", tokens)
        );
    }
    
    @PostMapping("/logout")
    public ResponseEntity<CommonResponse<Void>> logout(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        authService.logout(token);
        return ResponseEntity.ok(
            CommonResponse.success("logout_success", null)
        );
    }
}
```

## 5. Refresh Token 관리

```java
@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    
    private final RedisTemplate<String, String> redisTemplate;
    
    private static final String REFRESH_TOKEN_PREFIX = "RT:";
    private static final long REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7일
    
    public void saveRefreshToken(String userId, String refreshToken) {
        String key = REFRESH_TOKEN_PREFIX + userId;
        redisTemplate.opsForValue().set(key, refreshToken, 
            Duration.ofMillis(REFRESH_TOKEN_EXPIRATION));
    }
    
    public String getRefreshToken(String userId) {
        String key = REFRESH_TOKEN_PREFIX + userId;
        return redisTemplate.opsForValue().get(key);
    }
    
    public void deleteRefreshToken(String userId) {
        String key = REFRESH_TOKEN_PREFIX + userId;
        redisTemplate.delete(key);
    }
    
    public boolean validateRefreshToken(String userId, String refreshToken) {
        String storedToken = getRefreshToken(userId);
        return storedToken != null && storedToken.equals(refreshToken);
    }
}
```

## 6. 권한 관리

### Role 기반 접근 제어
```java
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @GetMapping("/users")
    public ResponseEntity<CommonResponse<List<UserResponse>>> getAllUsers() {
        // 관리자만 접근 가능
    }
}

@Service
@RequiredArgsConstructor
public class UserService {
    
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public UserResponse getUserById(Long userId) {
        // 관리자이거나 본인만 접근 가능
    }
}
```

### 메서드 시큐리티
```java
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class MethodSecurityConfig {
    // 메서드 레벨 보안 활성화
}
```

## 7. 예외 처리

```java
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    
    @Override
    public void commence(
        HttpServletRequest request,
        HttpServletResponse response,
        AuthenticationException authException
    ) throws IOException {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }
}

@RestControllerAdvice
public class SecurityExceptionHandler {
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<CommonResponse<Void>> handleAccessDenied() {
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(CommonResponse.error("access_denied", null));
    }
    
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<CommonResponse<Void>> handleJwtException() {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(CommonResponse.error("invalid_token", null));
    }
}
```

## 8. 보안 모범 사례

- **[비밀번호 관리]**
  - BCrypt를 사용한 해싱 (strength 10~12)
  - 평문 비밀번호 절대 저장 금지
  - 비밀번호 정책 강제 (최소 8자, 영문+숫자+특수문자)

- **[토큰 관리]**
  - JWT secret은 환경 변수로 관리
  - 토큰 만료 시간은 적절히 설정 (Access: 15분, Refresh: 7일)
  - 로그아웃 시 Refresh Token 즉시 삭제

- **[HTTPS 적용]**
  - 프로덕션 환경에서는 반드시 HTTPS 사용
  - HSTS 헤더 설정으로 HTTPS 강제

- **[CORS 설정]**
  - 허용할 도메인 명시적으로 지정
  - 개발 환경과 프로덕션 환경 분리 설정

## 9. 테스트

```java
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private JwtService jwtService;
    
    @Mock
    private RefreshTokenService refreshTokenService;
    
    @InjectMocks
    private AuthenticationService authService;
    
    @Test
    void login_ShouldReturnTokens_WhenValidCredentials() {
        // Given
        LoginRequest request = new LoginRequest("test@example.com", "password");
        when(authenticationManager.authenticate(any()))
            .thenReturn(new UsernamePasswordAuthenticationToken("test", null));
        when(jwtService.generateAccessToken(any())).thenReturn("access.token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh.token");
        
        // When
        TokenResponse response = authService.login(request);
        
        // Then
        assertThat(response.getAccessToken()).isEqualTo("access.token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh.token");
    }
}
