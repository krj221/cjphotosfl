import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { SpecialsComponent } from './specials/specials.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { AppointmentDetailComponent }  from './appointment-detail/appointment-detail.component';
import { AppointmentSearchComponent }  from './appointment-search/appointment-search.component';
import { BookDetailComponent }  from './book-detail/book-detail.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { SpecialDetailComponent }  from './special-detail/special-detail.component';
import { CreateSpecialComponent }  from './create-special/create-special.component';
import { SignupComponent }  from './signup/signup.component';
import { LoginComponent }  from './login/login.component';
import { ApptsBySpecialsComponent }  from './appts-by-specials/appts-by-specials.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  // { path: 'appointments', component: AppointmentsComponent },
  { path: 'appointments/:id', component: AppointmentsComponent },
  { path: 'detail/:id', component: AppointmentDetailComponent },
  { path: 'book-appointment', component: BookAppointmentComponent },
  { path: 'book-detail/:id', component: BookDetailComponent },
  { path: 'special-detail/:id', component: SpecialDetailComponent },
  { path: 'specials', component: SpecialsComponent },
  { path: 'create-special', component: CreateSpecialComponent },
  { path: 'signup/:id', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'appointment-search', component: AppointmentSearchComponent },
  { path: 'appts-by-specials', component: ApptsBySpecialsComponent }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
