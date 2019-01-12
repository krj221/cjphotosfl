import { Injectable } from '@angular/core';
import { Appointment } from './appointment';
import { Special } from './special';
import { Specialemail } from './specialemail';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { SpecialService } from './special.service';
import { UtilityService } from './utility.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private emailUrl = '/api/email';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private specialService: SpecialService,
    private utilityService: UtilityService
  ) { }

  emailNotification (appointment: Specialemail): Observable<any> {
    const appt = {
        "fullName": appointment.fullName,
        "email": appointment.email,
        "specialName": appointment.specialName,
        "date": appointment.dateConverted,
        "time": appointment.timeConverted,
        "phone": appointment.phoneConverted,
        "errorMesg": appointment.errorMesg
    }

    return this.http.post(this.emailUrl, appt, httpOptions).pipe(
      tap(() => this.log(`Sent email`)),
      catchError(this.handleError<any>('emailNotification'))
    );
  }

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
    this.messageService.add(`AppointmentService: ${message}`);
  }

}
