import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgroFirmaEgresosComponent } from './agro-firma-egresos/agro-firma-egresos.component';
import { AgroFirmaHomeComponent } from './agro-firma-home/agro-firma-home.component';
import { AgroFirmaIngresosComponent } from './agro-firma-ingresos/agro-firma-ingresos.component';
import { AgroFirmaEgresosFormComponent } from './agro-firma-egresos/agro-firma-egresos-form/agro-firma-egresos-form.component';
import { AgroFirmaEgresosListComponent } from './agro-firma-egresos/agro-firma-egresos-list/agro-firma-egresos-list.component';
import { AgroFirmaIngresosFormComponent } from './agro-firma-ingresos/agro-firma-ingresos-form/agro-firma-ingresos-form.component';
import { AgroFirmaIngresosListComponent } from './agro-firma-ingresos/agro-firma-ingresos-list/agro-firma-ingresos-list.component';
import { AgroFirmaProyectosComponent } from './agro-firma-proyectos/agro-firma-proyectos.component';


const routes: Routes = [
  { path: '', component: AgroFirmaHomeComponent },
  { path: 'ingresos', component: AgroFirmaIngresosComponent,
  children: [
    { path: 'add/:idProyecto', component: AgroFirmaIngresosFormComponent },
    { path: 'list/:idProyecto', component: AgroFirmaIngresosListComponent }
  ] },
  { path: 'egresos', component: AgroFirmaEgresosComponent,
  children: [
    {
      path: '',
      component: AgroFirmaEgresosComponent,
      children: [
        { path: 'add/:idProyecto', component: AgroFirmaEgresosFormComponent },
        { path: 'list/:idProyecto', component: AgroFirmaEgresosListComponent }
      ],
    }
  ],
  },
  { path: 'proyectos', component: AgroFirmaProyectosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgroFirmaRoutingModule { }
