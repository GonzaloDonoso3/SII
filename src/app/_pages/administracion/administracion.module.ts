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



@NgModule({
  declarations: [AdministracionUsuariosComponent, AdministracionSucursalesComponent, AdministracionEmpresasComponent, AdministracionHomeComponent, AdministracionSucursalesFormComponent, AdministracionSucursalesListComponent],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class AdministracionModule { }
