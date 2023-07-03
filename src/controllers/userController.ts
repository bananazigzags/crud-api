import { ServerResponse, IncomingMessage } from "http";
import { db } from "../db";
import { v4 as uuid } from 'uuid';

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  try {
    res.writeHead(200, {ContentType: 'application/json'});
    res.end(JSON.stringify({
      success: true,
      message: db.users
    }))
  } catch {
    console.error('error')
  }
}

export const createUser = (req: IncomingMessage, res: ServerResponse) => {
  try {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk.toString();
    });

    req.on("end", () => {
      let userData = JSON.parse(data);
      const userId = uuid();
      db.users.push({
        id: userId,
        ...userData
      })
      res.writeHead(201, {ContentType: 'application/json'});
      res.end(JSON.stringify({
        success: true,
        message: `user with id ${userId} created`
      }));
    });
  } catch {
    console.error('error')
  }
}