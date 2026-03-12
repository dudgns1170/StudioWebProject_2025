---
trigger:
  on_file_change: true
  file_patterns: 
    - "src/test/java/**/*.java"
  exclude_patterns:
    - "build/**"
    - ".gradle/**"
    - "**/*.class"
description: Java 테스트 가이드라인
globs: ["**/test/**/*.java", "**/*Test.java"]
conditional_load:
  if_exists:
    - "src/test/java"
  then_load: true
---

- **[테스트 프레임워크]**
  - **JUnit 5**를 기본 테스트 프레임워크로 사용한다.
  - 통합 테스트는 **Spring Boot Test**(`@SpringBootTest`)를 활용한다.
  - Mock은 **Mockito**를 사용한다.

- **[테스트 파일 구조]**
  - 테스트 파일은 `src/test/java/com/app/` 하위에 위치시킨다.
  - 패키지 구조는 메인 코드와 동일하게 유지한다.
    - 예: `com.app.service.AuthService` → `com.app.service.AuthServiceTest`

- **[테스트 클래스 네이밍]**
  - 테스트 클래스는 대상 클래스명 + `Test`를 붙인다.
    - 예: `AuthServiceTest`, `ProposalFileServiceTest`, `UserControllerTest`.

- **[테스트 메서드 네이밍]**
  - `methodName_상황_기대결과` 패턴을 사용한다.
    - 예: `login_ShouldReturnToken_WhenValidCredentials`
    - 예: `fileUpload_ShouldThrowException_WhenFileIsEmpty`
  - `@DisplayName`을 사용해 한국어로 테스트 의도를 명시할 수 있다.

- **[테스트 종류]**
  - **단위 테스트**: Service 레이어의 비즈니스 로직을 중점적으로 테스트한다.
    - `@ExtendWith(MockitoExtension.class)` 사용
    - 외부 의존성(Redis, S3 등)은 모두 Mock으로 처리한다.
  - **통합 테스트**: Controller 레이어의 API 흐름을 테스트한다.
    - `@SpringBootTest` 또는 `@WebMvcTest` 사용
    - 실제 DB 연동은 `@TestConfiguration`과 TestContainers를 고려한다.

- **[Given-When-Then 패턴]**
  - 테스트 코드는 명확하게 Given-When-Then 구조를 따르도록 작성한다.

  ```java
  @Test
  @DisplayName("유효한 자격증명으로 로그인 시 토큰을 반환한다")
  void login_ShouldReturnToken_WhenValidCredentials() {
      // Given
      LoginRequestDto request = new LoginRequestDto("test@example.com", "password123");
      given(authService.login(any())).willReturn(new TokenResponseDto("access.token", "refresh.token"));

      // When
      ResponseEntity<CommonResponse<TokenResponseDto>> response = authController.login(request);

      // Then
      assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
      assertThat(response.getBody().getData().getAccessToken()).isEqualTo("access.token");
  }
  ```

- **[공통 테스트 설정]**
  - 반복적으로 사용되는 Mock 설정은 `@BeforeEach` 또는 테스트 전용 Helper 클래스로 분리한다.
  - 테스트 데이터는 `@MethodSource`나 `@CsvSource`를 활용해 파라미터화 테스트를 고려한다.

- **[검증 어서션]**
  - AssertJ를 적극적으로 사용하여 가독성 높은 검증을 작성한다.
  - 예외 검증 시 `assertThatThrownBy()`를 사용한다.

- **[테스트 커버리지]**
  - Service 레이어의 핵심 비즈니스 로직은 최소 80% 이상 커버리지를 목표로 한다.
  - 정상 케이스뿐만 아니라 예외 케이스도 반드시 테스트한다.
