import { InmobiliariaEgresosComponent } from './inmobiliaria-egresos/inmobiliaria-egresos.component';
import { InmobiliariaIngresosComponent } from './inmobiliaria-ingresos/inmobiliaria-ingresos.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InmobiliariaHomeComponent } from './inmobiliaria-home/inmobiliaria-home.component';

const routes: Routes = [
  { path: '', component: InmobiliariaHomeComponent },
  { path: 'ingresos', component: InmobiliariaIngresosComponent },
  { path: 'egresos', component: InmobiliariaEgresosComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InmobiliariaRoutingModule { }
