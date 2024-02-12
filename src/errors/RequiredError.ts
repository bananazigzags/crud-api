import { ValidationError } from "./ValidationError";

export class RequiredError extends ValidationError {
  constructor(fieldName: string) {
    super(`${fieldName} is required`)
  }
}