import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrestamosHomeComponent } from './prestamos-home/prestamos-home.component';
import { PrestamosIngresosEgresosComponent } from './prestamos-ingresos-egresos/prestamos-ingresos-egresos.component';



const routes: Routes = [
  { path: '', component: PrestamosHomeComponent },
  { path: 'empresas', component: PrestamosIngresosEgresosComponent },    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestamosRoutingModule { }
