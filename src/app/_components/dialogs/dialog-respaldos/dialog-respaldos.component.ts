import { environment } from '@environments/environment';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
export interface DialogData {
  url: any;

}
// ! TODO recordar importae FileLoadModule.

@Component({
  selector: 'app-dialog-respaldos',
  templateUrl: './dialog-respaldos.component.html',
  styleUrls: ['./dialog-respaldos.component.scss']
})
export class DialogRespaldosComponent implements OnInit {
  responses: string[] = [];
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  constructor(
    private alert: AlertHelper,
    public dialogRef: MatDialogRef<DialogRespaldosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
  ) {
    //IMPORTANTE: en la api Rest proteger ruta de los upload!! estan espuestas!!! 
    this.uploader = new FileUploader({
      headers: [{ name: 'authorization', value: localStorage.getItem('usertoken') + '' }],
      url: `${environment.apiUrl}/${this.data.url}`,
      itemAlias: 'photo',
    });
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (!response) {
        this.alert.errorAlert('tenemos problemas para procesar su solicitud, favor contactar equipo de desarrollo');
        this.snackBar.open(`tenemos problemas para procesar su solicitud, favor contactar equipo de desarrollo`, 'cerrar', {
          duration: 5000,
        });
      } else {
        this.responses.push(response);
        this.snackBar.open(`Registro Exitoso: ${response}`, 'cerrar', {
          duration: 5000,
        });
      }

    };
    this.uploader.onCompleteAll = () => {
      // ? la funcion envia al origen de la llamada la data
      // ? luego se debe subscribir a la data
      // ? metodo Mediante el metodo afterClose() del dialogComponent;
      this.dialogRef.close(this.responses);
    };

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  ngOnInit(): void {
  }

  subirFiles() {
    this.alert.loadingAlert();
    this.uploader.uploadAll()
  }

}
