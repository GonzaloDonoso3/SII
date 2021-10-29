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
  subMenuItemsAgrofirma: MenusItems[];
  subMenuItemsPrestamos: MenusItems[];
  subMenuItemsSii: MenusItems[];
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
      { name: 'AGROFIRMA', icon: 'agriculture', url: 'agrofirma' },
      { name: 'IMPORTADORA', icon: 'flight_land', url: 'importadora' },      
      { name: 'PRESTAMOS', icon: 'flip_camera_android', url: 'prestamos' },      
      { name: 'SII', icon: 'description', url: 'sii' },      
      
      /* { name: 'AGROFIRMA PROYECTOS', icon: 'agriculture', url: 'agrofirma' } */
    ];
    this.subMenuItems = [
      { name: 'INGRESOS', icon: 'align_horizontal_right', url: 'ingresos' },
      {
        name: 'EGRESOS', icon: 'align_horizontal_right', url: 'egresos'
      },
      // {
      //   name: 'CONSOLIDADOS', icon: 'align_horizontal_right', url: 'consolidados'
      // },
      /*    { name: 'ACTIVOS', icon: 'align_horizontal_right', url: '' },
         { name: 'PASIVOS', icon: 'align_horizontal_right', url: '' },
         { name: 'CONSOLIDADOS', icon: 'align_horizontal_right', url: '' } */
    ];
    this.subMenuItemsAgrofirma = [
      { name: 'INGRESOS', icon: 'align_horizontal_right', url: 'ingresos' },
      {name: 'EGRESOS', icon: 'align_horizontal_right', url: 'egresos' },
      {name: 'PROYECTOS', icon: 'align_horizontal_right', url: 'proyectos'}
    ];

    this.subMenuItemsPrestamos = [
      { name: 'EMPRESAS', icon: 'align_horizontal_right', url: 'empresas' },      
    ]

    this.subMenuItemsSii = [
      { name: 'FACTURA', icon: 'align_horizontal_right', url: 'factura' },      
      { name: 'BOLETA', icon: 'align_horizontal_right', url: 'boleta' },      
    ]

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
     //window.location.href = `${environment.indexUrl}`;
  }

  cerrarSesion(){
    this.auth.cerrarSesion();
  }

}
