
import { Component } from '@angular/core';
import { TaskService } from './task.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, CommonModule, FormsModule],
})
export class AppComponent {
  tasks: Task[] = [];
  newTask = '';
  filter: 'all' | 'active' | 'completed' = 'all';
  selectedTaskIndex: number | null = null;

  constructor(private taskService: TaskService) {
    this.loadFromLocalStorage();
    this.syncWithServer();
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      this.tasks = JSON.parse(saved).map((task: any) => ({
        ...task,
        subtasks: task.subtasks ?? [],
        editing: false,
        newSubtask: '',
      }));
    }
  }

  syncWithServer() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.map(task => ({
        ...task,
        subtasks: task.subtasks ?? [],
        editing: false,
        newSubtask: '',
      }));
      this.saveToLocalStorage();
    });
  }

  saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask() {
    if (this.newTask.trim()) {
      const newTask: Task = { title: this.newTask.trim(), subtasks: [] };
      this.taskService.addTask(newTask).subscribe(saved => {
        this.tasks.push(saved);
        this.newTask = '';
        this.saveToLocalStorage();
      });
    }
  }

  removeTask(index: number) {
    const task = this.tasks[index];
    if (task.id) {
      this.taskService.deleteTask(task.id).subscribe(() => {
        this.tasks.splice(index, 1);
        this.saveToLocalStorage();
      });
    }
  }

  saveTasks() {
    this.tasks.forEach(task => {
      if (task.id) {
        this.taskService.updateTask(task).subscribe(() => {
          this.saveToLocalStorage();
        });
      }
    });
  }

  filteredTasks() {
    if (this.filter === 'active') return this.tasks.filter(t => t.status === 'active');
    if (this.filter === 'completed') return this.tasks.filter(t => t.status === 'completed');
    return this.tasks;
  }

  editTask(task: Task) {
    task.editing = true;
    if (task.newSubtask === undefined) task.newSubtask = '';
  }

  toggleActive(task: Task) {
    task.status = task.status === 'active' ? undefined : 'active';
  }

  toggleCompleted(task: Task) {
    task.status = task.status === 'completed' ? undefined : 'completed';
  }

  addSubtask(parentTask: Task, subtaskTitle: string) {
    if (!parentTask.subtasks) parentTask.subtasks = [];
    if (subtaskTitle && subtaskTitle.trim()) {
      parentTask.subtasks.push({ title: subtaskTitle.trim() });





      if (parentTask.id) {
        this.taskService.updateTask(parentTask).subscribe(() => {
          this.saveToLocalStorage();
        });
      } else {
        this.saveToLocalStorage();
      }
    }
  }

 
 
 
  toggleSubtaskCompleted(task: Task, subtask: Subtask) {
    subtask.completed = !subtask.completed;
    if (task.id) {
      this.taskService.updateTask(task).subscribe(() => {
        this.saveToLocalStorage();
      });
    } else {
      this.saveToLocalStorage();
    }
  }

  removeSubtask(parent: Task, index: number) {
    parent.subtasks?.splice(index, 1);
    if (parent.id) {
      this.taskService.updateTask(parent).subscribe(() => {
        this.saveToLocalStorage();
      });
    } else {
      this.saveToLocalStorage();
    }
  }
}

// ✅ Task interface
interface Task {
  id?: number;
  title: string;
  status?: 'active' | 'completed';
  editing?: boolean;
  subtasks?: Subtask[];
  newSubtask?: string;
  showSubtaskInput?: boolean;
  completed?: boolean;
}
interface Subtask {
  id?: number;
  title: string;
  completed?: boolean;
} 