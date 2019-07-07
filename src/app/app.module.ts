import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { FormsModule } from '@angular/forms';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component'; // <-- NgModel lives here
import { HttpModule } from '@angular/http';
import { HttpClientModule }    from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';
import { AppointmentSearchComponent } from './appointment-search/appointment-search.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { AppointmentService } from './appointment.service';
import { SpecialsComponent } from './specials/specials.component';
import { SpecialDetailComponent } from './special-detail/special-detail.component';
import { SpecialService } from './special.service';
import { CreateSpecialComponent } from './create-special/create-special.component';
import { SignupComponent } from './signup/signup.component';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { ApptsBySpecialsComponent } from './appts-by-specials/appts-by-specials.component';
import { ReloadComponent } from './reload/reload.component';


@NgModule({
  declarations: [
    AppComponent,
    AppointmentsComponent,
    AppointmentDetailComponent,
    MessagesComponent,
    DashboardComponent,
    AppointmentSearchComponent,
    BookAppointmentComponent,
    BookDetailComponent,
    SpecialsComponent,
    SpecialDetailComponent,
    CreateSpecialComponent,
    SignupComponent,
    LoginComponent,
    FooterComponent,
    ApptsBySpecialsComponent,
    ReloadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // )
  ],
  providers: [MatDatepickerModule, AppointmentService, SpecialService, UserService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
