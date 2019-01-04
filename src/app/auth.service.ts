import { Injectable } from '@angular/core';
import { User } from './user';
import { TokenDetails } from './token-details';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Location } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = '/api/login';  // URL to web api
  private authUrl = '/api/auth';  // URL to web api

  constructor(
    private http: HttpClient,
    private location: Location,
    private messageService: MessageService) { }

  login(email: string, password: string): Observable<any> {
    // return of(APPOINTMENTS.find(user => user._id === id));
    console.log('Url for get is: ' + this.loginUrl);

    var findUser = new User();
    findUser.email = email.toUpperCase();
    findUser.password= password;

    return this.http.post(this.loginUrl, findUser).pipe(
      tap(auth_token => this.checkToken(auth_token)),
      catchError(this.handleError<any>(`logging in`))
    );
  }
  checkToken(auth_token: Object): boolean {
    if (auth_token != null) {
      console.log("found token");
      localStorage.setItem("authDetails", JSON.stringify(auth_token));
      var authDetails = JSON.parse(localStorage.getItem("authDetails"));
      console.log("authDetails (token): " + authDetails.idToken);
      // console.log(JSON.stringify(auth_token));
      return true;
    }
    else {
      console.log("could not find token");
      return false;
    }
  }

  isAuthorized(i: string, s: string, a: string, token: string): Observable<any> {
    var tokenDetails = new TokenDetails();
    tokenDetails.issuer = i;
    tokenDetails.subject = s;
    tokenDetails.audience = a;
    tokenDetails.token = token;

    return this.http.post(this.authUrl, tokenDetails).pipe(
      tap(authorized => console.log(authorized)),
      catchError(this.handleError<any>(`checking authorization`))
    );
  }

  logout(): void {
    // return of(APPOINTMENTS.find(user => user._id === id));
    localStorage.removeItem("authDetails");
    this.location.go('/login');
    location.reload();

  }

  // login(email:string, password:string ) {
  //       return this.http.post<User>('/api/login', {email, password})
  //           // this is just the HTTP call,
  //           // we still need to handle the reception of the token
  //           .shareReplay();
  //   }
  // login(email:string, password:string ) {
  //       return this.http.post<User>(loginUrl, {email, password})
  //           // this is just the HTTP call,
  //           // we still need to handle the reception of the token
  //           .shareReplay();
  //   }

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
