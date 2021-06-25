import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgroFirmaEgresosComponent } from './agro-firma-egresos/agro-firma-egresos.component';
import { AgroFirmaHomeComponent } from './agro-firma-home/agro-firma-home.component';
import { AgroFirmaIngresosComponent } from './agro-firma-ingresos/agro-firma-ingresos.component';
import { AgroFirmaEgresosFormComponent } from './agro-firma-egresos/agro-firma-egresos-form/agro-firma-egresos-form.component';
import { AgroFirmaEgresosListComponent } from './agro-firma-egresos/agro-firma-egresos-list/agro-firma-egresos-list.component';


const routes: Routes = [
  { path: '', component: AgroFirmaHomeComponent },
  { path: 'ingresos', component: AgroFirmaIngresosComponent },
  { path: 'egresos', component: AgroFirmaEgresosComponent,
  children: [
    {
      path: '',
      component: AgroFirmaEgresosComponent,
      children: [
        { path: 'add/:idProyecto', component: AgroFirmaEgresosFormComponent },
        { path: 'list/:idProyecto', component: AgroFirmaEgresosListComponent },
      ],
    },
  ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgroFirmaRoutingModule { }
