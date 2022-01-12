import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getData(url: string) {
    return this.http.get(url)
    .pipe(
      delay(1000),
      retry(1),
      catchError(this.handleError))
  }

  handleError(error: any) {
    let errorMessage = '';
    if(error.status == 503) {
      alert('Limite se acesso a api atingido!')
    }
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
}
}
