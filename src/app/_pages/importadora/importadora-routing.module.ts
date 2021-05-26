import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportadoraHomeComponent } from './importadora-home/importadora-home.component';
import { ImportadoraEgresosComponent } from './importadora-egresos/importadora-egresos.component';
import { ImportadoraIngresosComponent } from './importadora-ingresos/importadora-ingresos.component';



const routes: Routes = [
    { path: '', component: ImportadoraHomeComponent },
    { path: 'ingresos', component: ImportadoraIngresosComponent},
    { path: 'egresos', component: ImportadoraEgresosComponent}
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ImportadoraRoutingModule { }