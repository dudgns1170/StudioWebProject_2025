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
description: MyBatis 매퍼 규칙
globs: ["**/mapper/**", "**/*Mapper.java", "**/*.xml"]
conditional_load:
  if_exists:
    - "src/main/resources/mapper"
  dependencies:
    - "mybatis-spring-boot-starter"
  then_load: true
---

# MyBatis 매퍼 규칙

## 1. 매퍼 인터페이스

- **[패키지 위치]**
  - `com.app.repository` 패키지에 위치한다.
  - 인터페이스명은 `EntityMapper` 또는 `EntityRepository` 형식으로 작성한다.
    - 예: `UserMapper`, `ProposalFileRepository`

- **[메서드 네이밍]**
  - CRUD 메서드는 표준 네이밍을 따른다.
    - 조회: `findById`, `findAll`, `findByCondition`
    - 생성: `insert`, `save`
    - 수정: `update`, `updateById`
    - 삭제: `deleteById`, `delete`
  - 복잡한 조회는 의미를 명확히 드러내는 이름을 사용한다.
    - 예: `findActiveUsersByRole`, `countFilesByProposal`

- **[파라미터 어노테이션]**
  - 단일 파라미터는 `@Param` 생략 가능
  - 여러 파라미터는 반드시 `@Param` 어노테이션 사용
  - DTO/객체 파라미터는 `@Param` 생략 가능

```java
public interface UserMapper {
    User findById(Long id);
    
    List<User> findByCondition(@Param("status") String status, 
                              @Param("roleId") Long roleId);
    
    int insert(User user);
    
    int update(User user);
    
    int deleteById(Long id);
}
```

## 2. XML 매퍼 파일

- **[파일 위치]**
  - `src/main/resources/mapper/` 디렉토리에 위치한다.
  - 패키지 구조와 일치시킨다.
    - 예: `com.app.repository.UserMapper` → `mapper/UserMapper.xml`

- **[XML 구조]**
  - `namespace`는 매퍼 인터페이스의 FQDN으로 설정한다.
  - `id`는 인터페이스 메서드명과 일치시킨다.
  - `resultType`/`parameterType`은 FQDN 또는 별칭(alias)을 사용한다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.app.repository.UserMapper">
    
    <resultMap id="userResultMap" type="com.app.entity.User">
        <id property="id" column="user_id"/>
        <result property="email" column="email"/>
        <result property="name" column="user_name"/>
        <result property="createdAt" column="created_at"/>
    </resultMap>
    
    <select id="findById" parameterType="long" resultMap="userResultMap">
        SELECT user_id, email, user_name, created_at
        FROM users
        WHERE user_id = #{id}
        AND deleted_at IS NULL
    </select>
    
    <insert id="insert" parameterType="com.app.entity.User" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO users (email, user_name, created_at)
        VALUES (#{email}, #{name}, NOW())
    </insert>
    
</mapper>
```

## 3. SQL 작성 가이드

- **[들여쓰기와 포맷]**
  - 키워드는 대문자로 작성한다 (SELECT, FROM, WHERE 등)。
  - 컬럼명과 테이블명은 소문자로 작성한다。
  - 적절한 들여쓰기로 가독성을 높인다。

- **[동적 SQL]**
  - `<if>`, `<choose>`, `<foreach>` 등을 적극 활용한다。
  - 복잡한 조건은 `<sql>` 태그로 재사용 가능하게 분리한다。

```xml
<select id="findByCondition" resultMap="userResultMap">
    SELECT user_id, email, user_name, created_at
    FROM users
    WHERE deleted_at IS NULL
    <if test="status != null and status != ''">
        AND status = #{status}
    </if>
    <if test="roleId != null">
        AND role_id = #{roleId}
    </if>
    ORDER BY created_at DESC
</select>
```

- **[성능 고려사항]**
  - 필요한 컬럼만 선택한다 (SELECT * 사용 금지)。
  - 인덱스를 활용할 수 있도록 WHERE 조건을 작성한다。
  - 대량 데이터는 페이징 처리를 고려한다。

## 4. 결과 매핑

- **[ResultMap]**
  - 컬럼명과 필드명이 다를 경우 반드시 ResultMap을 사용한다。
  - 복잡한 조인 결과는 `association`, `collection`을 활용한다。
  - 공통 컬럼은 `<resultMap>` 상속으로 재사용한다。

- **[타입 핸들러]**
  - Enum 타입은 별도의 TypeHandler를 구현한다。
  - JSON 데이터는 JsonTypeHandler를 사용한다。

## 5. 트랜잭션

- 매퍼 자체는 트랜잭션을 관리하지 않는다。
- Service 계층에서 `@Transactional`로 관리한다。
- 배치 작업은 `SqlSession`을 직접 사용하거나 배치 매퍼를 고려한다。

## 6. 테스트

- 매퍼 테스트는 `@MybatisTest`를 사용한다。
- 테스트용 SQL 파일은 `src/test/resources/schema.sql`에 작성한다。
- 각 테스트는 독립적인 데이터로 수행되도록 한다。
