# 📋 날씨 정보 서비스 요구 사항 명세서 (SRS)

**Project**: Modern Weather Dashboard  
**Stack**: Next.js 14 (App Router), shadcn/ui, Tailwind CSS, Lucide React (Icons)  
**Goal**: 위치 기반의 실시간 날씨 데이터를 직관적이고 미니멀한 디자인으로 제공

---

## 1. 기능적 요구 사항 (Functional Requirements)

### 1.1 위치 검색 및 설정

- **현재 위치 기반**: 브라우저 Geolocation API를 활용하여 접속 지역 날씨 자동 로드.
- **지역 검색**: 전 세계 도시 이름(영문/국문) 검색 기능 (Debounce 적용으로 API 호출 최적화).
- **즐겨찾기**: 자주 확인하는 지역을 로컬 스토리지(Local Storage)에 저장하여 빠른 접근 허용.

### 1.2 실시간 날씨 정보 제공

- **핵심 지표**: 기온(현재, 최고/최저), 날씨 상태(아이콘 및 텍스트), 체감 온도.
- **상세 지표**: 습도, 풍속, 자외선 지수, 가시거리, 기압 정보 제공.
- **시간대별 예보**: 향후 24시간 동안의 기온 변화를 가로 스크롤 형태로 표시.
- **주간 예보**: 향후 7일간의 날씨 요약 정보 제공.

### 1.3 시각적 피드백 및 위젯

- **날씨별 배경 변경**: 맑음, 흐림, 비, 눈 등 날씨 상태에 따른 동적 배경색/그래디언트 적용.
- **단위 변환**: 섭씨(°C) / 화씨(°F) 전환 기능.

---

## 2. 비기능적 요구 사항 (Non-Functional Requirements)

### 2.1 UI/UX 디자인 (Modern & Simple)

- **shadcn/ui 활용**: `Card`, `Input`, `Button`, `Skeleton`, `Tabs` 컴포넌트를 사용하여 일관된 디자인 시스템 유지.
- **반응형 설계**: 모바일(Mobile-first), 태블릿, 데스크탑 등 모든 디바이스에서 최적화된 레이아웃 제공.
- **다크/라이트 모드**: `next-themes`를 활용한 완벽한 테마 지원.
- **애니메이션**: 레이아웃 전환 및 데이터 로딩 시 `framer-motion`을 활용한 부드러운 인터랙션.

### 2.2 성능 및 가용성

- **Server Component**: 정적 데이터 fetching은 서버 컴포넌트에서 처리하여 초기 로딩 속도(LCP) 개선.
- **Caching**: API 응답 데이터를 일정 시간 캐싱하여 불필요한 호출 방지.
- **Error Boundary**: API 호출 실패 시 사용자에게 친절한 에러 메시지 및 재시도 버튼 노출.

---

## 3. 기술 스택 상세 (Tech Stack)


| 구분                   | 기술 스택                               |
| -------------------- | ----------------------------------- |
| **Framework**        | Next.js 14 (App Router)             |
| **Styling**          | Tailwind CSS                        |
| **UI Components**    | shadcn/ui (Radix UI 기반)             |
| **State Management** | React Query (TanStack Query) 또는 SWR |
| **Icons**            | Lucide React                        |
| **Weather API**      | OpenWeatherMap 또는 WeatherAPI        |


---

## 4. 페이지 구조 (Information Architecture)

- **Main Page**: 
  - Header (지역 검색 및 테마 스위치)
  - Hero Section (현재 지역 대형 날씨 위젯)
  - Grid Section (상세 지표 카트들 - 습도, 풍속 등)
  - Forecast Section (시간별/일별 차트 및 리스트)
- **Settings/Bookmark**: 즐겨찾기 목록 관리 및 환경 설정

---

## 5. 구현 단계 (Implementation Plan)

### Phase 1: 프로젝트 기반 설정 ✅

| 단계 | 작업 내용 | 상태 |
|------|----------|------|
| 1.1 | shadcn/ui 초기화 및 필수 컴포넌트 설치 (`Card`, `Input`, `Button`, `Skeleton`, `Tabs`) | ✅ |
| 1.2 | 추가 패키지 설치: `lucide-react`, `next-themes`, `framer-motion`, `@tanstack/react-query`, `zustand` | ✅ |
| 1.3 | 프로젝트 폴더 구조 설정 (`components/`, `hooks/`, `lib/`, `types/`, `services/`, `providers/`) | ✅ |
| 1.4 | 환경 변수 설정 (`.env.local` - Weather API 키) | ✅ |
| 1.5 | 다크/라이트 테마 Provider 설정 (`next-themes`) | ✅ |

### Phase 2: 공통 레이아웃 및 UI 구성 ✅

| 단계 | 작업 내용 | 상태 |
|------|----------|------|
| 2.1 | 루트 레이아웃 수정 (`layout.tsx` - 메타데이터, 폰트, ThemeProvider) | ✅ |
| 2.2 | Header 컴포넌트 구현 (로고, 검색바, 테마 토글 버튼) | ✅ |
| 2.3 | 검색 Input 컴포넌트 구현 (Debounce 적용, 자동완성 드롭다운) | ✅ |
| 2.4 | 온도 단위 전환 토글 (°C / °F) 컴포넌트 구현 | ✅ |

### Phase 3: Weather API 연동 ✅

| 단계 | 작업 내용 | 상태 |
|------|----------|------|
| 3.1 | Weather API 타입 정의 (`types/weather.ts`) | ✅ |
| 3.2 | API 서비스 함수 구현 (`services/weather.ts` - 현재 날씨, 시간별, 주간 예보) | ✅ |
| 3.3 | React Query 설정 및 커스텀 훅 구현 (`hooks/useWeather.ts`) | ✅ |
| 3.4 | Geolocation API 훅 구현 (`hooks/useGeolocation.ts`) | ✅ |
| 3.5 | 도시 검색 API 연동 및 훅 구현 (`hooks/useCitySearch.ts`) | ✅ |

### Phase 4: 메인 페이지 - 날씨 위젯 구현 ✅

| 단계 | 작업 내용 | 상태 |
|------|----------|------|
| 4.1 | Hero Section - 현재 날씨 대형 위젯 (도시명, 기온, 날씨 상태, 아이콘) | ✅ |
| 4.2 | 상세 지표 Grid - 습도, 풍속, 자외선, 가시거리, 기압 카드 | ✅ |
| 4.3 | 시간별 예보 - 24시간 가로 스크롤 컴포넌트 | ✅ |
| 4.4 | 주간 예보 - 7일 날씨 리스트 컴포넌트 | ✅ |
| 4.5 | 날씨별 동적 배경 그래디언트 적용 | ✅ |

### Phase 5: 즐겨찾기 기능 ✅

| 단계 | 작업 내용 | 상태 |
|------|----------|------|
| 5.1 | 즐겨찾기 상태 관리 훅 (`hooks/useFavorites.ts` - LocalStorage with Zustand) | ✅ |
| 5.2 | 즐겨찾기 추가/삭제 버튼 컴포넌트 | ✅ |
| 5.3 | 즐겨찾기 목록 UI | ✅ |

### Phase 6: 에러 처리 및 로딩 상태 ✅

| 단계 | 작업 내용 | 상태 |
|------|----------|------|
| 6.1 | Skeleton 로딩 UI 적용 (각 위젯별) | ✅ |
| 6.2 | Error Boundary 컴포넌트 구현 | ✅ |
| 6.3 | API 실패 시 에러 메시지 및 재시도 버튼 UI | ✅ |
| 6.4 | Geolocation 권한 거부 시 대체 UI | ✅ |

### Phase 7: 애니메이션 및 최종 마무리 ✅

| 단계 | 작업 내용 | 상태 |
|------|----------|------|
| 7.1 | Framer Motion 애니메이션 적용 (페이지 전환, 카드 등장) | ✅ |
| 7.2 | 반응형 디자인 최적화 (모바일, 태블릿, 데스크탑) | ✅ |
| 7.3 | 접근성(a11y) 점검 및 개선 | ✅ |
| 7.4 | 성능 최적화 (이미지, 캐싱 전략 점검) | ✅ |
| 7.5 | 최종 테스트 및 버그 수정 | ✅ |

---

## 6. 실행 방법

### 환경 설정

1. OpenWeatherMap API 키 발급: https://openweathermap.org/api
2. `.env.local` 파일에 API 키 설정:

```bash
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
npm start
```

---

## 7. 프로젝트 구조

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # shadcn/ui 컴포넌트
│   └── weather/               # 날씨 관련 컴포넌트
│       ├── current-weather.tsx
│       ├── daily-forecast.tsx
│       ├── error-message.tsx
│       ├── favorite-button.tsx
│       ├── favorites-list.tsx
│       ├── header.tsx
│       ├── hourly-forecast.tsx
│       ├── search-input.tsx
│       ├── theme-toggle.tsx
│       ├── unit-toggle.tsx
│       └── weather-details.tsx
├── hooks/
│   ├── useCitySearch.ts
│   ├── useDebounce.ts
│   ├── useFavorites.ts
│   ├── useGeolocation.ts
│   ├── useTemperatureUnit.ts
│   └── useWeather.ts
├── lib/
│   └── utils.ts
├── providers/
│   ├── query-provider.tsx
│   └── theme-provider.tsx
├── services/
│   └── weather.ts
└── types/
    └── weather.ts
```

