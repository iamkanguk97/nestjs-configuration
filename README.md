# NestJS Configuration 학습 프로젝트

NestJS의 [Configuration](https://docs.nestjs.com/techniques/configuration) 기능을 학습하고, 객체지향 패러다임을 적용할 겸 필자의 입맛대로 구현을 해본 프로젝트입니다.

## 프로젝트 개요

> [!NOTE]
>
> - 이 프로젝트는 **NestJS의 환경 변수 관리 방법을 학습**하고, `공식문서보다 타입 안전성과 유지보수성을 추가적으로 고려한 설계를 실습`하기 위해 만들어졌습니다.
> - 단순히 공식 문서의 예제를 따라하는 것이 아닌, 실무에서 사용할 수 있는 수준의 구조와 패턴을 적용했습니다.

## 주요 특징

### 1. 객체지향적인 환경 변수 관리

#### EnvironmentService: 타입 안전한 환경 변수 접근

`ConfigService`를 직접 사용하지 않고 `EnvironmentService`로 감싸서 다음과 같은 이점을 제공합니다:

> [!NOTE]
>
> - **타입 안전성**: `keyof IEnvironment`를 통한 컴파일 타임 검증
> - **명확한 인터페이스**: `getString()`, `getNumber()`, `getBoolean()` 등 타입별 메서드 제공
> - **도메인 로직 캡슐화**: `getApplicationPort()`, `isProduction()` 등 비즈니스 로직 포함
> - **단일 책임 원칙**: 환경 변수 관리에만 집중

```typescript
// src/environment/environment.service.ts
@Injectable()
export class EnvironmentService {
  getString(key: keyof IEnvironment): string | never;
  getNumber(key: keyof IEnvironment): number | never;
  getApplicationPort(): number;
  isLocal(): boolean;
  isDevelopment(): boolean;
  isProduction(): boolean;
}
```

#### Zod를 활용한 환경 변수 검증

런타임에 환경 변수의 유효성을 검증하여 애플리케이션 시작 시점에 오류를 조기 발견합니다:

```typescript
// src/environment/environment.validation.ts
export const EnvironmentSchema = z.object({
  ENV: z.enum([NODE_ENV.LOCAL, NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION, NODE_ENV.TEST]),
  PORT: z.coerce.number().positive().optional(),
  DATABASE_URL: z.string(),
});
```

### 2. 테스트 적용

이번 프로젝트에서는 테스트 코드를 처음으로 환경 변수 관리에 적극적으로 적용해 보았습니다.
특히 **EnvironmentService**가 올바르게 동작하는지, 각 환경 변수에 타입 안전하게 접근되는지 단위 테스트를 통해 검증하고 있습니다.

> [!IMPORTANT]
>
> - 환경 변수는 애플리케이션의 핵심 설정 정보를 담고 있어 **철저한 테스트가 필수**라고 생각했습니다.
> - 테스트를 통해 개발 및 배포 환경에서 안전하게 동작할 수 있도록 보장합니다.

**주요 테스트 포인트:**

- 정의되지 않은/잘못된 환경 변수 접근 시 예외 처리
- 각 타입별(`string`, `number`, `boolean`) 접근 및 변환 검증
- 비즈니스 로직(`isProduction()`, `getApplicationPort()` 등) 정상 동작 여부

테스트 코드 예시:

```typescript
// src/environment/__test__/environment.service.spec.ts
it('문자열 환경변수를 반환해야 한다.', () => {
  mockConfigService.getOrThrow.mockReturnValue('local');

  const result = environmentService.getString('ENV');

  expect(result).toBe('local');
  expect(mockConfigService.getOrThrow).toHaveBeenCalledWith('ENV');
});
```

위와 같이 환경 변수의 타입 및 값 검증을 테스트 코드로 보장하므로  
운영 환경에서도 **신뢰할 수 있는 환경 변수 관리**가 가능합니다.

## 설치 및 실행

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성합니다:

```bash
# NODE_ENV
ENV=local

# Prisma
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
```

### 3. 데이터베이스 설정

Docker Compose를 사용하여 PostgreSQL 실행:

```bash
docker-compose up -d
```

Prisma 마이그레이션 및 클라이언트 생성:

```bash
pnpm run prisma:generate
```

### 4. 애플리케이션 실행

```bash
# 개발 모드 (watch mode)
pnpm run start:dev

# 일반 실행
pnpm run start
```

### 5. API 문서 확인

애플리케이션 실행 후 Swagger 문서를 확인할 수 있습니다:

```
http://localhost:9090/api-docs
```

## 테스트

```bash
# 유닛 테스트
pnpm run test

# 테스트 (watch mode)
pnpm run test:watch

# 테스트 커버리지
pnpm run test:cov
```

## 코드 품질

```bash
# 린트 실행 및 자동 수정
pnpm run lint

# 코드 포맷팅
pnpm run format
```
