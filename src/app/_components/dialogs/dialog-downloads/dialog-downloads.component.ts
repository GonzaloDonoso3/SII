import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HostalService } from '@app/_pages/hostal/hostal.service';
import { LubricentroService } from '@app/_pages/lubricentro/lubricentro.service';
import { InmobiliariaService } from '@app/_pages/inmobiliaria/inmobiliaria.service';
import { RentacarService } from '@app/_pages/rentacar/rentacar.service';
import { ImportadoraService } from '@app/_pages/importadora/importadora.service';


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
    private inmobiliariaService: InmobiliariaService,
    private rentacarService: RentacarService,
    private importadoraService: ImportadoraService,
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
      case 'lubricentro-ingreso':
        this.lubricentroService.ingresoGetFiles(url);
        break;
        case 'inmobiliaria-ingreso':
        this.inmobiliariaService.ingresoGetFiles(url);
        break;
        case 'inmobiliaria-egreso':
        this.inmobiliariaService.egresoGetFiles(url);
        break;
        case 'rentacar-egreso':
        this.rentacarService.egresoGetFiles(url);
        break;
        case 'importadora-ingreso':
        this.importadoraService.ingresoGetFiles(url);
        break;
        case 'importadora-egresoFijo':
        this.importadoraService.egresoFijoGetFiles(url);
        break;
        case 'importadora-egresoConteiner':
          this.importadoraService.egresoConteinerGetFiles(url);
          break;
      default:
        break;
    }

  }
  ngOnInit(): void {
  }

}

