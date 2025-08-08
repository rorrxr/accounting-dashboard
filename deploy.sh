#!/bin/bash

# 회계 대시보드 배포 스크립트

echo "🚀 회계 대시보드 배포를 시작합니다..."

# 기존 컨테이너 중지 및 제거
echo "📦 기존 컨테이너를 정리합니다..."
docker-compose down

# 프론트엔드 빌드
echo "🔨 프론트엔드를 빌드합니다..."
npm run build

# Docker 이미지 빌드
echo "🐳 Docker 이미지를 빌드합니다..."
docker-compose build

# 컨테이너 실행
echo "🚀 컨테이너를 실행합니다..."
docker-compose up -d

# 상태 확인
echo "✅ 배포가 완료되었습니다!"
echo "🌐 애플리케이션은 http://localhost:70 에서 접근할 수 있습니다."

# 컨테이너 상태 확인
echo "📊 컨테이너 상태:"
docker-compose ps
