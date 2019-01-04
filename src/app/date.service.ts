import { Injectable } from '@angular/core';
import { MyDate } from './my-date';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DateService {

  private datesUrl = 'api/dates';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getDates(): Observable<MyDate[][]> {
    // return of(APPOINTMENTS);
    return this.http.get<MyDate[][]>(this.datesUrl).pipe(
      tap(dates => this.log(`fetched dates`)),
      catchError(this.handleError(`getDates`, []))
    );
  }

  // getDate(id: number): Observable<Date> {
  //   // return of(APPOINTMENTS.find(date => date.id === id));
  //   const url = `${this.datesUrl}/${id}`;
  //   return this.http.get<Date>(url).pipe(
  //     tap(_ => this.log(`fetched date id=${id}`)),
  //     catchError(this.handleError<Date>(`getDate id=${id}`))
  //   );
  // }
  //
  // /** PUT: update the date on the server */
  // updateDate (date: Date): Observable<any> {
  //   return this.http.put(this.datesUrl, date, httpOptions).pipe(
  //     tap(_ => this.log(`updated date id=${date.id}`)),
  //     catchError(this.handleError<any>('updateDate'))
  //   );
  // }
  //
  // /** POST: add a new hero to the server */
  // addDate (date: Date): Observable<Date> {
  //   return this.http.post<Date>(this.datesUrl, date, httpOptions).pipe(
  //     tap((date: Date) => this.log(`added date w/ id=${date.id}`)),
  //     catchError(this.handleError<Date>('addDate'))
  //   );
  // }

  /** DELETE: delete the hero from the server */
  // deleteDate (date: Date | number): Observable<Date> {
  //   const id = typeof date === 'number' ? date : date.id;
  //   const url = `${this.datesUrl}/${id}`;
  //
  //   return this.http.delete<Date>(url, httpOptions).pipe(
  //     tap(_ => this.log(`deleted date id=${id}`)),
  //     catchError(this.handleError<Date>('deleteDate'))
  //   );
  // }

  /* GET heroes whose name contains search term */
  // searchDates(term: string): Observable<Date[][]> {
  //   if (!term.trim()) {
  //     // if not search term, return empty hero array.
  //     return of([]);
  //   }
  //   return this.http.get<Date[][]>(`${this.datesUrl}/?date=${term}`).pipe(
  //     tap(_ => this.log(`found dates matching "${term}"`)),
  //     catchError(this.handleError<Date[][]>('searchDates', []))
  //   );
  // }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`DateService: ${message}`);
  }
}
