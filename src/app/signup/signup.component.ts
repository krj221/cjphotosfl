import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UtilityService } from '../utility.service';
import { MessageService } from '../message.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @Input() users: User[];
  user: User;

  admin = false;

  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;

  //Add component like Dates.ts or Times.ts to store data

  disableSelect = new FormControl(false);

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private utilityService: UtilityService,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.isAuthorized();
    this.authorizeUser();
    this.getUsers();
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
      this.location.go('/dashboard');
      location.reload();
      return false;
    }
  }

  authorizeUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('found id as: ' + id);
    if (id != 'crystal')
    {
      this.location.go('/dashboard');
      location.reload();
    }
  }

  getUsers(): void {
    const getUser = {
      _id: '',
      email: '',
      username: '',
      password: '',
      admin: true
    };
    this.userService.getUsers(getUser)
        .subscribe(users => this.users = users);
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

  add(email: string, username: string, password: string): void {
    email = email.trim().toUpperCase();
    username = username.trim().toUpperCase();
    var admin = true;

    var invalidEmail = false;
    var invalidUsername = false;
    var invalidPassword = false;
    var alertMessage = ' ';

    if (!email || !(this.utilityService.checkEmail(email))){
      invalidEmail = true;
      alertMessage += '\nEmail is invalid';
    }
    if (!username){
      invalidUsername = true;
      alertMessage += '\nUsername is blank';
    }
    if (!password){
      invalidPassword = true;
      alertMessage += '\nPassword is blank';
    }

    if (invalidEmail || invalidUsername || invalidPassword) {
      // this.log('First name, last name, email or phone number is invalid.');
      alert(alertMessage);
      return;
    }

    // confirmation box
    var confirmed = confirm("Create user?");

    if (confirmed){

      this.userService.addUser({email, username, password, admin } as User)
      .subscribe(user => {
        this.users.push(user);
      });

      alert('User created');

      // this.utilityService.EmailNotification();

      this.log(email + ' ' + username + ' ' + password );
      this.goBack();
    }
    else{
      // userFirst = first;

    }
  }

  goBack(): void {
    this.location.back();
  }

  // delete(user: User): void {
  //   this.users = this.users.filter(a => a !== user);
  //   this.userService.deleteUser(user).subscribe();
  // }

  private log(message: string) {
    this.messageService.add(`Book-Detail Component: ${message}`);
  }

}
