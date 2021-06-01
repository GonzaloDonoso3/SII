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




@NgModule({
  declarations: [
    AgroFirmaEgresosComponent, 
    AgroFirmaIngresosComponent, 
    AgroFirmaHomeComponent, AgroFirmaEgresosFormComponent, AgroFirmaEgresosListComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    AgroFirmaRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
    ModalModule,
  ]
})
export class AgroFirmaModule { }
