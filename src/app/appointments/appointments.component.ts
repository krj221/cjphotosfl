import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '../appointment';
import { Special } from '../special';
import { AppointmentService } from '../appointment.service';
import { SpecialService } from '../special.service';
import { UtilityService } from '../utility.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  @Input() special: Special;

  appointments: Appointment[] = [];
  admin=false;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private specialService: SpecialService,
    private utilityService: UtilityService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isAuthorized();
    this.getSpecial();
    this.getAppointments();
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

  getAppointments(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const appt = {
      _id: '',
      first: '',
      last: '',
      email: '',
      phone: 0,
      date: 0,
      time: 0,
      specialId: id.toString()
    };
    this.appointmentService.getAppointments(appt)
        .subscribe(appointments => this.appointments = appointments);
  }

  getSpecial(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('found id as: ' + id);
    this.specialService.getSpecial(id.toString())
      .subscribe(special => this.special = special);
  }

  add(first: string, last: string, email: string, phone: number): void {
    first = first.trim();
    last = last.trim();
    email = email.trim();

    if (!first || !last || !email || !(phone > 999999999 ) ){ return; }
    this.appointmentService.addAppointment({ first, last, email, phone } as Appointment)
      .subscribe(appointment => {
        this.appointments.push(appointment);
      });
  }

  // delete(appointment: Appointment): void {
  //   this.appointments = this.appointments.filter(a => a !== appointment);
  //   this.appointmentService.deleteAppointment(appointment).subscribe();
  // }

  private convertPhone(phone: number): string {
    return this.utilityService.convertPhone(phone);
  }

  private convertDate(date: number): string {
    return this.utilityService.convertDate(date);
  }

  private convertTime(time: number): string {
    return this.utilityService.convertTime(time);
  }

}
