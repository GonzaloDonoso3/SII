import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './_components/auth/auth.component';
import { HomeMainComponent } from './_components/home-main/home-main.component';
import { AuthGuard } from './_helpers/auth.guard';

// * Modules Imported for Route Main components
const hostalModule = () => import('./_pages/hostal/hostal.module').then((x) => x.HostalModule);
const lubricentroModule = () => import('./_pages/lubricentro/lubricentro.module').then(x => x.LubricentroModule);
const inmobiliariaModule = () => import('./_pages/inmobiliaria/inmobiliaria.module').then((x) => x.InmobiliariaModule);
const rentacarModule = () => import('./_pages/rentacar/rentacar.module').then((x) => x.RentacarModule);
const agroFirmaModule = () => import('./_pages/agroFirma/agro-firma.module').then((x) => x.AgroFirmaModule);
const abogadosModule = () => import('./_pages/abogados/abogados.module').then((x) => x.AbogadosModule);

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: HomeMainComponent, },
  { path: 'auth/:token', component: AuthComponent },
  { path: 'hostal', canActivate: [AuthGuard], loadChildren: hostalModule },
  { path: 'lubricentro', canActivate: [AuthGuard], loadChildren: lubricentroModule },
  { path: 'inmobiliaria', canActivate: [AuthGuard], loadChildren: inmobiliariaModule },
  { path: 'rentacar', canActivate: [AuthGuard], loadChildren: rentacarModule },
  { path: 'agrofirma', canActivate: [AuthGuard], loadChildren: agroFirmaModule },
  { path: 'firmaAbogado', canActivate: [AuthGuard], loadChildren: abogadosModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
