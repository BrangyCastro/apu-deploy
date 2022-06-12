export class InvalidCredentialsError extends Error {
  constructor() {
    super("Credenciales no válidas.");
    this.name = "InvalidCredentialsError";
  }
}
