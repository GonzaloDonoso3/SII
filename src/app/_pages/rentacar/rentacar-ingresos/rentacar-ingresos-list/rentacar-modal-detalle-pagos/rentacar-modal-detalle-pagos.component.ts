import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { Arriendo } from '@app/_models/rentacar/responseListaArriendos';


@Component({
  selector: 'app-rentacar-modal-detalle-pagos',
  templateUrl: './rentacar-modal-detalle-pagos.component.html',
  styleUrls: ['./rentacar-modal-detalle-pagos.component.scss']
})
export class RentacarModalDetallePagosComponent implements OnInit {


  arrayPagosCliente: any;
  arrayPagosReemplazo: any;
  arrayPagosExtra: any;
  arrayPagosDanio: any;

  panelOpenState: boolean = false;

  montoTotal: number = 0;

  constructor(public dialogRef: MatDialogRef<RentacarModalDetallePagosComponent>, @Inject(MAT_DIALOG_DATA) public data: Arriendo) {

  }

  ngOnInit(): void {
    this.arrayPagosCliente = this.data.infoPagos.arrayPagosCliente;
    this.arrayPagosReemplazo = this.data.infoPagos.arrayPagosReemplazo;
    this.arrayPagosExtra = this.data.infoPagos.arrayPagosExtras;
    this.arrayPagosDanio = this.data.infoPagos.arrayPagosDanio;

    this.montoTotal = this.data.infoPagos.ingresoTotal;
  }

  descargarFile(url: string) {
    window.open(url);
  }


}
