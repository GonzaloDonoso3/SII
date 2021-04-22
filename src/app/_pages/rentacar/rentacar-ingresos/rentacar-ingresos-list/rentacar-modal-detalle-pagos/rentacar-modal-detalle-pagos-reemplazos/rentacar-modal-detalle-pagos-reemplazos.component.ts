import { MatTableDataSource } from '@angular/material/table';
import { Comprobante, ArrayPagosClienteClass, ArrayPagosClientePago } from './../../../../../../_models/rentacar/responseListaArriendos';
import { Component, OnInit, Input } from '@angular/core';


interface PagoReemplazo {
  deudor: string;
  monto: number;
  dias: number;
  estado: string;
  descripcion: string;
  fecha: Date;
}


@Component({
  selector: 'app-rentacar-modal-detalle-pagos-reemplazos',
  templateUrl: './rentacar-modal-detalle-pagos-reemplazos.component.html',
  styleUrls: ['./rentacar-modal-detalle-pagos-reemplazos.component.scss']
})
export class RentacarModalDetallePagosReemplazosComponent implements OnInit {

  @Input() arrayPagosReemplazo: any;

  pagosTabla: PagoReemplazo[] = [];
  comprobantes: Comprobante[] = [];
  dataSource = new MatTableDataSource<PagoReemplazo>();
  displayedColumns: string[] = ['monto', 'dias', 'estado', 'deudor', 'descripcion', 'fecha'];
  panelOpenState: boolean = false;
  totalIngreso: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.cargarPagos(this.arrayPagosReemplazo);
  }

  cargarPagos(pagosReemplazo: ArrayPagosClienteClass): void {
    this.comprobantes = pagosReemplazo.comprobantes;
    this.totalIngreso = pagosReemplazo.montoTotal;
    pagosReemplazo.pagos.forEach((pago: ArrayPagosClientePago) => {
      this.pagosTabla.push({
        deudor: pago.deudor,
        monto: pago.monto,
        dias: pago.dias,
        estado: pago.estado,
        descripcion: pago.descripcion ? pago.descripcion : 'sin descripcion',
        fecha: pago.updatedAt
      })
    })
    this.dataSource = new MatTableDataSource(this.pagosTabla);
  }



  descargarFile(url: string) {
    window.open(url);
  }



}
