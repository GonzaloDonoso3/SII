<<<<<<< HEAD
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MenusItems } from 'src/app/_models/menu-items';
import { environment } from '../../environments/environment';
import { AuthSharedService } from '@app/_pages/shared/shared-services/auth-shared.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  menuItems: MenusItems[];
  subMenuItems: MenusItems[];
  menuItemsAdmin: MenusItems[];
  subMenuItemsAdmin: MenusItems[];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public auth: AuthSharedService) {
    this.menuItems = [
      { name: 'HOSTAL', icon: 'bed', url: 'hostal' },
      { name: 'LUBRICENTRO', icon: 'commute', url: 'lubricentro' },
      { name: 'RENTACAR', icon: 'directions_car', url: 'rentacar' },
      { name: 'INMOBILIARIA', icon: 'chair', url: 'inmobiliaria' },
      { name: 'FIRMA ABOGADOS', icon: 'account_balance', url: 'firmaAbogado' },
      { name: 'IMPORTADORA', icon: 'flight_land', url: 'importadora' },
      
      /* { name: 'AGROFIRMA PROYECTOS', icon: 'agriculture', url: 'agrofirma' } */
    ];
    this.subMenuItems = [
      { name: 'INGRESOS', icon: 'align_horizontal_right', url: 'ingresos' },
      {
        name: 'EGRESOS', icon: 'align_horizontal_right', url: 'egresos'
      },
      /*    { name: 'ACTIVOS', icon: 'align_horizontal_right', url: '' },
         { name: 'PASIVOS', icon: 'align_horizontal_right', url: '' },
         { name: 'CONSOLIDADOS', icon: 'align_horizontal_right', url: '' } */
    ];


    this.menuItemsAdmin = [
      { name: 'ADMINISTRACIÓN', icon: 'manage_accounts', url: 'administracion' },
    ];
    this.subMenuItemsAdmin = [
      { name: 'USUARIOS', icon: 'align_horizontal_right', url: 'usuarios' 
      },

      {
        name: 'EMPRESAS', icon: 'align_horizontal_right', url: 'empresas'
      },

      {
        name: 'SUCURSALES', icon: 'align_horizontal_right', url: 'sucursales'
      },
      {
        name: 'ROLES', icon: 'align_horizontal_right', url: 'roles'
      }
      /*    { name: 'ACTIVOS', icon: 'align_horizontal_right', url: '' },
         { name: 'PASIVOS', icon: 'align_horizontal_right', url: '' },
         { name: 'CONSOLIDADOS', icon: 'align_horizontal_right', url: '' } */
    ];
  }

  volverVistaAtigua() {
    window.location.href = `${environment.indexUrlAntigua}`;
    // window.location.href = `${environment.indexUrl}`;
  }

  cerrarSesion(){
    this.auth.cerrarSesion();
  }

}
=======
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MenusItems } from 'src/app/_models/menu-items';
import { environment } from '../../environments/environment';
import { AuthSharedService } from '@app/_pages/shared/shared-services/auth-shared.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  menuItems: MenusItems[];
  subMenuItems: MenusItems[];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public auth: AuthSharedService) {
    this.menuItems = [
      { name: 'HOSTAL', icon: 'bed', url: 'hostal' },
      { name: 'LUBRICENTRO', icon: 'commute', url: 'lubricentro' },
      { name: 'RENTACAR', icon: 'directions_car', url: 'rentacar' },
      { name: 'INMOBILIARIA', icon: 'chair', url: 'inmobiliaria' },
      { name: 'FIRMA ABOGADOS', icon: 'account_balance', url: 'firmaAbogado' },
       /* { name: 'AGROFIRMA PROYECTOS', icon: 'agriculture', url: 'agrofirma' } */
    ];
    this.subMenuItems = [
      { name: 'INGRESOS', icon: 'align_horizontal_right', url: 'ingresos' },
      {
        name: 'EGRESOS', icon: 'align_horizontal_right', url: 'egresos'
      },
      /*    { name: 'ACTIVOS', icon: 'align_horizontal_right', url: '' },
         { name: 'PASIVOS', icon: 'align_horizontal_right', url: '' },
         { name: 'CONSOLIDADOS', icon: 'align_horizontal_right', url: '' } */
    ];
  }

  volverVistaAtigua() {
    localStorage.removeItem('usertoken');
    localStorage.removeItem('usuario');
    window.location.href = `${environment.indexUrl}`;
  }

}
>>>>>>> bc39663724976ddcc33e546dc7c0393e95e390ee
