import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TopBarComponent } from './components/app-pages/top-bar/top-bar.component';
import { SideMenuComponent } from './components/app-pages/side-menu/side-menu.component';
import { MainComponent } from './components/app-pages/main/main.component';
import { DashboardMainComponent } from './components/app-pages/dashboard/dashboard-main/dashboard-main.component';
import { tokenGuard } from './guards/token.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent, title: 'Login | Estech'},
  {path: '', component: MainComponent, children: [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardMainComponent, title: 'Dashboard | Estech'}
  ], canActivate: [tokenGuard]},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
