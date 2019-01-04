import { Injectable } from '@angular/core';
import { MyTime } from './my-time';
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
export class TimeService {

  private timesUrl = 'api/times';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getTimes(): Observable<MyTime[][]> {
    // return of(APPOINTMENTS);
    return this.http.get<MyTime[][]>(this.timesUrl).pipe(
      tap(times => this.log(`fetched times`)),
      catchError(this.handleError(`getTimes`, []))
    );
  }

  // getTime(id: number): Observable<Time> {
  //   // return of(APPOINTMENTS.find(time => time.id === id));
  //   const url = `${this.timesUrl}/${id}`;
  //   return this.http.get<Time>(url).pipe(
  //     tap(_ => this.log(`fetched time id=${id}`)),
  //     catchError(this.handleError<Time>(`getTime id=${id}`))
  //   );
  // }
  //
  // /** PUT: uptime the time on the server */
  // uptimeTime (time: Time): Observable<any> {
  //   return this.http.put(this.timesUrl, time, httpOptions).pipe(
  //     tap(_ => this.log(`uptimed time id=${time.id}`)),
  //     catchError(this.handleError<any>('uptimeTime'))
  //   );
  // }
  //
  // /** POST: add a new hero to the server */
  // addTime (time: Time): Observable<Time> {
  //   return this.http.post<Time>(this.timesUrl, time, httpOptions).pipe(
  //     tap((time: Time) => this.log(`added time w/ id=${time.id}`)),
  //     catchError(this.handleError<Time>('addTime'))
  //   );
  // }
  //
  // /** DELETE: delete the hero from the server */
  // deleteTime (time: Time | number): Observable<Time> {
  //   const id = typeof time === 'number' ? time : time.id;
  //   const url = `${this.timesUrl}/${id}`;
  //
  //   return this.http.delete<Time>(url, httpOptions).pipe(
  //     tap(_ => this.log(`deleted time id=${id}`)),
  //     catchError(this.handleError<Time>('deleteTime'))
  //   );
  // }
  //
  // /* GET heroes whose name contains search term */
  // searchTimes(term: string): Observable<Time[][]> {
  //   if (!term.trim()) {
  //     // if not search term, return empty hero array.
  //     return of([]);
  //   }
  //   return this.http.get<Time[][]>(`${this.timesUrl}/?time=${term}`).pipe(
  //     tap(_ => this.log(`found times matching "${term}"`)),
  //     catchError(this.handleError<Time[][]>('searchTimes', []))
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
    this.messageService.add(`TimeService: ${message}`);
  }
}
