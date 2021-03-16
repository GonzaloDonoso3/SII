import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LubricentroEgresosComponent } from './lubricentro-egresos/lubricentro-egresos.component';
import { LubricentroHomeComponent } from './lubricentro-home/lubricentro-home.component';
import { LubricentroIngresosComponent } from './lubricentro-ingresos/lubricentro-ingresos.component';

const routes: Routes = [
  { path: '', component: LubricentroHomeComponent },
  { path: 'ingresos', component: LubricentroIngresosComponent },
  { path: 'egresos', component: LubricentroEgresosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LubricentroRoutingModule { }
