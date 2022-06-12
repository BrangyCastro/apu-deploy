import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new ConflictException(
        'Error de validación (se espera una cadena numérica)',
      );
    }
    return val;
  }
}
