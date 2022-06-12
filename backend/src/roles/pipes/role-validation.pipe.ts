import { PipeTransform, BadRequestException } from '@nestjs/common';
import { RoleType } from '../roletype.enum';

export class RoleValidationPipe implements PipeTransform {
  readonly allowedStatuses = [RoleType.ADMIN, RoleType.GENERAL, RoleType.PROVE];

  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isStatusValidate(value)) {
      throw new BadRequestException(`${value} no es un rol valido`);
    }
    return value;
  }

  isStatusValidate(role: any) {
    const idx = this.allowedStatuses.indexOf(role);
    return idx !== -1;
  }
}
