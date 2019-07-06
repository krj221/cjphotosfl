import { Injectable } from '@angular/core';
import { User } from './user';
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
export class UserService {

  private usersUrl = '/api/users';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getUsers(user: User): Observable<User[]> {

    // Initialize Params Object
    let params = new HttpParams();

    return this.http.get<User[]>(this.usersUrl,
      { }).pipe(
      tap(users => this.log(`fetched users`)),
      catchError(this.handleError(`getUsers`, []))
    );
  }

  getUser(id: string): Observable<User> {
    // return of(APPOINTMENTS.find(user => user._id === id));
    const url = `${this.usersUrl}/${id}`;
    console.log('Url for get is: ' + url);
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`fetched user id=${id}`)),
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  /** PUT: update the user on the server */
  updateUser (user: User, token: string): Observable<any> {
    const url = `${this.usersUrl}/${user._id}`;
    console.log('Url for get is: ' + url);

    const httpOptionsAuth = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
                                'auth_token':token})
    };

    return this.http.put(url, user, httpOptionsAuth).pipe(
      tap(_ => this.log(`updated user id=${user._id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }
  //
  // /** POST: add a new hero to the server */
  addUser (user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, httpOptions).pipe(
      tap((user: User) => this.log(`added user`)),
      catchError(this.handleError<User>('addUser'))
    );
  }
  //
  // /** DELETE: delete the hero from the server */
  // deleteUser (user: User | string): Observable<User> {
  //   const id = typeof user === 'string' ? user : user._id;
  //   const url = `${this.usersUrl}/${id}`;
  //
  //   return this.http.delete<User>(url, httpOptions).pipe(
  //     tap(_ => this.log(`deleted user id=${id}`)),
  //     catchError(this.handleError<User>('deleteUser'))
  //   );
  // }
  //
  // /* GET heroes whose name contains search term */
  // searchUsers(term: string): Observable<User[]> {
  //   if (!term.trim()) {
  //     // if not search term, return empty hero array.
  //     return of([]);
  //   }
  //   return this.http.get<User[]>(`${this.usersUrl}/?date=${term}`).pipe(
  //     tap(_ => this.log(`found users matching "${term}"`)),
  //     catchError(this.handleError<User[]>('searchUsers', []))
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
    this.messageService.add(`UserService: ${message}`);
  }

}
