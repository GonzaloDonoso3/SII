import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgroFirmaEgresosComponent } from './agro-firma-egresos/agro-firma-egresos.component';
import { AgroFirmaHomeComponent } from './agro-firma-home/agro-firma-home.component';
import { AgroFirmaIngresosComponent } from './agro-firma-ingresos/agro-firma-ingresos.component';


const routes: Routes = [
  { path: '', component: AgroFirmaHomeComponent },
  { path: 'ingresos', component: AgroFirmaIngresosComponent },
  { path: 'egresos', component: AgroFirmaEgresosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgroFirmaRoutingModule { }
