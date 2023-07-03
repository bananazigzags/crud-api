import http from "http";
import { createUser, getUsers } from "./controllers/userController";

const basePath = '/api';
const usersPath = basePath + '/users';

const server = http.createServer((req, res) => {

  switch(req.url) {
    case usersPath:
      switch(req.method) {
        case 'GET':
          return getUsers(req, res);
        case 'POST':
          return createUser(req, res);
      }
    default:
      res.writeHead(404, {ContentType: 'application/json'});
      res.end(JSON.stringify({
        success: false,
        message: 'not found'
      }))
  }
});

server.listen(8000, () => {
  console.log('Server is running on port 8000. Go to http://localhost:8000/')
});
