import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MenusItems } from 'src/app/_models/menu-items';
import { environment } from '../../environments/environment';

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

  constructor(private breakpointObserver: BreakpointObserver) {
    this.menuItems = [
      { name: 'HOSTAL', icon: 'bed', url: 'hostal' },
      { name: 'LUBRICENTRO', icon: 'commute', url: 'lubricentro' },
      /*  { name: 'RENTACAR', icon: 'directions_car', url: 'rentacar' },
       { name: 'INMOBILIARIA', icon: 'chair', url: 'inmobiliaria' },
       { name: 'FIRMA ABOGADOS', icon: 'account_balance', url: 'firmaAbogado' },
       { name: 'AGROFIRMA PROYECTOS', icon: 'agriculture', url: 'agrofirma' } */
    ];
    this.subMenuItems = [
      { name: 'INGRESOS', icon: 'align_horizontal_right', url: 'ingresos' },
      {
        name: 'EGRESOS', icon: 'align_horizontal_right', url: 'egresos'
      },
      /*  { name: 'ACTIVOS', icon: 'align_horizontal_right', url: '' },
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
