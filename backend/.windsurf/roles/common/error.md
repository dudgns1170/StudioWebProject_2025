---
trigger:
  on_file_change: true
  file_patterns: 
    - "src/main/java/**/*.java"
    - "src/main/resources/**/*.yml"
    - "src/main/resources/**/*.yaml"
  exclude_patterns:
    - "build/**"
    - ".gradle/**"
    - "**/*.class"
description: API 응답 형식 및 에러 메시지 표준 규칙
globs: ["**/*"]
conditional_load:
  if_exists:
    - "src/main/java"
  then_load: true
---

# API Response Structure

모든 API 응답은 status, code, message, data 4개 필드로 구성한다.
status는 Boolean 타입으로, 성공 시 true, 실패 시 false를 반환한다.
code는 number | null 타입으로, HTTP 상태 코드를 사용한다.
message는 string | null 타입으로, snake_case 형식의 간결한 메시지를 사용한다.
data는 기존 body json | null 타입으로, 응답 데이터를 담는다.

# Null Handling

빈 값은 무조건 null로 처리한다.
빈 문자열("")이나 빈 객체({})를 사용하지 않는다.
데이터가 없는 경우 data: null로 명시한다.

# Success Response (2xx)

200 OK: status: true, code: 200, message: "success", data: {...}
201 Created: status: true, code: 201, message: "created", data: {...}
204 No Content: status: true, code: 204, message: "no_content", data: null

# Client Error Response (4xx)

400 Bad Request: status: false, code: 400, message: "invalid_request", data: null

잘못된 요청 형식이거나 요구사항을 충족하지 못할 때 사용한다.

401 Unauthorized: status: false, code: 401, data: null

인증이 필요한 경우: message: "authentication_required"
인증 정보가 잘못된 경우: message: "invalid_credentials"
토큰이 만료된 경우: message: "token_expired"
토큰이 누락된 경우: message: "token_missing"
토큰이 유효하지 않은 경우: message: "invalid_token"

403 Forbidden: status: false, code: 403, data: null

접근 권한이 없는 경우: message: "access_denied"
권한이 부족한 경우: message: "insufficient_permissions"

404 Not Found: status: false, code: 404, message: "resource_not_found", data: null

요청한 리소스를 찾을 수 없을 때 사용한다.

409 Conflict: status: false, code: 409, message: "resource_already_exists", data: null

리소스가 이미 존재하여 충돌이 발생할 때 사용한다.

422 Unprocessable Entity: status: false, code: 422, data: null

검증이 실패한 경우: message: "validation_failed"
필수 필드가 누락된 경우: message: "required_field_missing"
이메일 형식이 잘못된 경우: message: "invalid_email_format"
날짜 형식이 잘못된 경우: message: "invalid_date_format"
비밀번호가 짧은 경우: message: "password_too_short"
중복된 값이 있는 경우: message: "duplicate_value"
파일 크기가 초과된 경우: message: "file_size_exceeded"
지원하지 않는 파일 형식인 경우: message: "unsupported_file_type"

429 Too Many Requests: status: false, code: 429, message: "rate_limit_exceeded", data: null

요청 한도를 초과했을 때 사용한다.

# Server Error Response (5xx)

500 Internal Server Error: status: false, code: 500, message: "internal_server_error", data: null

서버 내부 오류가 발생했을 때 사용한다.

502 Bad Gateway: status: false, code: 502, message: "bad_gateway", data: null

게이트웨이 오류가 발생했을 때 사용한다.

503 Service Unavailable: status: false, code: 503, message: "service_unavailable", data: null

서비스를 일시적으로 이용할 수 없을 때 사용한다.

504 Gateway Timeout: status: false, code: 504, message: "gateway_timeout", data: null

게이트웨이 타임아웃이 발생했을 때 사용한다.

# Additional Error Messages

리소스 관련:

resource_in_use - 리소스가 사용 중일 때
resource_limit_exceeded - 리소스 한도를 초과했을 때

네트워크 관련:

connection_timeout - 연결 타임아웃이 발생했을 때
connection_lost - 연결이 끊겼을 때
request_cancelled - 요청이 취소되었을 때

# Error Message Format

에러 내용은 message 필드에 작성한다.
data 필드는 기본적으로 null로 설정한다.
에러 메시지는 snake_case 컨벤션을 따른다.
간결하고 명확하게 작성하며, 동사 + 명사 또는 형용사 + 명사 패턴을 사용한다.

# Response Type Definition

응답 타입은 Generic을 사용하여 정의한다.
Java의 경우 Dataclass와 TypeVar를 사용한다.
모든 필드에 Type Hinting을 명시한다.

# Helper Functions

성공 응답을 생성하는 success_response 함수를 제공한다:

status: true, message: "success", data: 실제 데이터 반환.

에러 응답을 생성하는 error_response 함수를 제공한다:

status: false, message: 에러 메시지, data: null 반환.

함수는 한 가지 목적만 수행하며, 간결하게 작성한다.

# Naming Conventions

에러 메시지는 snake_case만 사용한다.
camelCase, PascalCase 사용 금지.
일관된 패턴을 유지한다 (예: invalid_*, *_required, *_not_found).
너무 긴 표현이나 모호한 표현을 피한다.
