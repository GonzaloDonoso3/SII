import { MatTableDataSource } from '@angular/material/table';
import { Comprobante, ArrayPagosDanioClass, ArrayPagosDanioPago } from './../../../../../../_models/rentacar/responseListaArriendos';
import { Component, Input, OnInit } from '@angular/core';


interface PagoExtra {
  monto: number;
  estado: string;
  detalle: string;
  fecha: Date;
}


@Component({
  selector: 'app-rentacar-modal-detalle-pagos-extras',
  templateUrl: './rentacar-modal-detalle-pagos-extras.component.html',
  styleUrls: ['./rentacar-modal-detalle-pagos-extras.component.scss']
})
export class RentacarModalDetallePagosExtrasComponent implements OnInit {

  @Input() arrayPagosExtra: any;


  pagosTabla: PagoExtra[] = [];
  comprobantes: Comprobante[] = [];
  dataSource = new MatTableDataSource<PagoExtra>();
  displayedColumns: string[] = ['monto', 'estado', 'detalle', 'fecha'];
  panelOpenState: boolean = false;
  totalIngreso: number = 0;


  constructor() { }

  ngOnInit(): void {
    this.cargarPagos(this.arrayPagosExtra);
  }

  cargarPagos(pagosExtra: ArrayPagosDanioClass): void {
    this.comprobantes = pagosExtra.comprobantes;
    this.totalIngreso = pagosExtra.montoTotal;
    pagosExtra.pagos.forEach((pago: ArrayPagosDanioPago) => {
      this.pagosTabla.push({
        monto: pago.monto,
        estado: pago.estado ? pago.estado : '',
        detalle: pago.detalle,
        fecha: pago.updatedAt
      })
    })
    this.dataSource = new MatTableDataSource(this.pagosTabla);
  }

  descargarFile(url: string) {
    window.open(url);
  }



}
