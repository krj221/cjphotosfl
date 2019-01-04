import { Component, OnInit } from '@angular/core';
import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  appointments: Appointment[] = [];

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit() {
    this.getAppointments();
  }

  getAppointments(): void {
    const appt = {
      _id: '',
      first: '',
      last: '',
      email: '',
      phone: 0,
      date: 0,
      time: 0,
      specialId: ''
    };
    this.appointmentService.getAppointments(appt)
      .subscribe(appointments => this.appointments = appointments.slice(1, 5));
  }
}
