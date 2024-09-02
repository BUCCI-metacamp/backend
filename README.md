### 백엔드 Docker 배포 과정

빌드
```
docker build -t <api-server_image_name> -f api-server/Dockerfile .
docker build -t <matt-ws-server_image_name> -f mqtt-ws-server/Dockerfile .
docker build -t <ai-server_image_name> -f ai-server/Dockerfile .
```

백엔드 실행
```
docker-compose up -d
```

---

### API
api 문서
- api-server : <api-server_url>/swagger-ui
- ai-server : <ai-server_url>/docs

---

### AWS IOT CORE 사용시
1. /secrets 폴더에 키와 인증서 파일 저장
2. /mqtt-ws-server/mqtt/mqttClient.js에서 awsIot 라이브러리 사용
