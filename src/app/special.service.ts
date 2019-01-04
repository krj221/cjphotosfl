import { Injectable } from '@angular/core';
import { Special } from './special';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SpecialService {

  private specialsUrl = '/api/specials';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getSpecials(special: Special): Observable<Special[]> {
    // return of(APPOINTMENTS);

    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    // if (special.name != '')
    // {
    //   params = params.append('name', special.name);
    // }
    // if (special.photoDir != '')
    // {
    //   params = params.append('photoDir', special.photoDir);
    // }
    // if (special.dates.value > 0)
    // {
    //   params = params.append('dates', special.dates.value);
    // }
    // if (appt.phone > 0)
    // {
    //   params = params.append('phone', appt.phone.toString());
    // }

    return this.http.get<Special[]>(this.specialsUrl,
      { }).pipe(
      tap(specials => this.log(`fetched specials`)),
      catchError(this.handleError(`getSpecials`, []))
    );
  }

  getSpecial(id: string): Observable<Special> {
    // return of(APPOINTMENTS.find(special => special._id === id));
    const url = `${this.specialsUrl}/${id}`;
    console.log('Url for get is: ' + url);
    return this.http.get<Special>(url).pipe(
      tap(_ => this.log(`fetched special id=${id}`)),
      catchError(this.handleError<Special>(`getSpecial id=${id}`))
    );
  }

  /** PUT: update the special on the server */
  updateSpecial (special: Special): Observable<any> {
    const url = `${this.specialsUrl}/${special._id}`;
    console.log('Url for get is: ' + url);
    return this.http.put(url, special, httpOptions).pipe(
      tap(_ => this.log(`updated special id=${special._id}`)),
      catchError(this.handleError<any>('updateSpecial'))
    );
  }
  //
  // /** POST: add a new hero to the server */
  addSpecial (special: Special): Observable<Special> {
    return this.http.post<Special>(this.specialsUrl, special, httpOptions).pipe(
      tap((special: Special) => this.log(`added special`)),
      catchError(this.handleError<Special>('addSpecial'))
    );
  }
  //
  // /** DELETE: delete the hero from the server */
  deleteSpecial (special: Special | string): Observable<Special> {
    const id = typeof special === 'string' ? special : special._id;
    const url = `${this.specialsUrl}/${id}`;

    return this.http.delete<Special>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted special id=${id}`)),
      catchError(this.handleError<Special>('deleteSpecial'))
    );
  }
  //
  // /* GET heroes whose name contains search term */
  // searchSpecials(term: string): Observable<Special[]> {
  //   if (!term.trim()) {
  //     // if not search term, return empty hero array.
  //     return of([]);
  //   }
  //   return this.http.get<Special[]>(`${this.specialsUrl}/?date=${term}`).pipe(
  //     tap(_ => this.log(`found specials matching "${term}"`)),
  //     catchError(this.handleError<Special[]>('searchSpecials', []))
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
    this.messageService.add(`SpecialService: ${message}`);
  }

}
