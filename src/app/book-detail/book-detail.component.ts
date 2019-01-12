import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Appointment } from '../appointment';
import { Specialemail } from '../specialemail';
import { AppointmentService } from '../appointment.service';
import { Special } from '../special';
import { SpecialService } from '../special.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UtilityService } from '../utility.service';
import { MessageService } from '../message.service';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})

export class BookDetailComponent implements OnInit {
  @Input() appointment: Appointment;
  @Input() special: Special;

  appointments: Appointment[];
  // special: Special;

  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  //Add component like Dates.ts or Times.ts to store data

  dateControl = new FormControl('', [Validators.required]);
  disableSelect = new FormControl(false);

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private specialService: SpecialService,
    private location: Location,
    private utilityService: UtilityService,
    private messageService: MessageService,
    private emailService: EmailService
  ) { }

  ngOnInit(): void {
    this.getSpecial();
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
      specialId: this.route.snapshot.paramMap.get('id')
    };
    this.appointmentService.getAppointments(appt)
        .subscribe(appointments => this.appointments = appointments);
  }

  getSpecial(): void {
    const specialId = this.route.snapshot.paramMap.get('id');

    this.specialService.getSpecial(specialId)
        .subscribe(special => this.special = special);
  }

  save(): void {
    this.appointmentService.updateAppointment(this.appointment)
      .subscribe(() => this.goBack());
  }

  private get disabledV():string {
    return this._disabledV;
  }

  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public refreshValue(value:any):void {
    this.value = value;
  }

  add(first: string, last: string, email: string, phoneString: string, date: number, time: number): void {
    first = first.trim().toUpperCase();
    last = last.trim().toUpperCase();
    email = email.trim().toUpperCase();
    var alertMessage = ' ';
    var invalidPhone = false;
    // var phoneString = phone1.trim() + phone2.trim() + phone3.trim();
    // phone = parseInt(phoneString);

    var phone = this.validatePhone(phoneString);

    var invalidFirst = false;
    var invalidEmail = false;
    var invalidDate = false;
    var invalidTime = false;
    var specialId = this.route.snapshot.paramMap.get('id');

    console.log("Special ID is: " + specialId);

    if (!first){
      invalidFirst = true;
      alertMessage += '\nFirst name is blank';
    }
    if (!email || !(this.utilityService.checkEmail(email))){
      invalidEmail = true;
      // alertMessage += '\nEmail is invalid';
    }
    if (!phone){
      invalidPhone = true;
      // alertMessage += '\nPlease enter a phone number';
    }
    // else if (phone < 999999999){
    //   invalidPhone = true;
    //   alertMessage += '\nPhone number must be at least 10 digits';
    // }
    if (date == null || date.toString() == '' ){
      invalidDate = true;
      alertMessage += '\nPlease select a date';
    }
    if (time == null || time.toString() == '' ){
      invalidTime = true;
      alertMessage += '\nPlease select a time';
    }

    if (invalidEmail && invalidPhone)
    {
      alertMessage += '\nYou must enter a valid email or phone number';
    }
    else
    {
        invalidEmail = false;
        invalidPhone = false;
    }

    if (invalidFirst || invalidEmail || invalidPhone || invalidDate || invalidTime) {
      // this.log('First name, last name, email or phone number is invalid.');
      alert(alertMessage);
      return;
    }

    var dateConverted = this.convertDate(date);
    var timeConverted = this.convertTime(time);

    // confirmation box
    var confirmed = confirm("Confirm appointment for "+ dateConverted + ' at ' + timeConverted);
    var apptCreateErr = false;
    var errorMesg = ' ';
    if (confirmed){

      this.appointmentService.addAppointment({first, last, email, phone, date, time, specialId } as Appointment)
      .subscribe(appointment => {
        this.appointments.push(appointment);
        console.log(appointment);
        if (appointment == null)
        {
          apptCreateErr = true;
          console.log("Appointment could not be created.");
          errorMesg += "Appointment was not created for some reason...Sorry";
        }
        else
        {
          console.log("Appointment was created successfully!");
          errorMesg += "Appointment created successfully!";
        }
      });

      alert('Appointment created \n   ' +  dateConverted + ' at ' + timeConverted);

      this.log("Appointment details: " + first + ' ' + last + ', ' + email + ', ' + phone + ', ' + date + ', ' + time );
      var dateIndex = this.getDateIndex(date, this.special);
      var timeIndex = this.getTimeIndex(time, dateIndex, this.special);
      this.special.dates[dateIndex].times[timeIndex].isBooked = true;
      this.updateSpecial(this.special);

      var specialName = this.special.name;
      var firstName = first.toLowerCase();
      var lastName = last.toLowerCase();
      var phoneConverted = this.convertPhone(phone);
      var fullName = firstName[0].toUpperCase() + firstName.slice(1) + ' ' + lastName[0].toUpperCase() + lastName.slice(1);
      this.emailService.emailNotification({fullName, email, dateConverted, timeConverted, specialName, phoneConverted, errorMesg } as Specialemail)
      .subscribe((response) => {
        console.log("Email has been sent!");

      });

      this.goBack();
    }
    else{
      // appointmentFirst = first;

    }
  }

  goBack(): void {
    this.location.back();
  }

  updateSpecial(special: Special): void {
    this.specialService.updateSpecial(special).subscribe();
  }
  delete(appointment: Appointment): void {
    this.appointments = this.appointments.filter(a => a !== appointment);
    this.appointmentService.deleteAppointment(appointment).subscribe();
  }

  private log(message: string) {
    this.messageService.add(`Book-Detail Component: ${message}`);
  }

  private convertDate(date: number): string {
    return this.utilityService.convertDate(date);
  }
  private validatePhone(phone: string): number {
    return this.utilityService.validatePhone(phone);
  }

  private convertTime(time: number): string {
    return this.utilityService.convertTime(time);
  }

  private convertPhone(phone: number): string {
    return this.utilityService.convertPhone(phone);
  }

  private getDateIndex(date: number, special: Special): number {
    return this.utilityService.getDateIndex(date, special);
  }

  private getTimeIndex(time: number, dateIndex: number, special: Special): number {
    return this.utilityService.getTimeIndex(time, dateIndex, special);
  }

}
