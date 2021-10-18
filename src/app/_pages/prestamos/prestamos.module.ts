import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrestamosRoutingModule } from './prestamos-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { ComponentsModule } from 'src/app/_components/components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PrestamosHomeComponent } from './prestamos-home/prestamos-home.component';
import { PrestamosIngresosEgresosComponent } from './prestamos-ingresos-egresos/prestamos-ingresos-egresos.component';
import { PrestamosFormComponent } from './prestamos-ingresos-egresos/prestamos-form/prestamos-form.component';
import { PrestamosListComponent } from './prestamos-ingresos-egresos/prestamos-list/prestamos-list.component';
import { DialogDetalleEmpresaComponent } from './prestamos-ingresos-egresos/prestamos-list/dialog-detalle-empresa/dialog-detalle-empresa.component';



@NgModule({
  declarations: [    
    PrestamosHomeComponent,
    PrestamosIngresosEgresosComponent,
    PrestamosFormComponent,
    PrestamosListComponent,
    DialogDetalleEmpresaComponent    
  ],
  imports: [    
    HttpClientModule,
    CommonModule,
    PrestamosRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
    FullCalendarModule,
  ],
  exports: [
    PrestamosRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,   
  ]
})
export class PrestamosModule { }
