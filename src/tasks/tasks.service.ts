import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(task =>
        task.title.includes(search) ||
        task.description.includes(search),
      );
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    const taskById: Task = this.tasks.find(task => task.id === id);
    if (taskById) {
      return taskById;
    }
    throw new NotFoundException(`Task with ID "${id}" not found`);
  }
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
  updateTaskStatus(id: string, status: TaskStatus): Task {
    const taskById = this.getTaskById(id);
    taskById.status = status;
    return taskById;
  }
  deleteTask(id: string): Task {
    const taskById = this.getTaskById(id);
    this.tasks = this.tasks.filter((task: { id: string }) => task.id !== taskById.id);
    return taskById;
  }
}
