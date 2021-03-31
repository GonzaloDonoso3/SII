import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RentacarService } from './../../rentacar.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { ResponseListaArriendos, Arriendo } from '@app/_models/rentacar/responseListaArriendos';

interface ArriendoTabla {
  id: number;
  fecha: string;
  ingreso: number;
  tipo: string;
  estado: string;
  dias: number;
  sucursal: string;
  arriendo: Arriendo
}


@Component({
  selector: 'app-rentacar-ingresos-list',
  templateUrl: './rentacar-ingresos-list.component.html',
  styleUrls: ['./rentacar-ingresos-list.component.scss']
})
export class RentacarIngresosListComponent implements OnInit {

  arriendosTabla: ArriendoTabla[] = [];
  totalEsperadoSeleccion: number = 0;
  totalPagadoSeleccion: number = 0;

  //configuraciones tabla
  displayedColumns: string[] = ['select', 'id', 'fecha', 'ingreso', 'tipo', 'estado', 'dias', 'sucursal', 'arriendo'];
  dataSource = new MatTableDataSource<ArriendoTabla>();
  @ViewChild(MatPaginator) paginator = null;
  @ViewChild(MatSort) sort = null;



  selection = new SelectionModel<ArriendoTabla>(true, []);



  constructor(private rentacarService: RentacarService, private alert: AlertHelper) { }


  ngOnInit(): void {
    this.cargarListaPagosArriendos();
  }


  cargarListaPagosArriendos(): void {
    this.rentacarService.getListaPagosArriendos().subscribe((response: ResponseListaArriendos) => {
      if (response.success) {
        this.cargarArriendosEnTabla(response.data);
      } else {
        this.alert.errorAlert('Error al cargar los pagos , intente nuevamente');
      }
    })
  }


  cargarArriendosEnTabla(listArriendo: Arriendo[]): void {
    listArriendo.forEach(arriendo => {
      this.arriendosTabla.push({
        id: arriendo.infoArriendo.numeroArriendo,
        fecha: arriendo.infoArriendo.fechaDespacho,
        ingreso: arriendo.infoPagos.ingresoTotal,
        tipo: arriendo.infoArriendo.tipo,
        estado: arriendo.infoArriendo.estado,
        dias: arriendo.infoArriendo.diasTotales,
        sucursal: arriendo.infoArriendo.sucursalResponsable,
        arriendo: arriendo
      })
    });
    this.dataSource = new MatTableDataSource(this.arriendosTabla);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  mostrarDetalleArriendo(arriendo: Arriendo) {
    console.log(arriendo);
  }



  limpiarFiltros() {

  }

  revelarTotal() {
    let ingresoEsperado = 0;
    let ingresoPagado = 0;
    this.selection.selected.forEach((arriendosTabla: ArriendoTabla) => {
      ingresoEsperado = ingresoEsperado + arriendosTabla.ingreso;

      arriendosTabla.arriendo.infoPagos.arrayPagosCliente.pagos.forEach((pago) => {
        if (pago.estado === 'PAGADO') {
          ingresoPagado = ingresoPagado + pago.monto;
        }
      })

      arriendosTabla.arriendo.infoPagos.arrayPagosReemplazo.pagos.forEach((pago) => {
        if (pago.estado === 'PAGADO') {
          ingresoPagado = ingresoPagado + pago.monto;
        }
      })

      arriendosTabla.arriendo.infoPagos.arrayPagosDanio.pagos.forEach((pago) => {
        if (pago.estado === 'PAGADO') {
          ingresoPagado = ingresoPagado + pago.monto;
        }
      })

      arriendosTabla.arriendo.infoPagos.arrayPagosExtras.pagos.forEach((pago) => {
        if (pago.estado === 'PAGADO') {
          ingresoPagado = ingresoPagado + pago.monto;
        }
      })


    })

    this.totalEsperadoSeleccion = ingresoEsperado;
    this.totalPagadoSeleccion = ingresoPagado;

  }





  /** Selects all rows if they are not all selected; otherwise clear selection. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.totalEsperadoSeleccion = 0;
    this.totalPagadoSeleccion = 0;
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

}

