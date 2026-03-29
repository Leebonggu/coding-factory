# Coding Factory — AI Agent 가이드

## 프로젝트 개요
외주 프로젝트를 모듈 조합으로 빠르게 생성하는 보일러플레이트 시스템.
Registry + Codegen 아키텍처 (shadcn/ui 모델) — CLI가 레지스트리에서 코드를 복사해 독립적인 Next.js 프로젝트를 생성한다.

## 구조

```
coding-factory/
├── starters/base/          # Next.js 15 + Tailwind v4 + shadcn/ui 기본 앱
├── registry/
│   ├── registry.json       # 전체 모듈 목록 + 프리셋 + 테마 정의
│   ├── modules/            # 7개 모듈 (seo, analytics, ads, security, auth, db, payments)
│   │   └── <module>/
│   │       ├── module.json # 매니페스트 (파일 목록, 의존성, 환경변수)
│   │       ├── lib/        # 서버 유틸
│   │       ├── components/ # React 컴포넌트
│   │       ├── app/        # Next.js App Router 라우트
│   │       └── ...
│   ├── design-system/      # 토큰(3종), 레이아웃(2종), 템플릿(3종)
│   └── presets/            # landing.json, saas.json, ecommerce.json
├── packages/cli/           # CLI 도구 (@coding-factory/cli)
│   └── src/
│       ├── commands/       # init, add, remove
│       └── utils/          # codegen.ts, registry.ts
└── docs/specs/             # 설계 스펙 문서
```

## 기술 스택
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui (new-york)
- Prisma (DB 어댑터), NextAuth.js v5 (인증)
- pnpm workspace 모노레포
- CLI: Commander + @clack/prompts + tsup (ESM)

## 모듈 시스템
각 모듈은 `module.json` 매니페스트로 선언됨:
- `files`: source → target 매핑 (CLI가 복사)
- `dependencies` / `devDependencies`: package.json에 머지
- `requiredModules`: 필수 의존 모듈 (CLI가 자동 해결)
- `optionalModules`: 선택적 의존
- `envVars`: 필요한 환경변수 목록

## 모듈 목록
| 모듈 | 설명 | 필수 의존 |
|------|------|-----------|
| seo | 메타태그, sitemap, robots.txt, JSON-LD | - |
| analytics | GA4, GTM, 쿠키 동의 | - |
| ads | AdSense, AdPost | - |
| security | 보안 헤더, CSP, rate limit, CSRF | - |
| db | Prisma 어댑터 | - |
| auth | NextAuth.js v5 소셜/Credentials | db |
| payments | Toss Payments / Stripe PG 어댑터 | - (db 선택적) |

## 프리셋
- **landing**: seo + analytics + ads
- **saas**: auth + db + security + analytics + seo
- **ecommerce**: auth + db + security + seo + analytics + ads + payments

## CLI 사용법

```bash
# 프로젝트 생성 (인터렉티브)
node packages/cli/dist/index.js init my-project

# 기존 프로젝트에 모듈 추가
node packages/cli/dist/index.js add payments

# 모듈 제거
node packages/cli/dist/index.js remove ads
```

## 개발 워크플로우
- main 직접 푸시 금지 → feature 브랜치에서 작업 후 PR 머지
- CLI 수정 후 반드시 `pnpm --filter @coding-factory/cli build` 실행
- 모듈 추가/수정 후 테스트: 프리셋별 프로젝트 생성 → `pnpm install` → `next build`

## 새 모듈 추가 시
1. `registry/modules/<name>/module.json` 매니페스트 작성
2. `lib/`, `components/`, `app/` 등 소스 파일 작성
3. `registry/registry.json`의 modules에 등록
4. 필요 시 프리셋에 추가
5. CLI 빌드 → 테스트

## 주의사항
- 생성된 프로젝트는 coding-factory에 대한 런타임 의존성 없음 (완전 독립)
- `.d.ts` 파일은 명시적 import 하지 않음 (tsconfig include로 자동 인식)
- payments 모듈은 어댑터 패턴 — PaymentAdapter 인터페이스 구현체만 추가하면 PG 확장 가능
- 미들웨어는 체인 패턴 사용 (`src/lib/middleware-chain.ts`)
- CSS 변수 기반 디자인 토큰 시스템 (`var(--primary)` 등)
