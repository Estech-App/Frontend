import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TopBarComponent } from './components/app-pages/top-bar/top-bar.component';
import { SideMenuComponent } from './components/app-pages/side-menu/side-menu.component';
import { MainComponent } from './components/app-pages/main/main.component';
import { DashboardMainComponent } from './components/app-pages/dashboard/dashboard-main/dashboard-main.component';
import { tokenGuard } from './guards/token.guard';
import { DireccionMainComponent } from './components/app-pages/direccion/direccion-main/direccion-main.component';
import { UsuariosComponent } from './components/app-pages/usuarios/usuarios.component';
import { GruposComponent } from './components/app-pages/grupos/grupos.component';
import { CheckinsComponent } from './components/app-pages/checkins/checkins.component';
import { RoomsComponent } from './components/app-pages/rooms/rooms.component';
import { StockComponent } from './components/app-pages/stock/stock.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent, title: 'Login | Estech'},
  {path: '', component: MainComponent, children: [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardMainComponent, title: 'Dashboard | Estech'},
    {path: 'direccion', component: DireccionMainComponent, title: 'Direccion | Estech'},
    {path: 'grupos', component: GruposComponent, title: 'Grupos | Estech'},
    {path: 'usuarios', component: UsuariosComponent, title: 'Usuarios | Estech'},
    {path: 'fichajes', component: CheckinsComponent, title: 'Fichajes | Estech'},
    {path: 'salas', component: RoomsComponent, title: 'Salas | Estech'},
    {path: 'stock', component: StockComponent, title: 'Stock | Estech'},
  ], canActivate: [tokenGuard]},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
