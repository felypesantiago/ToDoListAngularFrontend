import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IToDoList } from '../model/itodolist';
import { IToDoItem } from '../model/itodoitem';

@Injectable({
  providedIn: 'root'
})
export class ToDoItemService {

  constructor(private httpClient: HttpClient) {
  }

  getToDoItems(): Observable<IToDoList> {
    return this.httpClient.get<IToDoList>('http://localhost:8080/items').pipe(catchError(this.handleError));
  }

  getToDoItem(id: number): Observable<IToDoItem> {
    return this.httpClient.get<IToDoItem>(`http://localhost:8080/items/${id}`).pipe(catchError(this.handleError));
  }

  createToDoItem(item: IToDoItem): Observable<IToDoItem> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.httpClient.post<IToDoItem>(`http://localhost:8080/items`, item, { headers }).pipe(catchError(this.handleError));
  }

  updateToDoItem(item: IToDoItem): Observable<IToDoItem> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.httpClient.put<IToDoItem>(`http://localhost:8080/items/${item.id}`, item, { headers }).pipe(catchError(this.handleError));
  }

  deleteItem(id: number) {
    return this.httpClient.delete(`http://localhost:8080/items/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';

    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    console.error(errorMessage);

    return throwError(errorMessage);
  }

}
