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
import { AbogadosIngresosFormComponent } from './abogados-ingresos/abogados-ingresos-form/abogados-ingresos-form.component';
import { AbogadosIngresosAccionesComponent } from './abogados-ingresos/abogados-ingresos-acciones/abogados-ingresos-acciones.component';
import { AbogadosIngresosTabsComponent } from './abogados-ingresos/abogados-ingresos-tabs/abogados-ingresos-tabs.component';
import { AbogadosIngresosTabsContratosComponent } from './abogados-ingresos/abogados-ingresos-tabs/abogados-ingresos-tabs-contratos/abogados-ingresos-tabs-contratos.component';
import { AbogadosIngresosTabsClientesComponent } from './abogados-ingresos/abogados-ingresos-tabs/abogados-ingresos-tabs-clientes/abogados-ingresos-tabs-clientes.component';
import { AbogadosIngresosTabsCuotasComponent } from './abogados-ingresos/abogados-ingresos-tabs/abogados-ingresos-tabs-cuotas/abogados-ingresos-tabs-cuotas.component';
import { DialogContratosComponent } from './abogados-ingresos/abogados-ingresos-acciones/dialog-contratos/dialog-contratos.component';
import { DialogMostrarContratosComponent } from './abogados-ingresos/abogados-ingresos-acciones/dialog-mostrar-contratos/dialog-mostrar-contratos.component';



@NgModule({
  declarations: [AbogadosIngresosComponent, AbogadosEgresosComponent, AbogadosHomeComponent, AbogadosEgresosFormComponent, AbogadosEgresosListComponent, AbogadosIngresosFormComponent, AbogadosIngresosAccionesComponent, AbogadosIngresosTabsComponent, AbogadosIngresosTabsContratosComponent, AbogadosIngresosTabsClientesComponent, AbogadosIngresosTabsCuotasComponent, DialogContratosComponent, DialogMostrarContratosComponent],
  imports: [
    CommonModule,
    AbogadosRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class AbogadosModule { }
