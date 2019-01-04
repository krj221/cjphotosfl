import { Component, OnInit } from '@angular/core';
import { Special } from '../special';
import { SpecialService } from '../special.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-specials',
  templateUrl: './specials.component.html',
  styleUrls: ['./specials.component.css']
})
export class SpecialsComponent implements OnInit {
  specials: Special[];

  admin=false;

  constructor(
    private specialService: SpecialService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isAuthorized();
    this.getSpecials();
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

  getSpecials(): void {
    const spec = new Special();
    this.specialService.getSpecials(spec)
        .subscribe(specials => this.specials = specials);
  }
  //
  // add(name: string, photoDir: string, date[]: number, time: number): void {
  //   name = name.trim();
  //   photoDir = photoDir.trim();
  //
  //   if (!name || !photoDir) ){ return; }
  //   this.specialService.addSpecial({ name, photoDir, date, phone } as Special)
  //     .subscribe(special => {
  //       this.specials.push(special);
  //     });
  // }
  //
  // delete(special: Special): void {
  //   this.specials = this.specials.filter(a => a !== special);
  //   this.specialService.deleteSpecial(special).subscribe();
  // }

}
