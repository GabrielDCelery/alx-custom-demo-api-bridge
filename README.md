# Autologyx API Demo for Pertemps

### Running from Docker (example)

```
docker build -t alx/api-demo-pertemps .
docker run -p 49160:8080 -d alx/api-demo-pertemps
```

Go to http://localhost:49160/candidate/:candidateId

By default the app is running on PORT 8080, if you want to change that modify the ./Dockerfile and the ./config/host.js file.


### Running the app directly

```
npm install
npm run build
npm run start
```

Go to http://localhost:8080/candidate/:candidateId

### auth0 API example

API endpoint (POST)

http://localhost:8080/auth0

Example request body sent to the endpoint

```
{ 
    "method": "POST",
	"url": "https://123d.eu.auth0.com/api/v2/users",
	"auth": {
		"client_id": "super secret id",
		"client_secret": "super secret password"
	},
    "body": {
        "connection": "",
        "email": "",
        "username": "",
        "password": "",
        "phone_number": "",
        "user_metadata": {},
        "email_verified": true,
        "app_metadata": {}
    }
}
```