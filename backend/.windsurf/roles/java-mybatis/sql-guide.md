---
trigger:
  on_file_change: true
  file_patterns: 
    - "src/main/resources/mapper/**/*.xml"
    - "**/mapper/**/*.java"
    - "**/*Mapper.java"
  exclude_patterns:
    - "build/**"
    - ".gradle/**"
    - "**/*.class"
description: SQL 작성 가이드
globs: ["**/mapper/**", "**/*.xml"]
conditional_load:
  if_exists:
    - "src/main/resources/mapper"
  dependencies:
    - "mybatis-spring-boot-starter"
  then_load: true
---

# SQL 작성 가이드

## 1. 기본 원칙

- **[가독성]**
  - SQL 키워드는 대문자로 작성 (SELECT, FROM, WHERE, INSERT, UPDATE, DELETE)
  - 테이블명, 컬럼명은 소문자로 작성 (snake_case 권장)
  - 의미 있는 들여쓰기로 구조를 명확히 표현

- **[성능]**
  - SELECT * 사용 금지: 필요한 컬럼만 명시
  - WHERE 조건에 인덱스 컬럼 우선 사용
  - 불필요한 조인 피하기
  - 대량 데이터는 LIMIT으로 페이징 처리

## 2. SELECT 문

```sql
-- 기본 형식
SELECT 
    user_id,
    email,
    user_name,
    created_at
FROM users
WHERE deleted_at IS NULL
    AND status = 'active'
ORDER BY created_at DESC
LIMIT 10;
```

### 조인 사용 시
```sql
SELECT 
    u.user_id,
    u.email,
    u.user_name,
    r.role_name,
    p.permission_name
FROM users u
INNER JOIN user_roles ur ON u.user_id = ur.user_id
INNER JOIN roles r ON ur.role_id = r.role_id
LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.permission_id
WHERE u.deleted_at IS NULL
    AND u.status = 'active';
```

## 3. INSERT 문

```sql
-- 단일 행 삽입
INSERT INTO users (
    email,
    user_name,
    password_hash,
    status,
    created_at
) VALUES (
    'test@example.com',
    'Test User',
    'hashed_password',
    'active',
    NOW()
);

-- 다중 행 삽입
INSERT INTO user_roles (user_id, role_id, created_at)
VALUES 
    (1, 1, NOW()),
    (1, 2, NOW()),
    (2, 1, NOW());
```

## 4. UPDATE 문

```sql
-- 단일 컬럼 수정
UPDATE users 
SET status = 'inactive',
    updated_at = NOW()
WHERE user_id = 1
    AND deleted_at IS NULL;

-- 조인을 사용한 수정
UPDATE users u
INNER JOIN user_roles ur ON u.user_id = ur.user_id
SET u.status = 'inactive',
    u.updated_at = NOW()
WHERE ur.role_id = 3;
```

## 5. DELETE 문 (소프트 삭제 권장)

```sql
-- 하드 삭제 (신중하게 사용)
DELETE FROM users 
WHERE user_id = 1;

-- 소프트 삭제 권장
UPDATE users 
SET deleted_at = NOW(),
    updated_at = NOW()
WHERE user_id = 1;
```

## 6. 동적 SQL 패턴

### 조건부 WHERE
```xml
<select id="findUsersByCondition" resultMap="userResultMap">
    SELECT user_id, email, user_name, status
    FROM users
    WHERE deleted_at IS NULL
    <if test="email != null and email != ''">
        AND email LIKE CONCAT('%', #{email}, '%')
    </if>
    <if test="status != null and status != ''">
        AND status = #{status}
    </if>
    <if test="roleId != null">
        AND user_id IN (
            SELECT user_id FROM user_roles WHERE role_id = #{roleId}
        )
    </if>
    ORDER BY created_at DESC
</select>
```

### 동적 UPDATE
```xml
<update id="updateUserSelective">
    UPDATE users
    <set>
        <if test="email != null">email = #{email},</if>
        <if test="userName != null">user_name = #{userName},</if>
        <if test="status != null">status = #{status},</if>
        updated_at = NOW()
    </set>
    WHERE user_id = #{userId}
        AND deleted_at IS NULL
</update>
```

## 7. 서브쿼리 사용

### EXISTS 사용
```sql
SELECT 
    user_id,
    email,
    user_name
FROM users u
WHERE EXISTS (
    SELECT 1 
    FROM user_roles ur 
    INNER JOIN roles r ON ur.role_id = r.role_id
    WHERE ur.user_id = u.user_id
        AND r.role_name = 'ADMIN'
)
    AND u.deleted_at IS NULL;
```

### IN 서브쿼리
```sql
SELECT 
    user_id,
    email,
    user_name
FROM users
WHERE user_id IN (
    SELECT DISTINCT user_id 
    FROM user_roles 
    WHERE role_id IN (1, 2, 3)
)
    AND deleted_at IS NULL;
```

## 8. 집계 함수

```sql
-- 기본 집계
SELECT 
    COUNT(*) AS total_users,
    COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_users,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) AS new_users
FROM users
WHERE deleted_at IS NULL;

-- GROUP BY
SELECT 
    DATE(created_at) AS date,
    COUNT(*) AS daily_signups
FROM users
WHERE deleted_at IS NULL
    AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## 9. 윈도우 함수 (MySQL 8.0+)

```sql
-- 순위 매기기
SELECT 
    user_id,
    email,
    total_points,
    RANK() OVER (ORDER BY total_points DESC) AS rank
FROM (
    SELECT 
        u.user_id,
        u.email,
        SUM(p.points) AS total_points
    FROM users u
    INNER JOIN user_points up ON u.user_id = up.user_id
    WHERE u.deleted_at IS NULL
    GROUP BY u.user_id, u.email
) ranked_users;
```

## 10. 성능 최적화 팁

### 인덱스 활용
```sql
-- 좋은 예: 인덱스 컬럼을 먼저 비교
WHERE created_at >= '2024-01-01'
    AND status = 'active';

-- 나쁜 예: 함수 사용으로 인덱스 미활용
WHERE YEAR(created_at) = 2024;
```

### 페이징
```sql
-- 기본 페이징
SELECT user_id, email, user_name
FROM users
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;

-- 커서 기반 페이징 (대량 데이터에 적합)
SELECT user_id, email, user_name
FROM users
WHERE deleted_at IS NULL
    AND created_at < #{lastCreatedAt}
ORDER BY created_at DESC
LIMIT 20;
```

## 11. 주석 작성

```sql
-- 사용자 목록 조회 (활성 사용자만)
SELECT 
    user_id,        -- 사용자 ID
    email,          -- 이메일 주소
    user_name,      -- 사용자명
    created_at      -- 생성일시
FROM users
WHERE deleted_at IS NULL  -- 삭제되지 않은 사용자
    AND status = 'active'  -- 활성 상태
ORDER BY created_at DESC; -- 최신순 정렬
```
