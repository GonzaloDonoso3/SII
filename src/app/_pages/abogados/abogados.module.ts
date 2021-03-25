import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbogadosIngresosComponent } from './abogados-ingresos/abogados-ingresos.component';
import { AbogadosEgresosComponent } from './abogados-egresos/abogados-egresos.component';
import { AbogadosHomeComponent } from './abogados-home/abogados-home.component';
import { AbogadosRoutingModule } from './abogados-routing.module';



@NgModule({
  declarations: [AbogadosIngresosComponent, AbogadosEgresosComponent, AbogadosHomeComponent],
  imports: [
    CommonModule,
    AbogadosRoutingModule
  ]
})
export class AbogadosModule { }
