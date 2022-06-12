export class BadRequest extends Error {
  constructor(descripcion) {
    super(descripcion);
    this.name = "BadRequestError";
  }
}
