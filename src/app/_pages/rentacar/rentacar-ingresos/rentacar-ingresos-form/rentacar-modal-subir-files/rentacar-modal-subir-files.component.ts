import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { RentacarService } from './../../../rentacar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploader, } from 'ng2-file-upload';
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-rentacar-modal-subir-files',
  templateUrl: './rentacar-modal-subir-files.component.html',
  styleUrls: ['./rentacar-modal-subir-files.component.scss']
})
export class RentacarModalSubirFilesComponent implements OnInit {


  responses: string[] = [];
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  id_ingresoLicitacion: number = 0;

  ingresoLicitacion: any = {};



  constructor(public dialogRef: MatDialogRef<DialogRespaldosComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private rentacarService: RentacarService, private alert: AlertHelper, private snackBar: MatSnackBar,) {
    this.ingresoLicitacion = data.ingresoLicitacion;

    this.uploader = new FileUploader({
      headers: [{ name: 'usertoken', value: environment.usertoken }],
      url: `${environment.apiRentacarUrl}licitacion/subirRespaldo`,
      itemAlias: 'respaldo',
    });


    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (!response) {
        this.alert.errorAlert('tenemos problemas para procesar su solicitud, favor contactar equipo de desarrollo');
        this.snackBar.open(`tenemos problemas para procesar su solicitud, favor contactar equipo de desarrollo`, 'cerrar', {
          duration: 5000,
        });
      } else {
        this.responses.push(response);
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


  guardarIngreso(): void {
    this.alert.loadingAlert();
    this.rentacarService.postIngresoLicitacion(this.ingresoLicitacion).subscribe((response) => {
      this.id_ingresoLicitacion = response.data.id_ingresoLicitacion;

      this.uploader.setOptions({
        additionalParameter: {
          usertAt: this.ingresoLicitacion.userAt,
          id_ingresoLicitacion: this.id_ingresoLicitacion,
        },
      })
      this.uploader.uploadAll();
    })
  };



}
