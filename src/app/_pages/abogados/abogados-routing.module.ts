import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbogadosEgresosComponent } from './abogados-egresos/abogados-egresos.component';
import { AbogadosHomeComponent } from './abogados-home/abogados-home.component';
import { AbogadosIngresosComponent } from './abogados-ingresos/abogados-ingresos.component';



const routes: Routes = [
  { path: '', component: AbogadosHomeComponent },
  { path: 'ingresos', component: AbogadosIngresosComponent },
  { path: 'egresos', component: AbogadosEgresosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbogadosRoutingModule { }
