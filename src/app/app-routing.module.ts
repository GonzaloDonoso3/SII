import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeMainComponent } from './_components/home-main/home-main.component';

// * Modules Imported for Route Main components
const hostalModule = () => import('./_pages/hostal/hostal.module').then((x) => x.HostalModule);
const lubricentroModule = () => import('./_pages/lubricentro/lubricentro.module').then(x => x.LubricentroModule);
const inmobiliariaModule = () => import('./_pages/inmobiliaria/inmobiliaria.module').then((x) => x.InmobiliariaModule);
const rentacarModule = () => import('./_pages/rentacar/rentacar.module').then((x) => x.RentacarModule);
const agroFirmaModule = () => import('./_pages/agroFirma/agro-firma.module').then((x) => x.AgroFirmaModule);
const abogadosModule = () => import('./_pages/abogados/abogados.module').then((x) => x.AbogadosModule);

const routes: Routes = [
  { path: '', component: HomeMainComponent },
  { path: 'hostal', loadChildren: hostalModule },
  { path: 'lubricentro', loadChildren: lubricentroModule },
  { path: 'inmobiliaria', loadChildren: inmobiliariaModule },
  { path: 'rentacar', loadChildren: rentacarModule },
  { path: 'agrofirma', loadChildren: agroFirmaModule },
  { path: 'firmaAbogado', loadChildren: abogadosModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
