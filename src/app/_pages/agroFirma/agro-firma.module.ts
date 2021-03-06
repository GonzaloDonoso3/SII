import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './../../_components/components.module';
import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgroFirmaEgresosComponent } from './agro-firma-egresos/agro-firma-egresos.component';
import { AgroFirmaIngresosComponent } from './agro-firma-ingresos/agro-firma-ingresos.component';
import { AgroFirmaHomeComponent } from './agro-firma-home/agro-firma-home.component';
import { AgroFirmaRoutingModule } from './agro-firma-routing.module';
import { AgroFirmaEgresosFormComponent } from './agro-firma-egresos/agro-firma-egresos-form/agro-firma-egresos-form.component';
import { HttpClientModule } from '@angular/common/http';
import { AgroFirmaEgresosListComponent } from './agro-firma-egresos/agro-firma-egresos-list/agro-firma-egresos-list.component';
import { ModalModule } from '@app/_components/_modal';
import { AgroFirmaIngresosFormComponent } from './agro-firma-ingresos/agro-firma-ingresos-form/agro-firma-ingresos-form.component';
import { AgroFirmaIngresosListComponent } from './agro-firma-ingresos/agro-firma-ingresos-list/agro-firma-ingresos-list.component';
import { AgroFirmaProyectosComponent } from './agro-firma-proyectos/agro-firma-proyectos.component';
import { AgroFirmaProyectosFormComponent } from './agro-firma-proyectos/agro-firma-proyectos-form/agro-firma-proyectos-form.component';
import { CreateBankAccountFormComponent } from './agro-firma-ingresos/create-bank-account-form/create-bank-account-form.component';
import { BankAccountListComponent } from './agro-firma-ingresos/bank-account-list/bank-account-list.component';
import { AgroFirmaEgresosCuotasComponent } from './agro-firma-egresos/agro-firma-egresos-list/agro-firma-egresos-cuotas/agro-firma-egresos-cuotas.component';
import { AgroFirmaEgresosCuotaDialogComponent } from './agro-firma-egresos/agro-firma-egresos-list/agro-firma-egresos-cuotas/agro-firma-egresos-cuota-dialog/agro-firma-egresos-cuota-dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [
    AgroFirmaEgresosComponent, 
    AgroFirmaIngresosComponent, 
    AgroFirmaHomeComponent,
    AgroFirmaEgresosFormComponent,
    AgroFirmaEgresosListComponent,
    AgroFirmaIngresosFormComponent,
    AgroFirmaIngresosListComponent,
    AgroFirmaProyectosComponent,
    AgroFirmaProyectosFormComponent,
    CreateBankAccountFormComponent,
    BankAccountListComponent,
    AgroFirmaEgresosCuotasComponent,
    AgroFirmaEgresosCuotaDialogComponent,
    ],
  imports: [
    HttpClientModule,
    CommonModule,
    AgroFirmaRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
    ModalModule,
    FullCalendarModule
  ],
  exports: [
    AgroFirmaEgresosFormComponent,
    AgroFirmaIngresosFormComponent    
  ]
})
export class AgroFirmaModule { }
