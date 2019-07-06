import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UtilityService } from '../utility.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // @Input() users: User[];
  user: User;

  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  //Add component like Dates.ts or Times.ts to store data

  disableSelect = new FormControl(false);

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private location: Location,
    private utilityService: UtilityService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // this.getUsers();
  }

  // save(): void {
  //   this.userService.updateUser(this.user)
  //     .subscribe(() => this.goBack());
  // }

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

  add(email: string, password: string):void {

    if (email && password) {
        this.authService.login(email.trim(), password)
            .subscribe(
                auth_token => this.checkToken(auth_token)
            );
    }
  }

  checkToken(auth_token: Object): boolean {
    if (auth_token != null) {
      console.log("found token");
      localStorage.setItem("authDetails", JSON.stringify(auth_token));
      var authDetails = JSON.parse(localStorage.getItem("authDetails"));
      console.log("authDetails (token): " + authDetails.idToken);
      console.log(JSON.stringify(auth_token));
      console.log("User is logged in");
      this.location.go('/dashboard');
      location.reload();
      return true;
    }
    else {
      console.log("could not find token");
      alert("Username or Password incorrect");
      return false;
    }
  }

  goBack(): void {
    this.location.back();
  }

  private log(message: string) {
    this.messageService.add(`Book-Detail Component: ${message}`);
  }

}
