# Autologyx API Demo for Pertemps

Installation for production

```
docker build -t alx/api-demo-pertemps .
docker run -d alx/api-demo-pertemps
```

By default the app is running on PORT 8080, if you want to change that modify the ./Dockerfile and the ./config/host.js file.

Installation for local testing
```
npm install
npm run build
npm run start
```

Go to http://localhost:8080/candidate/:candidateId