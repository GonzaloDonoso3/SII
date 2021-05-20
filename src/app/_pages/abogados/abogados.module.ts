import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './../../_components/components.module';
import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbogadosIngresosComponent } from './abogados-ingresos/abogados-ingresos.component';
import { AbogadosEgresosComponent } from './abogados-egresos/abogados-egresos.component';
import { AbogadosHomeComponent } from './abogados-home/abogados-home.component';
import { AbogadosRoutingModule } from './abogados-routing.module';
import { AbogadosEgresosFormComponent } from './abogados-egresos/abogados-egresos-form/abogados-egresos-form.component';
import { AbogadosEgresosListComponent } from './abogados-egresos/abogados-egresos-list/abogados-egresos-list.component';

import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
  declarations: [
    AbogadosIngresosComponent, 
    AbogadosEgresosComponent, 
    AbogadosHomeComponent, 
    AbogadosEgresosFormComponent, 
    AbogadosEgresosListComponent
  ],
  imports: [
    CommonModule,
    AbogadosRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,

    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatTableExporterModule
  ],
  exports: [
    AbogadosRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
  ]
})
export class AbogadosModule { }
