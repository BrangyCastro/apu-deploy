export class ConfictError extends Error {
  constructor(descripcion) {
    super(descripcion);
    this.name = "ConfictError";
  }
}
