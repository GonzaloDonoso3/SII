import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturaEmpresasComponent } from './factura-empresas/factura-empresas.component';
import { FacturaHomeComponent } from './factura-home/factura-home.component';

const routes: Routes = [
  { path: '', component: FacturaHomeComponent },
  { path: 'factura', component: FacturaEmpresasComponent },    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaRoutingModule { }
