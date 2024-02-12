import { Database } from "../db";
import { v4 as uuid } from 'uuid';
import { User } from "../ models/User";

export class UserService {
  private db;

  constructor() {
    this.db = new Database();
  }

  getUser (id: string) {
    return this.db.findById(id)
  }

  getUsers () {
    return this.db.findAll()
  }

  createUser (userData: Omit<User, 'id'>) {
    const userId = uuid();
    this.db.addUser({
      id: userId,
      ...userData
    })
    return this.db.findById(userId)
  }

  updateUser (id: User['id'], userData: Partial<User>) {
    this.db.updateUser(id, userData)
  }

  deleteUser (id: User['id']) {
    this.db.deleteUser(id)
  }
}