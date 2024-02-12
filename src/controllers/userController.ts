import { Database } from "../db";
import { v4 as uuid } from 'uuid';
import { User } from "../ models/User";
import { RequiredError } from "../errors/RequiredError";
import { ValidationError } from "../errors/ValidationError";

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

  validateUserData (userData: Omit<User, 'id'>) {
    const { username, age, hobbies } = userData;

    if (!username) {
      return new RequiredError('username')
    }

    if (!age) {
      return new RequiredError('age')
    }

    if (!hobbies) {
      return new RequiredError('hobbies')
    }
    
    if (typeof username !== 'string') {
      return new ValidationError('username must be a string')
    }

    if (typeof age !== 'number') {
      return new ValidationError('age must be a number')
    }

    if (!Array.isArray(hobbies) || !hobbies.every(element => typeof element === 'string')) {
      return new ValidationError('hobbies must be an array of strings')
    }
  }

  createUser (userData: Omit<User, 'id'>) {
    const error = this.validateUserData(userData);
    if (error) {
      return error
    }
    const userId = uuid();
    this.db.addUser({
      id: userId,
      ...userData
    })
    return this.db.findById(userId)
  }

  updateUser (id: User['id'], userData: Partial<User>) {
    const { username, age, hobbies } = userData;
    if (username && typeof username !== 'string') {
      return new ValidationError('username must be a string')
    }

    if (age && typeof age !== 'number') {
      return new ValidationError('age must be a number')
    }

    if (hobbies && !Array.isArray(hobbies) || (hobbies && !hobbies.every(element => typeof element === 'string'))) {
      return new ValidationError('hobbies must be an array of strings')
    }
    this.db.updateUser(id, userData)
    return this.db.findById(id)
  }

  deleteUser (id: User['id']) {
    this.db.deleteUser(id)
  }
}