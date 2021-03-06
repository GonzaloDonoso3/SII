import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FacturaRoutingModule } from './factura-module-routing.module';
import { FacturaEmpresasComponent } from './factura-empresas/factura-empresas.component';
import { FacturaHomeComponent } from './factura-home/factura-home.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/material.module';
import { ComponentsModule } from 'src/app/_components/components.module';
import { FormularioCargaDTEComponent } from './formulario-carga-dte/formulario-carga-dte.component';

@NgModule({
  declarations: [FacturaEmpresasComponent, FacturaHomeComponent, FormularioCargaDTEComponent],
  imports: [
    CommonModule,
    FacturaRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,        
    MaterialModule,
    ComponentsModule,    
  ]
})
export class FacturaModule { }
