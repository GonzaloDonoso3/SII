import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { DialogRespaldosComponent } from './dialogs/dialog-respaldos/dialog-respaldos.component';
import { FileUploadModule } from 'ng2-file-upload';
import { TableComponent } from './tables/table/table.component';
import { DialogDownloadsComponent } from './dialogs/dialog-downloads/dialog-downloads.component';
import { AuthComponent } from './auth/auth.component';





@NgModule({
  declarations: [FormComponent, DialogRespaldosComponent, TableComponent, DialogDownloadsComponent, AuthComponent,],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FileUploadModule,


  ],
  exports: [
    ReactiveFormsModule,
    FormComponent,
    DialogRespaldosComponent,
    FileUploadModule,
    TableComponent


  ]
})
export class ComponentsModule { }
