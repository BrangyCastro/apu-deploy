export class UnexpectedError extends Error {
  constructor() {
    super("Algo salió mal. Por favor, inténtelo de nuevo más tarde.");
    this.name = "UnexpectedError";
  }
}
