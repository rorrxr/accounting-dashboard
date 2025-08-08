FROM nginx:alpine

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 정적 파일을 위한 디렉토리 생성
RUN mkdir -p /usr/share/nginx/html

# 포트 70 노출
EXPOSE 70

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]
