import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { EmpresasComponent } from '../empresas/empresas.component';
import { SucursalesComponent } from '../sucursales/sucursales.component';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { RolesComponent } from '../roles/roles.component';


@NgModule({
  declarations: [EmpresasComponent, SucursalesComponent, UsuariosComponent, RolesComponent],
  imports: [
    CommonModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
