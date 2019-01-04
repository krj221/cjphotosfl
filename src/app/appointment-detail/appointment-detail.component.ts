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

  save(): void {
    this.appointmentService.updateAppointment(this.appointment)
      .subscribe(() => this.goBack());

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

      this.appointmentService.deleteAppointment(this.appointment)
      .subscribe(() => this.goBack());

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

  goBack(): void {
    this.location.back();
  }

}
