import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './../../_components/components.module';
import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InmobiliariaRoutingModule } from './inmobiliaria-routing.module';
import { InmobiliariaHomeComponent } from './inmobiliaria-home/inmobiliaria-home.component';
import { InmobiliariaIngresosComponent } from './inmobiliaria-ingresos/inmobiliaria-ingresos.component';
import { InmobiliariaEgresosComponent } from './inmobiliaria-egresos/inmobiliaria-egresos.component';
import { InmobiliariaEgresosFormComponent } from './inmobiliaria-egresos/inmobiliaria-egresos-form/inmobiliaria-egresos-form.component';
import { InmobiliariaEgresosListComponent } from './inmobiliaria-egresos/inmobiliaria-egresos-list/inmobiliaria-egresos-list.component';
import { InmobiliariaIngresosListComponent } from './inmobiliaria-ingresos/inmobiliaria-ingresos-list/inmobiliaria-ingresos-list.component';
import { InmobiliariaIngresosFormComponent } from './inmobiliaria-ingresos/inmobiliaria-ingresos-form/inmobiliaria-ingresos-form.component';


@NgModule({
  declarations: [InmobiliariaHomeComponent, InmobiliariaIngresosComponent, InmobiliariaEgresosComponent, InmobiliariaEgresosFormComponent, InmobiliariaEgresosListComponent, InmobiliariaIngresosListComponent, InmobiliariaIngresosFormComponent],
  imports: [
    CommonModule,
    InmobiliariaRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class InmobiliariaModule { }
