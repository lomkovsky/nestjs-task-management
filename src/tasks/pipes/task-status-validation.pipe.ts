import { PipeTransform, BadRequestException } from '@nestjs/common';
import { allowedStatuses } from '../allowedStatuses';

export class TaskStatusValidationPepe implements PipeTransform {

  transform(value: any) {
    value = value.toUpperCase();
    const valid = this.isStatusValid(value);
    if (valid) {
      return value;
    }
    throw new BadRequestException(`"${value}" is an invalid status`);
  }

  private isStatusValid(status: any) {
    return allowedStatuses.includes(status);
  }
}
