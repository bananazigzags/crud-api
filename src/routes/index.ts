import { IncomingMessage, ServerResponse } from "http";
import { validate as isValidUUID } from "uuid";
import { UserService } from "../controllers/userController";
import { ValidationError } from "../errors/ValidationError";

const userService = new UserService()

export const router = (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.url && (/\/api\/users\/.+/).test(req.url)) {
      const splitPath = req.url?.split("/");
      const paramId = splitPath?.[splitPath?.length - 1]

      if (!paramId) return

      if (!isValidUUID(paramId)) {
        res.writeHead(400, 'Valid uuid is required')
        return res.end(JSON.stringify({
          data: { error: { message: 'Valid uuid is required'}}
        }))
      }

      if (!userService.getUser(paramId)) {
        res.writeHead(404, {ContentType: 'application/json'});
        return res.end(JSON.stringify({
          data: { error: { message: `user with id ${paramId} not found`}}
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
          let data = "";
          req.on("data", (chunk) => {
            data += chunk.toString();
          });
      
          req.on("end", () => {
            let userData = JSON.parse(data);
            const response = userService.updateUser(paramId, userData)
            if (response instanceof ValidationError) {
              res.writeHead(400)
              return res.end(JSON.stringify({
                data: { error: { message: response.message }}
              }))
            } else {
              res.writeHead(200)
              return res.end(JSON.stringify({
                data: response
              }));
            }
          });
      } 
    } else if (req.url && (/\/api\/users/).test(req.url)) {
      switch(req.method) {
        case 'GET':
          const users = userService.getUsers();
          if (users) {
            res.writeHead(200, {ContentType: 'application/json'});
            return res.end(JSON.stringify({
              data: userService.getUsers()
            }))
          }
        case 'POST':
          try {
            let data = "";
            req.on("data", (chunk) => {
              data += chunk.toString();
            });
        
            req.on("end", () => {
              let userData = JSON.parse(data);
              let response = userService.createUser(userData)
              if (response instanceof ValidationError) {
                res.writeHead(400)
                return res.end(JSON.stringify({
                  data: { error: { message: response.message }}
                }))
              }
              res.writeHead(201, {ContentType: 'application/json'});
              return res.end(JSON.stringify({
              data: response
              }));
            });
          } catch (err) {
            console.log(err)
            if (err instanceof ValidationError) {
              res.writeHead(400)
              return res.end(JSON.stringify({
                data: { error: { message: err.message }}
              }))
            }
          }
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