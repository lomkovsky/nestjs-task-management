import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { DeleteResult } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  private logger = new Logger('TaskRepository');
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
    if (found) {
        return found;
    }
    throw new NotFoundException(`Task with ID "${id}" not found`);
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
    ): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    try {
      await task.save();
      return task;
    } catch (error) {
      this.logger.error(`Failed to update a task for user "${user.username}". Id: ${id}`, error.stack);
    }
  }

  async deleteTask(id: number, user: User): Promise<DeleteResult> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected) {
      return result;
    }
    throw new NotFoundException(`Task with ID "${id}" not found`);
  }
}
