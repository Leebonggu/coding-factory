# Coding Factory

모듈 조합으로 웹 프로젝트를 빠르게 생성하는 보일러플레이트 시스템.

랜딩페이지, SaaS, 이커머스 등 어떤 유형이든 CLI 한 줄로 프로젝트를 생성하고, 필요한 모듈을 추가/제거할 수 있습니다.

## 빠른 시작

### 1. 레포 클론 + 의존성 설치

```bash
git clone https://github.com/Leebonggu/coding-factory.git
cd coding-factory
pnpm install
```

### 2. CLI 빌드

```bash
pnpm --filter @coding-factory/cli build
```

### 3. 프로젝트 생성

```bash
node packages/cli/dist/index.js init my-project
```

인터렉티브 프롬프트가 실행됩니다:

```
? Select a preset
  ○ landing    — Landing page / company site
  ○ saas       — SaaS application with dashboard
  ○ ecommerce  — E-commerce with payments
  ○ custom     — Pick modules manually

? Select a theme
  ○ default    — 뉴트럴 톤
  ○ corporate  — 블루/포멀
  ○ playful    — 밝은/캐주얼
```

### 4. 생성된 프로젝트 실행

```bash
cd my-project
pnpm install
pnpm dev
```

## 모듈 추가/제거

프로젝트 생성 후에도 모듈을 추가하거나 제거할 수 있습니다.

```bash
cd my-project

# 결제 모듈 추가
node /path/to/coding-factory/packages/cli/dist/index.js add payments

# 광고 모듈 제거
node /path/to/coding-factory/packages/cli/dist/index.js remove ads
```

의존성은 자동 해결됩니다. `auth` 추가 시 `db`가 필요하면 함께 추가할지 물어봅니다.

## 프리셋

| 프리셋 | 포함 모듈 | 용도 |
|--------|-----------|------|
| **landing** | seo, analytics, ads | 랜딩페이지, 회사 소개 |
| **saas** | auth, db, security, analytics, seo | SaaS 대시보드 |
| **ecommerce** | auth, db, security, seo, analytics, ads, payments | 결제가 필요한 서비스 |
| **custom** | 직접 선택 | 자유 조합 |

## 모듈

| 모듈 | 설명 |
|------|------|
| `seo` | 메타태그, sitemap, robots.txt, JSON-LD, 한국 포털 대응 |
| `analytics` | GA4, GTM, 이벤트 트래킹, 쿠키 동의 배너 |
| `ads` | Google AdSense, Naver AdPost, 광고 슬롯 컴포넌트 |
| `security` | HTTP 보안 헤더, CSP, CSRF, Rate Limiting, Zod 검증 |
| `db` | Prisma 데이터베이스 어댑터 (PostgreSQL 기본) |
| `auth` | NextAuth.js v5 (Google/Kakao/Naver 소셜 + 이메일/비밀번호) |
| `payments` | Toss Payments / Stripe 결제 연동 (어댑터 패턴) |

## 테마

3가지 디자인 토큰을 제공합니다. CSS 변수 기반이라 토큰 파일 하나로 전체 룩이 변경됩니다.

- **default** — 뉴트럴 톤
- **corporate** — 블루 계열, 포멀
- **playful** — 밝고 캐주얼

## 환경변수 설정

프로젝트 생성 시 `.env.local` 파일이 자동 생성됩니다. 사용하는 모듈에 따라 값을 채워주세요.

```env
# SEO
NEXT_PUBLIC_SITE_URL=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GTM_ID=

# Auth (saas/ecommerce)
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# DB (saas/ecommerce)
DATABASE_URL=

# Payments (ecommerce)
PAYMENT_PROVIDER=toss
TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
```

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **DB**: Prisma (옵셔널)
- **Auth**: NextAuth.js v5 (옵셔널)
- **Payments**: Toss Payments / Stripe (옵셔널)

## 생성된 프로젝트 구조

```
my-project/
├── src/
│   ├── app/                # Next.js App Router 페이지
│   ├── components/         # React 컴포넌트
│   ├── lib/                # 유틸리티, 설정
│   └── styles/             # CSS, 디자인 토큰
├── prisma/                 # DB 스키마 (db 모듈 사용 시)
├── factory.config.json     # 적용된 프리셋/모듈 기록
├── .env.local              # 환경변수
└── package.json
```

생성된 프로젝트는 coding-factory에 대한 의존성이 없는 **독립적인 Next.js 앱**입니다.
