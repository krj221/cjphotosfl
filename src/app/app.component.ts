import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Appointments:';
  admin = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // this.getUsers();
    this.isAuthorized();
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

  logout(): void {
    this.authService.logout();
  }
}
