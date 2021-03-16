import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostalRoutingModule } from './hostal-routing.module';
import { HostalHomeComponent } from './hostal-home/hostal-home.component';
import { MaterialModule } from 'src/app/material.module';
import { ComponentsModule } from 'src/app/_components/components.module';
import { HostalIngresosComponent } from './hostal-ingresos/hostal-ingresos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HostalIngresosFormComponent } from './hostal-ingresos/hostal-ingresos-form/hostal-ingresos-form.component';
import { HttpClientModule } from '@angular/common/http';
import { HostalIngresosListComponent } from './hostal-ingresos/hostal-ingresos-list/hostal-ingresos-list.component';
import { HostalEgresosComponent } from './hostal-egresos/hostal-egresos.component';
import { HostalEgresosFormComponent } from './hostal-egresos/hostal-egresos-form/hostal-egresos-form.component';
import { HostalEgresosListComponent } from './hostal-egresos/hostal-egresos-list/hostal-egresos-list.component';


@NgModule({
  declarations: [
    HostalHomeComponent,
    HostalIngresosComponent,
    HostalIngresosFormComponent,
    HostalIngresosListComponent,
    HostalEgresosComponent,
    HostalEgresosFormComponent,
    HostalEgresosListComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    HostalRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,

  ],
  exports: [
    HostalRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
  ]
})
export class HostalModule { }
