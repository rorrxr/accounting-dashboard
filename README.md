# Accounting Dashboard (Frontend)

자동 회계 처리 시스템의 React 기반 웹 대시보드입니다. 은행 거래 내역의 분류 결과를 시각화하고 관리할 수 있습니다.

### [🔎 백엔드 레포지토리 링크 auto-accounting-proseccor](http://github.com/rorrxr/auto-accounting-proseccor)


## 🎯 프로젝트 개요

'A 커머스'와 'B 커머스' 2개 사업체의 은행 거래 내역을 자동 분류한 결과를 직관적인 웹 인터페이스로 제공하는 대시보드입니다.

## 🎨 주요 기능

- **📊 대시보드**: 사업체별 거래 내역 및 분류 결과 시각화
- **📁 파일 업로드**: 은행 거래 내역 CSV + 분류 규칙 JSON 업로드
- **🏢 다중 사업체 관리**: A 커머스, B 커머스 계정 분리 관리
- **⚙️ 분류 규칙 설정**: 키워드 기반 자동 분류 규칙 생성/수정
- **📈 리포트**: 기간별, 카테고리별 거래 내역 분석
- **🔍 거래 검색**: 날짜, 카테고리, 키워드로 거래 내역 검색
- **🚨 미분류 관리**: 분류되지 않은 거래 내역 수동 분류

## 🎨 주요 화면

### 📊 메인 대시보드
- 사업체별 거래 요약 (A 커머스 vs B 커머스)
- 계정과목별 지출/수입 파이차트
- 월별 거래 트렌드 라인차트
- 분류 성공률 KPI 지표

### 📁 파일 업로드 & 처리
- 동시 파일 업로드 (CSV + JSON)
- 실시간 분류 진행률 표시
- 분류 결과 요약 및 미리보기
- 오류 거래 내역 수정 인터페이스

### ⚙️ 분류 규칙 관리
- 사업체별 카테고리 관리
- 키워드 추가/수정/삭제
- 규칙 우선순위 설정
- 테스트 모드로 규칙 검증

## 🛠️ 기술 스택

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Zustand + React Query
- **Charts**: Chart.js + React Chart.js 2
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod
- **File Upload**: React Dropzone
- **Date Handling**: Day.js

## 🏗️ 컴포넌트 아키텍처

```
src/
├── components/
│   ├── dashboard/           # 대시보드 전용 컴포넌트
│   │   ├── CompanySummaryCard.jsx
│   │   ├── CategoryPieChart.jsx
│   │   ├── MonthlyTrendChart.jsx
│   │   └── ClassificationKPI.jsx
│   ├── upload/              # 파일 업로드 관련
│   │   ├── FileUploadZone.jsx
│   │   ├── ProcessingProgress.jsx
│   │   └── ResultPreview.jsx
│   ├── transactions/        # 거래 내역 관리
│   │   ├── TransactionTable.jsx
│   │   ├── TransactionFilter.jsx
│   │   └── UnclassifiedManager.jsx
│   └── common/              # 공통 컴포넌트
│       ├── Layout.jsx
│       ├── Modal.jsx
│       └── LoadingSpinner.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Upload.jsx
│   ├── Companies.jsx
│   ├── Rules.jsx
│   └── Transactions.jsx
├── hooks/
│   ├── useTransactions.js
│   ├── useUpload.js
│   └── useClassification.js
├── stores/
│   ├── authStore.js
│   ├── companyStore.js
│   └── transactionStore.js
└── services/
    ├── api.js
    ├── uploadService.js
    └── classificationService.js
```

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/your-org/accounting-dashboard.git
cd accounting-dashboard
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
cp .env.example .env.local
```

`.env.local` 파일 설정:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Accounting Dashboard
VITE_MAX_FILE_SIZE=10485760
VITE_SUPPORTED_COMPANIES=com_1,com_2
VITE_DEFAULT_COMPANY=com_1
```

### 4. 개발 서버 실행
```bash
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

## 🐳 Docker 배포 설정

### Dockerfile
```dockerfile
# Multi-stage build for React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user for security
RUN addgroup -g 1001 -S nginx && \
    adduser -u 1001 -D -S -G nginx nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
    listen 70;
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # CORS 헤더 설정
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

    # OPTIONS 요청 처리
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }

    # 정적 파일 서빙
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # 회계 처리 API
    location /api/accounting/process {
        proxy_pass http://18.140.95.253:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header 'Access-Control-Allow-Origin' '*';
    }

    # 분류된 거래 조회 API
    location /api/accounting/records {
        proxy_pass http://18.140.95.253:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header 'Access-Control-Allow-Origin' '*';
    }

    # 페이징된 거래 조회 API
    location /api/accounting/records/paged {
        proxy_pass http://18.140.95.253:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header 'Access-Control-Allow-Origin' '*';
    }

    # 미분류 거래 조회 API
    location /api/accounting/unclassified {
        proxy_pass http://18.140.95.253:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header 'Access-Control-Allow-Origin' '*';
    }

    # 전체 수입/지출 요약 API
    location ~ ^/api/accounting/summary/total/(.+)$ {
        proxy_pass http://18.140.95.253:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header 'Access-Control-Allow-Origin' '*';
    }

    # 카테고리별 수입/지출 요약 API
    location ~ ^/api/accounting/summary/categories/(.+)$ {
        proxy_pass http://18.140.95.253:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header 'Access-Control-Allow-Origin' '*';
    }

    # 헬스체크 API
    location /api/v1/health {
        proxy_pass http://18.140.95.253:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header 'Access-Control-Allow-Origin' '*';
    }

    # 애플리케이션 정보 API
    location /api/v1/info {
        proxy_pass http://18.140.95.253:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header 'Access-Control-Allow-Origin' '*';
    }
}
```

### docker-compose.yml (Frontend)
```yaml
version: '3.8'

services:
  # Nginx 프록시 서버
  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    ports:
      - "70:70"
    volumes:
      # 빌드된 프론트엔드 파일을 nginx에 마운트
      - ./dist:/usr/share/nginx/html
    depends_on:
      - frontend
    networks:
      - app-network

  # 프론트엔드 빌드 및 서빙
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    volumes:
      - ./dist:/app/dist
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## 📊 주요 컴포넌트 예시

### 1. 사업체별 요약 카드
### 2. 파일 업로드 & 처리 진행률
### 3. 거래 내역 테이블 (필터링 포함)

## 🚀 실행 및 테스트 가이드

### 1. 전체 스택 실행 (Docker Compose)
```bash
# 저장소 클론 
git clone https://github.com/your-org/accounting-dashboard.git
cd accounting-dashboard

# 환경 변수 설정
cp .env.example .env
# .env 파일에 실제 값 입력

# 전체 시스템 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### 2. 개발 환경 실행
```bash
# 백엔드 실행 (별도 터미널)
cd backend
./gradlew bootRun

# 프론트엔드 실행 (별도 터미널)
cd frontend  
npm run dev
```

### 3. 기능 테스트 시나리오

#### A. 파일 업로드 및 자동 분류 테스트
1. 브라우저에서 `http://localhost:3000` 접속
2. 업로드 페이지로 이동
3. `bank_transactions.csv`와 `rules.json` 파일 업로드
4. 자동 분류 실행 및 진행률 확인
5. 결과 페이지에서 분류 요약 확인

#### B. 대시보드 기능 테스트
1. 메인 대시보드 접속
2. A 커머스 / B 커머스 요약 카드 확인
3. 카테고리별 파이차트 데이터 확인
4. 월별 트렌드 차트 확인

#### C. 거래 내역 조회 테스트
1. 거래 내역 페이지 접속
2. 사업체별 필터 적용 (A 커머스 선택)
3. 날짜 범위 필터 적용
4. 키워드 검색 기능 테스트
5. CSV 내보내기 기능 테스트

### 4. API 연동 테스트
```bash
# 브라우저 개발자 도구에서 네트워크 탭 확인

# 예상 API 호출 패턴:
# 1. POST /api/v1/accounting/process (파일 업로드)
# 2. GET /api/v1/accounting/records?companyId=com_1 (A 커머스 조회)
# 3. GET /api/v1/accounting/records?companyId=com_2 (B 커머스 조회)
# 4. GET /api/v1/accounting/summary (대시보드 요약)
```

## 🔐 보안 고려사항

### CSP (Content Security Policy)
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;">
```

### 입력 검증
```jsx
// Zod 스키마를 이용한 폼 검증
const uploadSchema = z.object({
  csvFile: z.instanceof(File).refine(
    (file) => file.type === 'text/csv',
    { message: 'CSV 파일만 업로드 가능합니다.' }
  ),
  jsonFile: z.instanceof(File).refine(
    (file) => file.type === 'application/json',
    { message: 'JSON 파일만 업로드 가능합니다.' }
  )
});
```

### XSS 방지
```jsx
// DOMPurify를 이용한 HTML 정제
import DOMPurify from 'dompurify';

const SafeHtml = ({ html }) => {
  const cleanHtml = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};
```

## 🔧 문제 해결

### 일반적인 문제들

#### 1. API 연결 오류 (400 Bad Request)
- **증상**: 대시보드에서 "API request failed: 400" 오류
- **원인**: 백엔드에 데이터가 없거나 서비스가 실행되지 않음
- **해결**: 
  - 백엔드 서버가 실행 중인지 확인 (`http://localhost:8080`)
  - 샘플 파일을 업로드하여 데이터 생성
  - 브라우저 개발자 도구에서 네트워크 탭 확인

#### 2. 파일 업로드 실패
- **증상**: 파일 업로드 후 처리되지 않음
- **원인**: 파일 형식이 올바르지 않거나 크기가 너무 큼
- **해결**:
  - CSV 파일은 헤더 행이 있어야 함 (날짜,시간,거래처,금액,설명)
  - JSON 파일은 올바른 형식이어야 함
  - 파일 크기는 50MB 이하여야 함

#### 3. 거래 내역이 표시되지 않음
- **증상**: 대시보드에 거래 내역이 비어있음
- **원인**: 아직 파일을 업로드하지 않았거나 처리에 실패함
- **해결**:
  - 샘플 파일을 업로드하여 테스트
  - 처리 결과에서 오류 메시지 확인
  - 브라우저 새로고침 후 재시도

#### 4. React Key 경고
- **증상**: 콘솔에 "Each child in a list should have a unique key" 경고
- **원인**: 거래 내역 목록에 고유 키가 없음
- **해결**: 이미 수정됨 - 고유 ID 또는 인덱스를 사용

### 개발 환경 설정

#### 백엔드 서버 실행 확인
```bash
# Spring Boot 서버 상태 확인
curl http://localhost:8080/api/v1/health

# 예상 응답:
# {"status":"UP","timestamp":"2025-08-08T18:25:02.758Z","version":"1.0.0"}
```

#### 프론트엔드 개발 서버 확인
```bash
# Vite 개발 서버 상태 확인
curl http://localhost:3000

# 프록시 설정 확인
curl http://localhost:3000/api/accounting/records?companyId=com_1
```

## 🌍 국제화 (i18n)

```jsx
// i18n 설정
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: {
        translation: {
          'dashboard.title': '대시보드',
          'upload.title': '파일 업로드',
          'transactions.title': '거래 내역'
        }
      },
      en: {
        translation: {
          'dashboard.title': 'Dashboard',
          'upload.title': 'File Upload',
          'transactions.title': 'Transactions'
        }
      }
    },
    lng: 'ko',
    fallbackLng: 'ko'
  });
```