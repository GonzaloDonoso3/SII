//Importaciones
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './../../_components/components.module';
import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Rutas
import { ImportadoraRoutingModule } from './importadora-routing.module';
import { ImportadoraHomeComponent } from './importadora-home/importadora-home.component';
import { ImportadoraIngresosComponent } from './importadora-ingresos/importadora-ingresos.component';
import { ImportadoraEgresosComponent } from './importadora-egresos/importadora-egresos.component';
import { ImportadoraIngresosFormComponent } from './importadora-ingresos/importadora-ingresos-form/importadora-ingresos-form.component';
import { ImportadoraIngresosListComponent } from './importadora-ingresos/importadora-ingresos-list/importadora-ingresos-list.component';
import { ImportadoraEgresosTabGastoFijoComponent } from './importadora-egresos/importadora-egresos-tab-gasto-fijo/importadora-egresos-tab-gasto-fijo.component';
import { ImportadoraEgresosTabGastoNeumaticosComponent } from './importadora-egresos/importadora-egresos-tab-gasto-neumaticos/importadora-egresos-tab-gasto-neumaticos.component';
import { ImportadoraEgresosTabGastoFijoFormComponent } from './importadora-egresos/importadora-egresos-tab-gasto-fijo/importadora-egresos-tab-gasto-fijo-form/importadora-egresos-tab-gasto-fijo-form.component';
import { ImportadoraEgresosTabGastoFijoListComponent } from './importadora-egresos/importadora-egresos-tab-gasto-fijo/importadora-egresos-tab-gasto-fijo-list/importadora-egresos-tab-gasto-fijo-list.component';
import { ImportadoraEgresosTabGastoNeumaticosFormComponent } from './importadora-egresos/importadora-egresos-tab-gasto-neumaticos/importadora-egresos-tab-gasto-neumaticos-form/importadora-egresos-tab-gasto-neumaticos-form.component';
import { ImportadoraEgresosTabGastoNeumaticosListComponent } from './importadora-egresos/importadora-egresos-tab-gasto-neumaticos/importadora-egresos-tab-gasto-neumaticos-list/importadora-egresos-tab-gasto-neumaticos-list.component';
import { DialogNeumaticosComponent } from './importadora-egresos/importadora-egresos-tab-gasto-neumaticos/dialog-neumaticos/dialog-neumaticos.component';
import { DialogNeumaticosEditComponent } from './importadora-egresos/importadora-egresos-tab-gasto-neumaticos/dialog-neumaticos/dialog-neumaticos-edit/dialog-neumaticos-edit/dialog-neumaticos-edit.component';
import { ImportadoraEgresosTabCuotasComponent } from './importadora-egresos/importadora-egresos-tab-gasto-fijo/importadora-egresos-tab-gasto-fijo-list/importadora-egresos-tab-cuotas/importadora-egresos-tab-cuotas.component';
import { ImportadoraEgresosTabCuotaDialogComponent } from './importadora-egresos/importadora-egresos-tab-gasto-fijo/importadora-egresos-tab-gasto-fijo-list/importadora-egresos-tab-cuotas/importadora-egresos-tab-cuota-dialog/importadora-egresos-tab-cuota-dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';



@NgModule({
  declarations: [ImportadoraHomeComponent, ImportadoraIngresosComponent, ImportadoraEgresosComponent, ImportadoraIngresosFormComponent, ImportadoraIngresosListComponent, ImportadoraEgresosTabGastoFijoComponent, ImportadoraEgresosTabGastoNeumaticosComponent, ImportadoraEgresosTabGastoFijoFormComponent, ImportadoraEgresosTabGastoFijoListComponent, ImportadoraEgresosTabGastoNeumaticosFormComponent, ImportadoraEgresosTabGastoNeumaticosListComponent, DialogNeumaticosComponent, DialogNeumaticosEditComponent, ImportadoraEgresosTabCuotasComponent, ImportadoraEgresosTabCuotaDialogComponent],
  imports: [
    CommonModule,
    ImportadoraRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
    FullCalendarModule
  ]
})
export class ImportadoraModule { }
