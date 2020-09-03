import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';
import { UtilityService } from '../utility.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-appointment-search',
  templateUrl: './appointment-search.component.html',
  styleUrls: ['./appointment-search.component.css']
})
export class AppointmentSearchComponent implements OnInit {
  appointments$: Observable<Appointment[]>;
  private searchTerms = new Subject<string>();
  admin=false;

  constructor(
    private appointmentService: AppointmentService,
    private utilityService: UtilityService,
    private authService: AuthService
  ) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.isAuthorized();
    this.appointments$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.appointmentService.searchAppointments(term)),
    );
  }

  isAuthorized(): void {
    var authDetails = JSON.parse(localStorage.getItem("authDetails"));
    // localStorage.removeItem("authDetails");
    if (authDetails != null) {
      this.authService.isAuthorized("cjphotos", authDetails.subject, authDetails.audience,
      authDetails.idToken)
      .subscribe(
        authorized => this.admin = this.checkAuthorization(authorized)
      );
    }
    else {
      this.admin = false;
    }

  }

  checkAuthorization(authorized: Object): boolean {
    console.log(JSON.stringify(authorized));
    if (authorized != null) {
      console.log("User is Authorized");
      return true;
    }
    else {
      console.log("User is Unauthorized");
      return false;
    }
  }

  private convertDate(date: number): string {
    return this.utilityService.convertDate(date);
  }

  private convertTime(time: number): string {
    return this.utilityService.convertTime(time);
  }

}
