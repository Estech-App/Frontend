import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ItemMenu } from 'src/app/models/ItemMenu';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {

  constructor(private router: Router) { }

  items: ItemMenu[] = [
    { nombre: "Dashboard", src: "../../../assets/Images/sidebar/outlined/Dashboard.svg", srcHover: "../../../assets/Images/sidebar/filled/Dashboard.svg", link: 'dashboard' },
    { nombre: "Dirección", src: "../../../assets/Images/sidebar/outlined/Direccion.svg", srcHover: "../../../assets/Images/sidebar/filled/Direccion.svg", link: 'direccion' },
    { nombre: "Grupos", src: "../../../assets/Images/sidebar/outlined/Grupos.svg", srcHover: "../../../assets/Images/sidebar/filled/Grupos.svg", link: 'grupos' },
    { nombre: "Usuarios", src: "../../../assets/Images/sidebar/outlined/Usuarios.svg", srcHover: "../../../assets/Images/sidebar/filled/Usuarios.svg", link: 'usuarios' },
    { nombre: "Fichajes", src: "../../../assets/Images/sidebar/outlined/Fichajes.svg", srcHover: "../../../assets/Images/sidebar/filled/Fichajes.svg", link: 'fichajes' },
    { nombre: "Stock", src: "../../../assets/Images/sidebar/outlined/Stock.svg", srcHover: "../../../assets/Images/sidebar/filled/Stock.svg", link: 'stock' },
    { nombre: "Salas", src: "../../../assets/Images/sidebar/outlined/Salas.svg", srcHover: "../../../assets/Images/sidebar/filled/Salas.svg", link: 'salas' }
  ];

  isActiveLink(item: ItemMenu): boolean {
    return this.router.isActive(item.link, true);
  }

  changeImage(item: ItemMenu, isHovered: boolean): void {
    if (isHovered) {
      item.src = item.srcHover;
    } else {
      item.src = item.src.replace("filled", "outlined");
    }
  }
}
