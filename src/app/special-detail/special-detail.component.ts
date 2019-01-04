import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Appointment } from '../appointment';
import { AppointmentService }  from '../appointment.service';
import { Special } from '../special';
import { SpecialService }  from '../special.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UtilityService } from '../utility.service';
import { PICKTIMES } from '../pick-times';
import { MyDate } from '../my-date';
import { MyTime } from '../my-time';
import { AuthService }  from '../auth.service';


@Component({
  selector: 'app-special-detail',
  templateUrl: './special-detail.component.html',
  styleUrls: ['./special-detail.component.css']
})
export class SpecialDetailComponent implements OnInit {
  @Input() special: Special;

  // appointments: Appointment[];

  admin=false;

  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  pickTimes = PICKTIMES;

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

  ngOnInit() {
    this.isAuthorized();
    this.getSpecial();
  }


  isAuthorized(): void {
    var authDetails = JSON.parse(localStorage.getItem("authDetails"));
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

  getSpecial(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('found id as: ' + id);
    this.specialService.getSpecial(id.toString())
      .subscribe(special => this.special = special);
  }

  // initializeDates(): void {
  //   var obj = new MyDate();
  //   obj["value"] = 0;
  //   obj["times"] = [];
  //   this.dates.push(obj);
  // }

  addDate(): void {
    var obj = new MyDate();
    obj["value"] = 0;
    obj["times"] = [];
    this.special.dates.push(obj);
  }
  removeDate(): void {
    if (this.special.dates.length > 1)
    {
      this.special.dates.pop();
    }
    else
    {
      alert("Must have at least one date");
    }
  }

  convertDateToValue(d: string): number {
    var parts = d.split(" ");
    var months = {Jan: "01",Feb: "02",Mar: "03",Apr: "04",May: "05",Jun: "06",Jul: "07",Aug: "08",Sep: "09",Oct: "10",Nov: "11",Dec: "12"};
    return parseInt(parts[3]+months[parts[1]]+parts[2]);
  }

  save(): void {
    // for (var j = 0; j < this.special.dates.length; j++)
    // {
    //   if (this.special.dates[j].value != null)
    //   {
    //     this.special.dates[j].value = this.convertDateToValue(this.special.dates[j].value.toString());
    //   }
    //   console.log('Dates: ' + this.special.dates[j].value );
    //   for (var k = 0; k < this.special.dates[j].times.length; k++)
    //   {
    //     console.log('Times: ' + this.special.dates[j].times[k].value );
    //   }
    // }
    this.specialService.updateSpecial(this.special)
      .subscribe(() => this.goBack());
  }

  deleteSpecial(): void {
    // confirmation box
    var confirmed = confirm("Are you sure you want to delete this special?");

    if (confirmed){
      const appt = {
        _id: '',
        first: '',
        last: '',
        email: '',
        phone: 0,
        date: 0,
        time: 0,
        specialId: this.special._id
      };
      console.log('Getting appointments with special id = ' + this.special._id);
      this.specialService.deleteSpecial(this.special)
        .subscribe(() => this.goBack());

      this.appointmentService.getAppointments(appt)
        .subscribe(appointments => this.deleteAppointments(appointments, this.appointmentService));
      }

  }

  deleteAppointments(appointments: Appointment[], service: AppointmentService): void {
    appointments.forEach(function(appointment) {
      console.log(appointment.first);
      console.log(appointment._id);
      service.deleteAppointment(appointment)
        .subscribe(() => console.log('Appointment deleted with id: '+ appointment._id));
    });
  }

  goBack(): void {
    this.location.back();
  }

  private get disabledV():string {
    return this._disabledV;
  }

  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }


  private convertTime(time: number): string {
    return this.utilityService.convertTime(time);
  }

}
