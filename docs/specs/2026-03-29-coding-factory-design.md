# Coding Factory - 설계 스펙

## Context

외주 프로젝트를 빠르게 찍어내기 위한 모듈형 보일러플레이트 시스템.
랜딩페이지, SaaS, 이커머스 등 어떤 유형이든 모듈 조합으로 생성한다.
1인 개발자, 소규모 에이전시가 사용하며, 동시에 판매 가능한 제품으로 설계한다.

## 아키텍처: Registry + Codegen (shadcn/ui 모델)

레지스트리에 모듈 소스가 존재하고, CLI가 선택된 모듈의 코드를 복사해서 일반 Next.js 프로젝트를 생성한다.
생성된 프로젝트는 workspace나 특수 구조 없이 **평범한 Next.js 앱**이다.

### 핵심 차별점
- `factory add <module>`: 프로젝트 생성 후에도 모듈 추가 가능
- 생성물이 깨끗한 Next.js 앱 → 구매자가 바로 이해/수정 가능
- shadcn/ui 사용자층과 동일한 멘탈 모델

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix 기반)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **DB (옵셔널)**: Prisma (기본 어댑터), Drizzle/Supabase 교체 가능
- **Auth (옵셔널)**: NextAuth.js v5
- **배포**: Vercel 기본, 다른 플랫폼도 가능

## 프로젝트 구조

```
coding-factory/
├── registry/
│   ├── registry.json              # 전체 모듈 목록 + 의존성 매트릭스
│   ├── modules/
│   │   ├── seo/
│   │   │   ├── module.json        # 의존성, 파일 목록, config 패치
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── app/
│   │   ├── analytics/
│   │   ├── ads/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── security/
│   │   └── payments/
│   ├── design-system/
│   │   ├── tokens/                # default.json, corporate.json, playful.json
│   │   ├── layouts/               # marketing, dashboard
│   │   └── templates/             # hero, pricing, feature-grid, faq, footer 등
│   └── presets/
│       ├── landing.json           # seo + analytics + ads
│       ├── saas.json              # auth + db + security + analytics
│       └── ecommerce.json         # auth + db + payments + seo + ads
├── packages/
│   └── cli/
│       └── src/
│           ├── commands/
│           │   ├── init.ts        # create-factory (프리셋 선택 → 프로젝트 생성)
│           │   ├── add.ts         # factory add <module>
│           │   └── remove.ts      # factory remove <module>
│           └── codegen/
│               ├── route-injector.ts   # 라우트 파일 주입
│               ├── config-merger.ts    # middleware/config 머징
│               ├── dep-installer.ts    # npm 의존성 설치
│               └── env-scaffolder.ts   # .env.example 업데이트
└── starters/
    └── base/                      # 기본 Next.js + Tailwind + shadcn/ui 앱
        ├── package.json
        ├── next.config.ts
        ├── tailwind.config.ts
        ├── components.json
        └── src/
            ├── app/
            │   ├── layout.tsx
            │   └── page.tsx
            ├── components/
            ├── lib/
            └── styles/
```

## 모듈 매니페스트 (module.json)

각 모듈은 `module.json`으로 자신을 선언한다:

```json
{
  "name": "auth",
  "description": "NextAuth.js v5 인증 (소셜 + 이메일/비밀번호)",
  "category": "security",
  "dependencies": {
    "next-auth": "^5",
    "@auth/prisma-adapter": "^2"
  },
  "requiredModules": ["db"],
  "optionalModules": ["analytics"],
  "files": [
    { "source": "components/login-form.tsx", "target": "src/components/auth/login-form.tsx" },
    { "source": "components/signup-form.tsx", "target": "src/components/auth/signup-form.tsx" },
    { "source": "lib/auth.ts", "target": "src/lib/auth.ts" },
    { "source": "app/(auth)/login/page.tsx", "target": "src/app/(auth)/login/page.tsx" },
    { "source": "app/(auth)/register/page.tsx", "target": "src/app/(auth)/register/page.tsx" }
  ],
  "configPatches": [
    { "file": "src/middleware.ts", "action": "merge", "source": "middleware.ts" },
    { "file": ".env.example", "action": "append", "content": "NEXTAUTH_SECRET=\nNEXTAUTH_URL=" }
  ],
  "envVars": ["NEXTAUTH_SECRET", "NEXTAUTH_URL"]
}
```

CLI는 `requiredModules`를 읽고 의존성을 자동 해결한다.
`factory add auth` 실행 시 → "auth는 db가 필요합니다. 함께 추가할까요?" 프롬프트.

## 디자인시스템

3개 레이어 구조:

### 1. 토큰 (Token)
CSS 변수 기반. 테마 파일 하나로 전체 사이트 룩 변경.

```css
:root {
  --factory-primary: 222.2 84% 4.9%;
  --factory-secondary: 210 40% 96%;
  --factory-radius: 0.5rem;
  --factory-font-sans: 'Pretendard', sans-serif;
}
```

기본 테마 3종: default (뉴트럴), corporate (블루/포멀), playful (밝은/캐주얼)

### 2. 컴포넌트 (Component)
shadcn/ui 그대로 사용. 토큰을 참조하므로 테마 변경 시 자동 반영.

### 3. 템플릿 (Template)
조합된 섹션 컴포넌트. `factory add`로 개별 추가 가능.

- hero-section (3-4 배리에이션)
- feature-grid
- pricing-table
- testimonial
- cta-section
- faq-accordion
- footer (2-3 배리에이션)

### 레이아웃
페이지 뼈대 3종:
- **marketing**: 풀스크린 Hero + 섹션 스크롤 (랜딩)
- **dashboard**: 사이드바 + 탑바 + 콘텐츠 (SaaS/어드민)
- **ecommerce**: marketing 기반 + 결제 통합 레이아웃

## 마케팅 모듈

### SEO (`module-seo`) — 독립
- 페이지별 메타태그 자동 생성 (Next.js metadata API)
- sitemap.xml / robots.txt 자동 생성
- JSON-LD Structured Data (제품, FAQ, 조직)
- 한국 포털 대응: Naver 웹마스터, Daum 검색등록 메타태그

### Analytics (`module-analytics`) — 독립
- GA4 통합
- GTM 컨테이너 자동 설정
- 이벤트 트래킹 유틸 함수
- 쿠키 동의 배너 (GDPR/개인정보보호법)

### Ads (`module-ads`) — analytics 선택적 의존
- Google AdSense 자동/수동 배치 컴포넌트
- Naver AdPost 통합
- 선언적 광고 슬롯: `<AdSlot position="sidebar" />`
- 광고 차단 감지 + 대체 콘텐츠

## 보안 모듈

### Security (`module-security`) — 독립
- HTTP 보안 헤더 (CSP, X-Frame-Options, HSTS) — Next.js middleware
- API Rate Limiting
- CSRF 보호
- Zod 기반 입력 검증 유틸
- 환경변수 보안 (.env.example 자동 생성, 런타임 체크)

### Auth (`module-auth`) — db 필수, security 권장
- NextAuth.js v5 (소셜: Google, Kakao, Naver)
- 이메일/비밀번호 credentials provider
- JWT or DB 세션 관리
- middleware 기반 보호 라우트

## DB 모듈 (`module-db`) — 옵셔널

어댑터 패턴. repository 인터페이스만 정의하고 구현체 교체 가능.

- **Prisma** (기본): PostgreSQL 기본, MySQL/SQLite 전환 가능
- **Drizzle**: 경량 대안
- **None**: DB 없이 동작 (랜딩페이지 등)

## 결제 모듈

### Payments (`module-payments`) — db 선택적 의존
범용 결제 연동 모듈. "무엇을 파는지"는 모르고 "결제 처리"만 담당.
프로젝트 종류(SaaS 구독, 강의 결제, 쇼핑몰 등)에 무관하게 사용 가능.

- **PG 어댑터 패턴**: Toss Payments (국내) / Stripe (글로벌) 통일 인터페이스
- **API Routes**: 결제 요청(checkout), 결제 확인(verify/confirm), 웹훅 수신
- **UI 컴포넌트**: PaymentButton, PaymentStatus
- **Prisma 스키마**: Payment 모델 (결제 기록 저장, DB 모듈 의존 시)
- **유틸**: 금액 포맷, 결제 상태 타입

## CLI 동작

### 프로젝트 생성
```bash
npx create-factory my-project
# → 프리셋 선택 (landing / saas / ecommerce / custom)
# → 테마 선택 (default / corporate / playful)
# → 추가 모듈 토글
# → 프로젝트 생성
```

### 모듈 추후 추가
```bash
cd my-project
npx factory add auth
# → "auth는 db가 필요합니다. 함께 추가할까요?" (Y/n)
# → 파일 복사 + 의존성 설치 + config 패치
```

### 모듈 제거
```bash
npx factory remove ads
# → 관련 파일 삭제 + 의존성 정리
```

## 배포/판매 전략

- **저장소**: Private GitHub repo
- **판매**: Gumroad 등에서 결제 → GitHub repo 접근권 자동 부여
- **CLI 배포**: repo 안에 포함. `npx` 로 직접 실행하거나 global install

## 단계별 빌드 순서

### Phase 1: Foundation
- `starters/base/` — Next.js 15 + Tailwind + shadcn/ui 기본 앱
- `registry/design-system/` — 토큰 + 2-3 레이아웃 + 3-4 템플릿
- `packages/cli/` — `init` 명령어만

### Phase 2: Marketing Modules
- `module-seo`
- `module-analytics`
- `module-ads`
- CLI `add` 명령어

### Phase 3: Security + Auth
- `module-security`
- `module-auth`
- `module-db` (Prisma 어댑터)

### Phase 4: Payments + Presets + 확장
- `module-payments` (Toss Payments / Stripe 어댑터)
- `presets/saas.json`, `presets/ecommerce.json`
- CLI `remove` 명령어

## 미들웨어 머징 전략

여러 모듈이 middleware를 주입할 때 충돌 방지를 위한 컨벤션:

```typescript
// src/middleware.ts (생성되는 파일)
import { chain } from '@/lib/middleware-chain'
import { securityMiddleware } from '@/lib/middlewares/security'
import { authMiddleware } from '@/lib/middlewares/auth'

export default chain([securityMiddleware, authMiddleware])
```

각 모듈은 `src/lib/middlewares/` 에 자신의 middleware 파일을 드롭한다.
AST 조작 없이 import/배열 추가만으로 머징 완료.
