import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeMainComponent } from './_components/home-main/home-main.component';

// * Modules Imported for Route Main components
const hostalModule = () =>
  import('./_pages/hostal/hostal.module').then((x) => x.HostalModule);
const lubricentroModule = () =>
  import('./_pages/lubricentro/lubricentro.module').then(x => x.LubricentroModule);

const routes: Routes = [
  { path: '', component: HomeMainComponent },
  { path: 'hostal', loadChildren: hostalModule },
  { path: 'lubricentro', loadChildren: lubricentroModule },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
