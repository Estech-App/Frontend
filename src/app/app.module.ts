import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SideMenuComponent } from './components/app-pages/side-menu/side-menu.component';
import { TopBarComponent } from './components/app-pages/top-bar/top-bar.component';
import { MainComponent } from './components/app-pages/main/main.component';
import { DashboardMainComponent } from './components/app-pages/dashboard/dashboard-main/dashboard-main.component';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DireccionMainComponent } from './components/app-pages/direccion/direccion-main/direccion-main.component';
import { CheckinComponent } from './components/app-pages/dashboard/checkin/checkin.component';
import { MonthHoursComponent } from './components/app-pages/dashboard/month-hours/month-hours.component';
import { CoursesComponent } from './components/app-pages/direccion/courses/courses.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ModulesComponent } from './components/app-pages/direccion/modules/modules.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupsDashboardComponent } from './components/app-pages/dashboard/groups-dashboard/groups-dashboard.component';
import { CalendarDashboardComponent } from './components/app-pages/dashboard/calendar-dashboard/calendar-dashboard.component';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import { UsuariosComponent } from './components/app-pages/usuarios/usuarios.component';
import { GruposComponent } from './components/app-pages/grupos/grupos.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideMenuComponent,
    TopBarComponent,
    MainComponent,
    DashboardMainComponent,
    DireccionMainComponent,
    CheckinComponent,
    MonthHoursComponent,
    CoursesComponent,
    ModulesComponent,
    GroupsDashboardComponent,
    CalendarDashboardComponent,
    UsuariosComponent,
    GruposComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatSelectModule,
	MatRadioModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
