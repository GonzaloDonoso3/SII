import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RentacarRoutingModule } from './rentacar-routing.module';
import { RentacarEgresosComponent } from './rentacar-egresos/rentacar-egresos.component';
import { RentacarIngresosComponent } from './rentacar-ingresos/rentacar-ingresos.component';
import { RentacarHomeComponent } from './rentacar-home/rentacar-home.component';
import { RentacarEgresosFormComponent } from './rentacar-egresos/rentacar-egresos-form/rentacar-egresos-form.component';
import { RentacarEgresosListComponent } from './rentacar-egresos/rentacar-egresos-list/rentacar-egresos-list.component';
import { RentacarIngresosListComponent } from './rentacar-ingresos/rentacar-ingresos-list/rentacar-ingresos-list.component';
import { ComponentsModule } from '@app/_components/components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RentacarIngresosFormComponent } from './rentacar-ingresos/rentacar-ingresos-form/rentacar-ingresos-form.component';
import { RentacarModalDetallePagosComponent } from './rentacar-ingresos/rentacar-ingresos-list/rentacar-modal-detalle-pagos/rentacar-modal-detalle-pagos.component';
import { RentacarModalDetallePagosClientesComponent } from './rentacar-ingresos/rentacar-ingresos-list/rentacar-modal-detalle-pagos/rentacar-modal-detalle-pagos-clientes/rentacar-modal-detalle-pagos-clientes.component';
import { RentacarModalDetallePagosReemplazosComponent } from './rentacar-ingresos/rentacar-ingresos-list/rentacar-modal-detalle-pagos/rentacar-modal-detalle-pagos-reemplazos/rentacar-modal-detalle-pagos-reemplazos.component';
import { RentacarModalDetallePagosDaniosComponent } from './rentacar-ingresos/rentacar-ingresos-list/rentacar-modal-detalle-pagos/rentacar-modal-detalle-pagos-danios/rentacar-modal-detalle-pagos-danios.component';
import { RentacarModalDetallePagosExtrasComponent } from './rentacar-ingresos/rentacar-ingresos-list/rentacar-modal-detalle-pagos/rentacar-modal-detalle-pagos-extras/rentacar-modal-detalle-pagos-extras.component';
import { RentacarIngresosList2Component } from './rentacar-ingresos/rentacar-ingresos-list2/rentacar-ingresos-list2.component';
import { RentacarModalSubirFilesComponent } from './rentacar-ingresos/rentacar-ingresos-form/rentacar-modal-subir-files/rentacar-modal-subir-files.component';
import { RentacarModalVerFilesComponent } from './rentacar-ingresos/rentacar-ingresos-form/rentacar-modal-ver-files/rentacar-modal-ver-files.component';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 

FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin
]);


@NgModule({
  declarations: [RentacarEgresosComponent, RentacarIngresosComponent, RentacarHomeComponent, RentacarEgresosFormComponent, RentacarEgresosListComponent, RentacarIngresosListComponent, RentacarIngresosFormComponent, RentacarModalDetallePagosComponent, RentacarModalDetallePagosClientesComponent, RentacarModalDetallePagosReemplazosComponent, RentacarModalDetallePagosDaniosComponent, RentacarModalDetallePagosExtrasComponent, RentacarIngresosList2Component, RentacarModalSubirFilesComponent, RentacarModalVerFilesComponent],
  imports: [
    CommonModule,
    RentacarRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
    FullCalendarModule
  ]
})
export class RentacarModule { }
