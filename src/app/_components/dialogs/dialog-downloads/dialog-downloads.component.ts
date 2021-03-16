import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HostalService } from '@app/_pages/hostal/hostal.service';
import { LubricentroService } from '@app/_pages/lubricentro/lubricentro.service';

export interface DialogData {
  archivos: any[];
  servicio: string;

}
@Component({
  selector: 'app-dialog-downloads',
  templateUrl: './dialog-downloads.component.html',
  styleUrls: ['./dialog-downloads.component.scss']
})
export class DialogDownloadsComponent implements OnInit {
  archivos: any[];
  constructor(
    public dialogRef: MatDialogRef<DialogDownloadsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private hostalService: HostalService,
    private lubricentroService: LubricentroService,
  ) {
    this.archivos = this.data.archivos;
  }
  descargar(url: string) {
    switch (this.data.servicio) {
      case 'hostal-ingreso':
        this.hostalService.ingresoGetFiles(url);
        break;
      case 'hostal-egreso':
        this.hostalService.egresoGetFiles(url);
        break;
      case 'lubricentro-egreso':
        this.lubricentroService.egresoGetFiles(url);
        break;
      default:
        break;
    }

  }
  ngOnInit(): void {
  }

}

