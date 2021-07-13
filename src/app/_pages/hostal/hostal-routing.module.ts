import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostalEgresosComponent } from './hostal-egresos/hostal-egresos.component';

import { HostalHomeComponent } from './hostal-home/hostal-home.component';
import { HostalIngresosComponent } from './hostal-ingresos/hostal-ingresos.component';
import { HostalConsolidadosComponent } from './hostal-consolidados/hostal-consolidados.component';



const routes: Routes = [
  { path: '', component: HostalHomeComponent },
  { path: 'ingresos', component: HostalIngresosComponent },
  { path: 'egresos', component: HostalEgresosComponent },
  { path: 'consolidados', component: HostalConsolidadosComponent },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostalRoutingModule { }
