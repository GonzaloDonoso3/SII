import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RentacarRoutingModule } from './rentacar-routing.module';
import { RentacarEgresosComponent } from './rentacar-egresos/rentacar-egresos.component';
import { RentacarIngresosComponent } from './rentacar-ingresos/rentacar-ingresos.component';
import { RentacarHomeComponent } from './rentacar-home/rentacar-home.component';
import { RentacarEgresosFormComponent } from './rentacar-egresos/rentacar-egresos-form/rentacar-egresos-form.component';
import { RentacarEgresosListComponent } from './rentacar-egresos/rentacar-egresos-list/rentacar-egresos-list.component';
import { RentacarIngresosListComponent } from './rentacar-ingresos/rentacar-ingresos-list/rentacar-ingresos-list.component';


@NgModule({
  declarations: [RentacarEgresosComponent, RentacarIngresosComponent, RentacarHomeComponent, RentacarEgresosFormComponent, RentacarEgresosListComponent, RentacarIngresosListComponent],
  imports: [
    CommonModule,
    RentacarRoutingModule
  ]
})
export class RentacarModule { }
