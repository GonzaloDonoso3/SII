import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LubricentroRoutingModule } from './lubricentro-routing.module';
import { LubricentroHomeComponent } from './lubricentro-home/lubricentro-home.component';
import { LubricentroIngresosComponent } from './lubricentro-ingresos/lubricentro-ingresos.component';
import { LubricentroEgresosComponent } from './lubricentro-egresos/lubricentro-egresos.component';
import { LubricentroEgresosListComponent } from './lubricentro-egresos/lubricentro-egresos-list/lubricentro-egresos-list.component';
import { LubricentroEgresosFormComponent } from './lubricentro-egresos/lubricentro-egresos-form/lubricentro-egresos-form.component';
import { LubricentroIngresosFormComponent } from './lubricentro-ingresos/lubricentro-ingresos-form/lubricentro-ingresos-form.component';
import { LubricentroIngresosListComponent } from './lubricentro-ingresos/lubricentro-ingresos-list/lubricentro-ingresos-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { ComponentsModule } from '@app/_components/components.module';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction';
import { LubricentroEgresosCuotasComponent } from './lubricentro-egresos/lubricentro-egresos-list/lubricentro-egresos-cuotas/lubricentro-egresos-cuotas.component';
import { LubricentroEgresosCuotaDialogComponent } from './lubricentro-egresos/lubricentro-egresos-list/lubricentro-egresos-cuotas/lubricentro-egresos-cuota-dialog/lubricentro-egresos-cuota-dialog.component'; 

FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    LubricentroHomeComponent,
    LubricentroIngresosComponent,
    LubricentroEgresosComponent,
    LubricentroEgresosListComponent,
    LubricentroEgresosFormComponent,
    LubricentroIngresosFormComponent,
    LubricentroIngresosListComponent,    
    LubricentroEgresosCuotasComponent, LubricentroEgresosCuotaDialogComponent
  ],
  imports: [
    CommonModule,
    LubricentroRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
    FullCalendarModule
  ],
  exports: [
    LubricentroRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
  ]
})
export class LubricentroModule { }
