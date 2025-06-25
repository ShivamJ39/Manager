import  { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model'; // Adjust the import path as necessary
@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:5080/api/tasks'; // adjust as needed

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

 updateTask(task: Task): Observable<any> {
  return this.http.put(`${this.apiUrl}/${task.id}`, task);
}


  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

