import { Component, OnInit } from '@angular/core';
import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';
import { Special } from '../special';
import { SpecialService } from '../special.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})

export class BookAppointmentComponent implements OnInit {

  appointments: Appointment[];
  specials: Special[];

  constructor(
    private appointmentService: AppointmentService,
    private specialService: SpecialService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getAppointments();
    this.getSpecials();
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
        .subscribe(appointments => this.appointments = appointments);
  }

  getSpecials(): void {
    const spec = new Special();
    this.specialService.getSpecials(spec)
        .subscribe(specials => this.specials = specials);
  }

  reload(): void {
    location.reload();
  }

  // add(date: string): void {
  //   date = date.trim();
  //   if (!date) { return; }
  //   this.appointmentService.addAppointment({ date } as Appointment)
  //     .subscribe(appointment => {
  //       this.appointments.push(appointment);
  //     });
  // }

  // delete(appointment: Appointment): void {
  //   this.appointments = this.appointments.filter(a => a !== appointment);
  //   this.appointmentService.deleteAppointment(appointment).subscribe();
  // }

}
