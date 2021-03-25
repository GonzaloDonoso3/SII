import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentacarEgresosComponent } from './rentacar-egresos/rentacar-egresos.component';
import { RentacarHomeComponent } from './rentacar-home/rentacar-home.component';
import { RentacarIngresosComponent } from './rentacar-ingresos/rentacar-ingresos.component';

const routes: Routes = [
  { path: '', component: RentacarHomeComponent },
  { path: 'ingresos', component: RentacarIngresosComponent },
  { path: 'egresos', component: RentacarEgresosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentacarRoutingModule { }
