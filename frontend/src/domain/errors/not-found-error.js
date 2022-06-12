export class NotFoundError extends Error {
  constructor() {
    super("No encontrado.");
    this.name = "NotFoundError";
  }
}
