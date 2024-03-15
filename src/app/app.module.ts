import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SideMenuComponent } from './components/app-pages/side-menu/side-menu.component';
import { TopBarComponent } from './components/app-pages/top-bar/top-bar.component';
import { MainComponent } from './components/app-pages/main/main.component';
import { DashboardMainComponent } from './components/app-pages/dashboard/dashboard-main/dashboard-main.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';
import { DireccionMainComponent } from './components/app-pages/direccion/direccion-main/direccion-main.component';
import { CheckinComponent } from './components/app-pages/dashboard/checkin/checkin.component';
import { MonthHoursComponent } from './components/app-pages/dashboard/month-hours/month-hours.component';
import { CoursesComponent } from './components/app-pages/direccion/courses/courses.component';
import { CreateUpdateCoursesComponent } from './components/app-pages/direccion/create-update-courses/create-update-courses.component';
import { TokenInterceptor } from './interceptors/token.interceptor';

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
    CreateUpdateCoursesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
