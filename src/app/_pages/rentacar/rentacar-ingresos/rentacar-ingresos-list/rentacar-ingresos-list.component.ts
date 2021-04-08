import { FormGroup, FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RentacarService } from './../../rentacar.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { ResponseListaArriendos, Arriendo } from '@app/_models/rentacar/responseListaArriendos';
import { MatDialog } from '@angular/material/dialog'
import { RentacarModalDetallePagosComponent } from './rentacar-modal-detalle-pagos/rentacar-modal-detalle-pagos.component';

interface ArriendoTabla {
  id: number;
  fecha: Date;
  ingreso: number;
  tipo: string;
  estado: string;
  dias: number;
  sucursal: string;
  patente: string;
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
  displayedColumns: string[] = ['select', 'id', 'fecha', 'ingreso', 'patente', 'dias', 'tipo', 'estado', 'sucursal', 'arriendo'];
  dataSource = new MatTableDataSource<ArriendoTabla>();
  selection = new SelectionModel<ArriendoTabla>(true, []);
  @ViewChild(MatPaginator) paginator = null;
  @ViewChild(MatSort) sort = null;

  //filtros
  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    tipo: new FormControl(),
    estado: new FormControl(),
    sucursal: new FormControl(),
    patente: new FormControl()
  })

  constructor(private rentacarService: RentacarService, private alert: AlertHelper, public dialog: MatDialog) { }


  ngOnInit(): void {
    this.cargarListaPagosArriendos();
    this.aplicarfiltros();
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
        fecha: new Date(arriendo.infoArriendo.fechaDespacho),
        ingreso: arriendo.infoPagos.ingresoTotal,
        patente: arriendo.infoVehiculo.patente,
        tipo: arriendo.infoArriendo.tipo,
        estado: arriendo.infoArriendo.estado,
        dias: arriendo.infoArriendo.diasTotales,
        sucursal: arriendo.infoArriendo.sucursalResponsable,
        arriendo: arriendo
      });

    });
    this.dataSource = new MatTableDataSource(this.arriendosTabla);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }



  mostrarModalDetalleArriendo(arriendo: Arriendo) {
    this.dialog.open(RentacarModalDetallePagosComponent, {
      height: '80%',
      width: '80%',
      data: arriendo
    });
  }


  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {

      let dataFiltered = this.arriendosTabla;

      if (res.patente) {
        dataFiltered = dataFiltered.filter((data: ArriendoTabla) => data.patente.includes(res.patente));
      }

      if (res.sucursal) {
        dataFiltered = dataFiltered.filter((data: ArriendoTabla) => data.sucursal == res.sucursal);
      }

      if (res.tipo) {
        dataFiltered = dataFiltered.filter((data: ArriendoTabla) => data.tipo == res.tipo);
      }

      if (res.estado) {
        dataFiltered = dataFiltered.filter((data: ArriendoTabla) => data.estado == res.estado);
      }

      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: ArriendoTabla) => data.fecha >= res.start && data.fecha <= res.end);
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.selection.clear();
      this.totalEsperadoSeleccion = 0;
      this.totalPagadoSeleccion = 0;
    })
  }



  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, patente: null, sucursal: null, tipo: null, estado: null })

    this.dataSource = new MatTableDataSource(this.arriendosTabla);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selection.clear()
    this.totalPagadoSeleccion = 0;
    this.totalEsperadoSeleccion = 0;
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
    console.log(this.selection.selected.length);
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

