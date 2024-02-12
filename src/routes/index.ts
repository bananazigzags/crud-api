import { IncomingMessage, ServerResponse } from "http";
import { validate as isValidUUID } from "uuid";
import { UserService } from "../controllers/userController";

const userService = new UserService()

export const router = (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.url && (/\/api\/users\/.+/).test(req.url)) {
      const splitPath = req.url?.split("/");
      const paramId = splitPath?.[splitPath?.length - 1]

      if (!paramId) return

      if (!userService.getUser(paramId)) {
        res.writeHead(404, {ContentType: 'application/json'});
        return res.end(JSON.stringify({
          data: { error: { message: `user with id ${paramId} not found`}}
        }))
      }
      
      if (!isValidUUID(paramId)) {
        res.writeHead(400, 'Valid uuid is required')
        return res.end(JSON.stringify({
          data: { error: { message: 'Valid uuid is required'}}
        }))
      }

      switch(req.method) {
        case 'GET': 
          res.writeHead(200, {ContentType: 'application/json'});
          return res.end(JSON.stringify({
            data: userService.getUser(paramId)
          }))
        case 'DELETE':
          res.writeHead(204);
          userService.deleteUser(paramId)
          return res.end()
        case 'PUT':
          res.writeHead(200, {ContentType: 'application/json'});
          let data = "";
          req.on("data", (chunk) => {
            data += chunk.toString();
          });
      
          req.on("end", () => {
            let userData = JSON.parse(data);
            return res.end(JSON.stringify({
              data: userService.updateUser(paramId, userData)
            }));
          });
      } 
    } else if (req.url === '/api/users/') {
      switch(req.method) {
        case 'GET':
          res.writeHead(200, {ContentType: 'application/json'});
          return res.end(JSON.stringify({
            data: userService.getUsers()
          }))
        case 'POST':
          res.writeHead(201, {ContentType: 'application/json'});
          let data = "";
          req.on("data", (chunk) => {
            data += chunk.toString();
          });
      
          req.on("end", () => {
            let userData = JSON.parse(data);
            let createdUser = userService.createUser(userData)
            return res.end(JSON.stringify({
              data: createdUser
            }));
          });
      }
    } else {
      res.writeHead(404, {ContentType: 'application/json'});
      return res.end(JSON.stringify({
        message: 'not found'
      }))
    }
  } catch (err: unknown) {
    res.writeHead(500, {ContentType: 'application/json'});
    return res.end(JSON.stringify({
      error: { message: `server error: ${(err as Error).message}` }
    }))
  }
}