import { User } from "./ models/User";

export type DB = {
  users: User[]
}

export const db: DB = {
  users: []
};