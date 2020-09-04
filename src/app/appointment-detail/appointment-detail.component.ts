import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Appointment } from '../appointment';
import { Special } from '../special';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppointmentService }  from '../appointment.service';
import { SpecialService }  from '../special.service';
import { UtilityService } from '../utility.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.css']
})
export class AppointmentDetailComponent implements OnInit {
  @Input() appointment: Appointment;

  admin=false;
  special: Special = {
    _id: '',
    name: '',
    photoDir: '',
    description: '',
    dates: [{
      date: new Date(),
      value: 0,
      times: [{
        value: 0,
        isBooked: false
      }]
    }]
  }

  saveDateIndex: number;
  saveTimeIndex: number;

  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  dateControl = new FormControl('', [Validators.required]);
  disableSelect = new FormControl(false);

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private specialService: SpecialService,
    private utilityService: UtilityService,
    private authService: AuthService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.isAuthorized();
    this.getAppointment();
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

  getAppointment(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('found id as: ' + id);
    this.appointmentService.getAppointment(id.toString())
      .subscribe(appointment => this.setAppointment(appointment));


  }
  setAppointment(appointment: Appointment): void {
    this.appointment = appointment;
    console.log(appointment.specialId);
    this.getSpecial(appointment.specialId);
  }
  getSpecial(id:string): void {
    console.log('found id as: ' + id);
    this.specialService.getSpecial(id.toString())
      .subscribe(special => this.setSpecial(special));
  }

  setSpecial(special: Special){
    this.special = special;
    this.saveDateIndex = this.getDateIndex(this.appointment.date, this.special);
    this.saveTimeIndex = this.getTimeIndex(this.appointment.time, this.saveDateIndex, this.special);
  }

  reloadPage(): void {
    window.location.reload();
  }

  save(): void {

    var authDetails = JSON.parse(localStorage.getItem("authDetails"));
    if (this.appointment.first != null)
    {
      this.appointment.first = this.appointment.first.trim().toUpperCase();
    }
    if (this.appointment.last != null)
    {
      this.appointment.last = this.appointment.last.trim().toUpperCase();
    }
    if (this.appointment.email != null)
    {
      this.appointment.email = this.appointment.email.trim().toUpperCase();
    }

    if (this.appointment.phone != null)
    {
      this.appointment.phone = this.validatePhone(this.appointment.phone.toString());
    }

    try
    {
      this.appointmentService.updateAppointment(this.appointment, authDetails.idToken)
      .subscribe(() => this.goBack());
    }
    catch(e)
    {
      console.log(e);
      alert("Error: Appointment not updated - User was logged out, please login again");
      return;
    }


    var dateIndex = this.getDateIndex(this.appointment.date, this.special);
    var timeIndex = this.getTimeIndex(this.appointment.time, dateIndex, this.special);
    this.special.dates[this.saveDateIndex].times[this.saveTimeIndex].isBooked = false;
    console.log('Set savedate and savetime with true');
    this.special.dates[dateIndex].times[timeIndex].isBooked = true;
    console.log('Set newdate and newtime with true');
    this.updateSpecial(this.special);
  }

  cancelAppt(): void {
    // confirmation box
    var confirmed = confirm("Are you sure you want to delete this appointment?");

    if (confirmed){
      var authDetails = JSON.parse(localStorage.getItem("authDetails"));

      try
      {
        this.appointmentService.deleteAppointment(this.appointment, authDetails.idToken)
        .subscribe(() => this.goBack());
      }
      catch(e)
      {
        console.log(e);
        alert("Error: could not delete appointment - User was logged out, please login again");
        return;
      }

      this.special.dates[this.saveDateIndex].times[this.saveTimeIndex].isBooked = false;
      console.log('Set savedate and savetime with true');
      this.updateSpecial(this.special);
    }

  }


  private get disabledV():string {
    return this._disabledV;
  }

  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  updateSpecial(special: Special): void {
    this.specialService.updateSpecial(special).subscribe();
  }

  private convertDate(date: number): string {
    return this.utilityService.convertDate(date);
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

  private validatePhone(phone: string): number {
    return this.utilityService.validatePhone(phone);
  }

  goBack(): void {
    this.location.back();
  }

}
