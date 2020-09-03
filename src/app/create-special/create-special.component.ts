import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';
import { Special } from '../special';
import { SpecialService } from '../special.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UtilityService } from '../utility.service';
import { MessageService } from '../message.service';
import { AuthService } from '../auth.service';
import { MyDate } from '../my-date';
import { MyTime } from '../my-time';
import { PICKTIMES } from '../pick-times';

@Component({
  selector: 'app-create-special',
  templateUrl: './create-special.component.html',
  styleUrls: ['./create-special.component.css','../app.component.css']
})
export class CreateSpecialComponent implements OnInit {
  @Input() special: Special;

  admin=false;
  specials: Special[];

  dates: MyDate[] = [];

  timesToAdd: MyTime[] = [];

  pickTimes = PICKTIMES;

  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  //Add component like Dates.ts or Times.ts to store data
  // specialsCtrl = new FormControl();
  dateControl = new FormControl('', [Validators.required]);
  disableSelect = new FormControl(false);

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private specialService: SpecialService,
    private location: Location,
    private utilityService: UtilityService,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAuthorized();
    this.initializeDates();
    this.getSpecials();
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

  initializeDates(): void {
    var obj = new MyDate();
    obj["value"] = 0;
    obj["times"] = [];
    this.dates.push(obj);
  }

  getSpecials(): void {
    const spec = new Special();
    this.specialService.getSpecials(spec)
        .subscribe(specials => this.specials = specials);
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

  convertDateToValue(d: string): number {
    var parts = d.split(" ");
    var months = {Jan: "01",Feb: "02",Mar: "03",Apr: "04",May: "05",Jun: "06",Jul: "07",Aug: "08",Sep: "09",Oct: "10",Nov: "11",Dec: "12"};
    return parseInt(parts[3]+months[parts[1]]+parts[2]);
  }

  add(name: string, photoDir: string, description: string): void {
    console.log("Name: " + name);
    for (var j = 0; j < this.dates.length; j++)
    {
      this.dates[j].value = this.convertDateToValue(this.dates[j].value.toString());
      console.log('Dates: ' + this.dates[j].value );
      for (var k = 0; k < this.dates[j].times.length; k++)
      {
        console.log('Times: ' + this.dates[j].times[k].value );
      }
    }

    var invalidName = false;
    var invalidDate = false;
    var alertMessage = ' ';

    if (!name){
      invalidName = true;
      alertMessage += '\nSpecial name is blank';
    }
    if (!this.dates){
      invalidDate = true;
      alertMessage += '\nMust set dates';
    }

    if (invalidName || invalidDate) {
      // this.log('First name, last name, email or phone number is invalid.');
      alert(alertMessage);
      return;
    }

    // confirmation box
    var confirmed = confirm("Confirm special?");

    if (confirmed){
      // var newSpecial = new Special();
      // newSpecial.name = name;
      // newSpecial.photoDir = photoDir;

      var dates = this.dates;

      var authDetails = JSON.parse(localStorage.getItem("authDetails"));

      try
      {
        this.specialService.addSpecial({name, photoDir, description, dates } as Special, authDetails.idToken)
        .subscribe(special => {
          this.specials.push(special);
        });
      }
      catch(e)
      {
        console.log(e);
        alert("Error: Special not created - User was logged out, please login again");
        return;
      }


      alert('Special created');

      this.log(name + ' ' + photoDir + ' ' + description);
      this.goBack();
    }
    else{
      // appointmentFirst = first;

    }
  }
  addDate(): void {
    var obj = new MyDate();
    obj["value"] = 0;
    obj["times"] = [];
    this.dates.push(obj);
  }
  removeDate(): void {
    if (this.dates.length > 1)
    {
      this.dates.pop();
    }
    else
    {
      alert("Must have at least one date");
    }
  }

  goBack(): void {
    this.location.back();
  }

  private log(message: string) {
    this.messageService.add(`Create-special Component: ${message}`);
  }

  private convertDate(date: number): string {
    return this.utilityService.convertDate(date);
  }

  private convertTime(time: number): string {
    return this.utilityService.convertTime(time);
  }

  private getDateIndex(date: number, special: Special): number {
    return this.utilityService.getDateIndex(date, special);
  }

  private getTimeIndex(time: number, dateIndex: number, special: Special): number {
    return this.utilityService.getTimeIndex(time, dateIndex, special);
  }

}
