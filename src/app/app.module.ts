import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SideMenuComponent } from './components/app-pages/side-menu/side-menu.component';
import { TopBarComponent } from './components/app-pages/top-bar/top-bar.component';
import { MainComponent } from './components/app-pages/main/main.component';
import { DashboardMainComponent } from './components/app-pages/dashboard/dashboard-main/dashboard-main.component';

import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';
import { DireccionMainComponent } from './components/app-pages/direccion/direccion-main/direccion-main.component';
import { CheckinComponent } from './components/app-pages/dashboard/checkin/checkin.component';
import { MonthHoursComponent } from './components/app-pages/dashboard/month-hours/month-hours.component';

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
    MonthHoursComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
