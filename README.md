
just example jwt processing at the moment, adapted from:
- https://github.com/Olanetsoft/jwt-project
- https://medium.com/@prashantramnyc/authenticate-rest-apis-in-node-js-using-jwt-json-web-tokens-f0e97669aad3

to run server:
```
MONGO_URI=mongodb://localhost:27017 PORT=3000 ACCESS_TOKEN_SECRET=random REFRESH_TOKEN_SECRET=random nodemon index.js
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
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM3NmMzNGZjODYxMTExMGRiY2M3MjZmIiwiZW1haWwiOiJmcmVkQGJyb3duLmNvbSIsImlhdCI6MTY2ODcyODQyOSwiZXhwIjoxNjY4NzM1NjI5fQ.wYF_4SVYfzeOTfaxpJllkPF1_U-YnxfLUsdDVyQsDOE" http://localhost:3000/welcome
```

refresh token:
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM3NmMzNGZjODYxMTExMGRiY2M3MjZmIiwiZW1haWwiOiJmcmVkQGJyb3duLmNvbSIsImlhdCI6MTY2ODcyODQyOSwiZXhwIjoxNjY4NzM1NjI5fQ.wYF_4SVYfzeOTfaxpJllkPF1_U-YnxfLUsdDVyQsDOE" http://localhost:3000/refres
```

logout:
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM3NmMzNGZjODYxMTExMGRiY2M3MjZmIiwiZW1haWwiOiJmcmVkQGJyb3duLmNvbSIsImlhdCI6MTY2ODcyODQyOSwiZXhwIjoxNjY4NzM1NjI5fQ.wYF_4SVYfzeOTfaxpJllkPF1_U-YnxfLUsdDVyQsDOE" http://localhost:3000/logout
```