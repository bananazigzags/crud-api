import { User } from "./ models/User";

export type DB = {
  users: { [id: string]: User }
}

export class Database {
  private users: {[id: string]: User} = {}

  constructor() {
    this.users = {}
  }

  findById(id: string) {
    return this.users[id];
  }

  findAll() {
    return Object.values(this.users);
  }

  addUser(user: User) {
    this.users[user.id] = user;
  }

  deleteUser(id: User['id']) {
    delete this.users[id];
  }

  updateUser(id: User['id'], userData: Partial<Omit<User, 'id'>>) {
    this.users[id] = { ...this.users[id], ...userData }
    return this.users[id]
  }

};