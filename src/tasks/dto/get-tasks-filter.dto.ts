import { TaskStatus } from '../task-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { allowedStatuses } from '../allowedStatuses';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn(allowedStatuses)
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
