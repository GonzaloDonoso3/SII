import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './../../_components/components.module';
import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministracionUsuariosComponent } from './administracion-usuarios/administracion-usuarios.component';
import { AdministracionSucursalesComponent } from './administracion-sucursales/administracion-sucursales.component';
import { AdministracionEmpresasComponent } from './administracion-empresas/administracion-empresas.component';
import { AdministracionHomeComponent } from './administracion-home/administracion-home.component';
import { AdministracionRoutingModule } from './administracion-routing.module';
import { AdministracionSucursalesFormComponent } from './administracion-sucursales/administracion-sucursales-form/administracion-sucursales-form.component';
import { AdministracionSucursalesListComponent } from './administracion-sucursales/administracion-sucursales-list/administracion-sucursales-list.component';
import { DialogSucursalesEditarComponent } from './administracion-sucursales/administracion-sucursales-list/dialog-sucursales-editar/dialog-sucursales-editar.component';
import { AdministracionEmpresasFormComponent } from './administracion-empresas/administracion-empresas-form/administracion-empresas-form.component';
import { AdministracionEmpresasListComponent } from './administracion-empresas/administracion-empresas-list/administracion-empresas-list.component';
import { DialogEmpresasEditarComponent } from './administracion-empresas/administracion-empresas-list/dialog-empresas-editar/dialog-empresas-editar.component';
import { AdministracionUsuariosFormComponent } from './administracion-usuarios/administracion-usuarios-form/administracion-usuarios-form.component';
import { AdministracionUsuariosListComponent } from './administracion-usuarios/administracion-usuarios-list/administracion-usuarios-list.component';



@NgModule({
  declarations: [AdministracionUsuariosComponent, AdministracionSucursalesComponent, AdministracionEmpresasComponent, AdministracionHomeComponent, AdministracionSucursalesFormComponent, AdministracionSucursalesListComponent, DialogSucursalesEditarComponent, AdministracionEmpresasFormComponent, AdministracionEmpresasListComponent, DialogEmpresasEditarComponent, AdministracionUsuariosFormComponent, AdministracionUsuariosListComponent],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class AdministracionModule { }
