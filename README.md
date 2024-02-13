# crud-api

Steps to run:

1. clone the project
2. npm install  
3. npm run start:dev to run the project in development mode, npm run start:prod to run in production mode  

Available endpoints:  

GET api/users: get all users  

GET api/users/{userId}: get user by id  
- Response: 200, returns user record  
- Errors:  
  * 400: userId is invalid (not uuid)
  * 404: userId doesn't exist

POST api/users is used to create record about new user and store it in database
- Response: 201, returns created record
- Errors:
  * 400: request body does not contain required fields

PUT api/users/{userId}: update existing user by id
- Response: 200, returns updated record
- Errors:
  * 400: userId is invalid (not uuid)
  * 404: userId doesn't exist

DELETE api/users/{userId}: delete an existing user by id
- Response: 204 if the record is found and deleted
- Errors:
  * 400: userId is invalid (not uuid)
  * 404: userId doesn't exist