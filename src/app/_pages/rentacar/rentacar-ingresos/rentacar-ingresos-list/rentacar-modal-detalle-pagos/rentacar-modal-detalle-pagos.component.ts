import { ArrayPagosClienteClass, ArrayPagosClientePago } from './../../../../../_models/rentacar/responseListaArriendos';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { Arriendo } from '@app/_models/rentacar/responseListaArriendos';




interface PagoCliente {
  monto: number;
  dias: number;
  estado: string;
  descripcion: string;
  fecha: Date;
}


@Component({
  selector: 'app-rentacar-modal-detalle-pagos',
  templateUrl: './rentacar-modal-detalle-pagos.component.html',
  styleUrls: ['./rentacar-modal-detalle-pagos.component.scss']
})
export class RentacarModalDetallePagosComponent implements OnInit {


  pagoClienteTabla: PagoCliente[] = [];
  pagosCliente = new MatTableDataSource<PagoCliente>();
  pagosClienteColumns: string[] = ['monto', 'dias', 'estado', 'descripcion', 'fecha'];
  panelOpenStatePagoCliente = false;

  pagosERemplazo = new MatTableDataSource<any>();
  pagosERemplazoColumns: string[] = ['id'];


  pagosDanio = new MatTableDataSource<any>();
  pagosDanioColumns: string[] = ['id'];


  pagosExtras = new MatTableDataSource<any>();
  pagosExtrasdColumns: string[] = ['id'];


  constructor(public dialogRef: MatDialogRef<RentacarModalDetallePagosComponent>, @Inject(MAT_DIALOG_DATA) public data: Arriendo) {
  }

  ngOnInit(): void {
    console.log(this.data.infoPagos);
    this.cargarPagosClientes(this.data.infoPagos.arrayPagosCliente);
  }


  cargarPagosClientes(pagosCliente: ArrayPagosClienteClass) {
    pagosCliente.pagos.forEach((pago: ArrayPagosClientePago) => {

      this.pagoClienteTabla.push({
        monto: pago.monto,
        dias: pago.dias,
        estado: pago.estado,
        descripcion: pago.descripcion ? pago.descripcion : 'sin descripcion',
        fecha: pago.updatedAt
      })
    })
    this.pagosCliente = new MatTableDataSource(this.pagoClienteTabla);
  }

}
