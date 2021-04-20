import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RentacarService } from './../../../rentacar.service';
import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-rentacar-modal-ver-files',
  templateUrl: './rentacar-modal-ver-files.component.html',
  styleUrls: ['./rentacar-modal-ver-files.component.scss']
})
export class RentacarModalVerFilesComponent implements OnInit {

  archivos: any[];


  constructor(public dialogRef: MatDialogRef<RentacarModalVerFilesComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private rentacarService: RentacarService,) {
    this.archivos = this.data.archivos;
  }

  ngOnInit(): void {
  }

  descargar(name: string) {
    window.open(`${environment.pathApiRent}` + name);
  }


}
