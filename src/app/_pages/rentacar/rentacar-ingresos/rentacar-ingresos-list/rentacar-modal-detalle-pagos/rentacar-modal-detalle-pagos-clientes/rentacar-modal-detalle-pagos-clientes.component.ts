import { MatTableDataSource } from '@angular/material/table';
import { Comprobante, ArrayPagosClienteClass, ArrayPagosClientePago } from './../../../../../../_models/rentacar/responseListaArriendos';
import { Component, OnInit, Input } from '@angular/core';


interface PagoCliente {
  monto: number;
  dias: number;
  estado: string;
  descripcion: string;
  fecha: Date;
}


@Component({
  selector: 'app-rentacar-modal-detalle-pagos-clientes',
  templateUrl: './rentacar-modal-detalle-pagos-clientes.component.html',
  styleUrls: ['./rentacar-modal-detalle-pagos-clientes.component.scss']
})
export class RentacarModalDetallePagosClientesComponent implements OnInit {

  @Input() arrayPagosCliente: any;

  pagosTabla: PagoCliente[] = [];
  comprobantes: Comprobante[] = [];
  dataSource = new MatTableDataSource<PagoCliente>();
  displayedColumns: string[] = ['monto', 'dias', 'estado', 'descripcion', 'fecha'];
  panelOpenState: boolean = false;
  totalIngreso: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.cargarPagos(this.arrayPagosCliente);
  }


  cargarPagos(pagosCliente: ArrayPagosClienteClass): void {
    this.comprobantes = pagosCliente.comprobantes;
    this.totalIngreso = pagosCliente.montoTotal;
    pagosCliente.pagos.forEach((pago: ArrayPagosClientePago) => {
      this.pagosTabla.push({
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
