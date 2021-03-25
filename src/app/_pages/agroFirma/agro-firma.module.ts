import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgroFirmaEgresosComponent } from './agro-firma-egresos/agro-firma-egresos.component';
import { AgroFirmaIngresosComponent } from './agro-firma-ingresos/agro-firma-ingresos.component';
import { AgroFirmaHomeComponent } from './agro-firma-home/agro-firma-home.component';
import { AgroFirmaRoutingModule } from './agro-firma-routing.module';



@NgModule({
  declarations: [AgroFirmaEgresosComponent, AgroFirmaIngresosComponent, AgroFirmaHomeComponent],
  imports: [
    CommonModule,
    AgroFirmaRoutingModule
  ]
})
export class AgroFirmaModule { }
