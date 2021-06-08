import { Comprobante, ArrayPagosDanioClass, ArrayPagosDanioPago } from './../../../../../../_models/rentacar/responseListaArriendos';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, Input } from '@angular/core';



interface PagoDanio {
  monto: number;
  estado: string;
  detalle: string;
  fecha: Date;
}

@Component({
  selector: 'app-rentacar-modal-detalle-pagos-danios',
  templateUrl: './rentacar-modal-detalle-pagos-danios.component.html',
  styleUrls: ['./rentacar-modal-detalle-pagos-danios.component.scss']
})
export class RentacarModalDetallePagosDaniosComponent implements OnInit {

  @Input() arrayPagosDanio: any;

  pagosTabla: PagoDanio[] = [];
  comprobantes: Comprobante[] = [];
  dataSource = new MatTableDataSource<PagoDanio>();
  displayedColumns: string[] = ['monto', 'estado', 'detalle', 'fecha'];
  panelOpenState: boolean = false;
  totalIngreso: number = 0;

  constructor() { }


  ngOnInit(): void {
    this.cargarPagos(this.arrayPagosDanio);
  }


  cargarPagos(pagosDanio: ArrayPagosDanioClass): void {
    this.comprobantes = pagosDanio.comprobantes;
    this.totalIngreso = pagosDanio.montoTotal;
    pagosDanio.pagos.forEach((pago: ArrayPagosDanioPago) => {
      this.pagosTabla.push({
        monto: pago.monto,
        estado: pago.estado ? pago.estado : 'PAGADO',
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
