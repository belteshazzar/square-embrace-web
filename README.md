
just example jwt processing at the moment, adapted from: https://github.com/Olanetsoft/jwt-project

to run server:
```
MONGO_URI=mongodb://localhost:27017 PORT=3000 TOKEN_KEY=random nodemon index.js
```

register a user:
```
curl -X POST http://localhost:3000/register -H "Content-Type: application/x-www-form-urlencoded" -d "username=fred&email=fred@brown.com&password=password"
```

login:
```
curl -X POST http://localhost:3000/login -H "Content-Type: application/x-www-form-urlencoded" -d "username=fred&password=password"
```

access resource:
```
curl -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM3NmMzNGZjODYxMTExMGRiY2M3MjZmIiwiZW1haWwiOiJmcmVkQGJyb3duLmNvbSIsImlhdCI6MTY2ODcyODQyOSwiZXhwIjoxNjY4NzM1NjI5fQ.wYF_4SVYfzeOTfaxpJllkPF1_U-YnxfLUsdDVyQsDOE" http://localhost:3000/welcome
```