import { Injectable } from '@angular/core';
import { Appointment } from './appointment';
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
export class AppointmentService {

  private appointmentsUrl = '/api/appointments';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getAppointments(appt: Appointment): Observable<Appointment[]> {
    // return of(APPOINTMENTS);

    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (appt.first != '')
    {
      params = params.append('first', appt.first);
    }
    if (appt.last != '')
    {
      params = params.append('last', appt.last);
    }
    if (appt.email != '')
    {
      params = params.append('email', appt.email);
    }
    if (appt.phone > 0)
    {
      params = params.append('phone', appt.phone.toString());
    }
    if (appt.date > 0)
    {
      params = params.append('date', appt.date.toString());
    }
    if (appt.time > 0)
    {
      params = params.append('time', appt.time.toString());
    }
    if (appt.specialId != '')
    {
      params = params.append('specialId', appt.specialId);
    }

    return this.http.get<Appointment[]>(this.appointmentsUrl,
      { params: params }).pipe(
      tap(appointments => this.log(`fetched appointments`)),
      catchError(this.handleError(`getAppointments`, []))
    );
  }

  getAppointment(id: string): Observable<Appointment> {
    // return of(APPOINTMENTS.find(appointment => appointment._id === id));
    const url = `${this.appointmentsUrl}/${id}`;
    console.log('Url for get is: ' + url);
    return this.http.get<Appointment>(url).pipe(
      tap(_ => this.log(`fetched appointment id=${id}`)),
      catchError(this.handleError<Appointment>(`getAppointment id=${id}`))
    );
  }

  /** PUT: update the appointment on the server */
  updateAppointment (appointment: Appointment): Observable<any> {
    const url = `${this.appointmentsUrl}/${appointment._id}`;
    console.log('Url for get is: ' + url);
    return this.http.put(url, appointment, httpOptions).pipe(
      tap(_ => this.log(`updated appointment id=${appointment._id}`)),
      catchError(this.handleError<any>('updateAppointment'))
    );
  }

  /** POST: add a new hero to the server */
  addAppointment (appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.appointmentsUrl, appointment, httpOptions).pipe(
      tap((appointment: Appointment) => this.log(`added appointment`)),
      catchError(this.handleError<Appointment>('addAppointment'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteAppointment (appointment: Appointment | string): Observable<Appointment> {
    const id = typeof appointment === 'string' ? appointment : appointment._id;
    const url = `${this.appointmentsUrl}/${id}`;

    return this.http.delete<Appointment>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted appointment id=${id}`)),
      catchError(this.handleError<Appointment>('deleteAppointment'))
    );
  }

  /* GET heroes whose name contains search term */
  searchAppointments(term: string): Observable<Appointment[]> {

    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    if (!term.trim())
    {
      return of([]);
    }
    else
    {
      params = params.append('email', term.trim().toUpperCase());
    }
    // return this.http.get<Appointment[]>(`${this.appointmentsUrl}/?first=${term}`).pipe(
    //   tap(_ => this.log(`found appointments matching "${term}"`)),
    //   catchError(this.handleError<Appointment[]>('searchAppointments', []))
    // );
    return this.http.get<Appointment[]>(this.appointmentsUrl,
      { params: params }).pipe(
      tap(appointments => this.log(`found appointments matching "${term}"`)),
      catchError(this.handleError(`searchAppointments`, []))
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
