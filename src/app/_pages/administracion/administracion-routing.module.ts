import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministracionHomeComponent } from './administracion-home/administracion-home.component';
import { AdministracionEmpresasComponent } from './administracion-empresas/administracion-empresas.component';
import { AdministracionSucursalesComponent } from './administracion-sucursales/administracion-sucursales.component';
import { AdministracionUsuariosComponent } from './administracion-usuarios/administracion-usuarios.component';


const routes: Routes = [
    { path: '', component: AdministracionHomeComponent },
    { path: 'empresas', component: AdministracionEmpresasComponent },
    { path: 'sucursales', component: AdministracionSucursalesComponent },
    { path: 'usuarios', component: AdministracionUsuariosComponent }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AdministracionRoutingModule { }