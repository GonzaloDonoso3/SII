import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbogadosIngresosComponent } from './abogados-ingresos/abogados-ingresos.component';
import { AbogadosEgresosComponent } from './abogados-egresos/abogados-egresos.component';
import { AbogadosHomeComponent } from './abogados-home/abogados-home.component';
import { AbogadosRoutingModule } from './abogados-routing.module';
import { AbogadosEgresosFormComponent } from './abogados-egresos/abogados-egresos-form/abogados-egresos-form.component';
import { AbogadosEgresosListComponent } from './abogados-egresos/abogados-egresos-list/abogados-egresos-list.component';



@NgModule({
  declarations: [AbogadosIngresosComponent, AbogadosEgresosComponent, AbogadosHomeComponent, AbogadosEgresosFormComponent, AbogadosEgresosListComponent],
  imports: [
    CommonModule,
    AbogadosRoutingModule
  ]
})
export class AbogadosModule { }
