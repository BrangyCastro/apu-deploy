export class NotAcceptableError extends Error {
  constructor(descripcion) {
    super(descripcion);
    this.name = "NotAcceptableError";
  }
}
