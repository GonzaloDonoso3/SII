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
  displayedColumns: string[] = ['select', 'id', 'fecha', 'ingreso', 'dias', 'tipo', 'estado', 'sucursal', 'arriendo'];
  dataSource = new MatTableDataSource<ArriendoTabla>();
  selection = new SelectionModel<ArriendoTabla>(true, []);
  @ViewChild(MatPaginator) paginator = null;
  @ViewChild(MatSort) sort = null;

  //filtros
  rangoFechaFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  tipoFilter = new FormGroup({
    tipo: new FormControl(),
  });

  estadoFilter = new FormGroup({
    estado: new FormControl(),
  })

  sucursalFilter = new FormGroup({
    sucursal: new FormControl(),
  })



  constructor(private rentacarService: RentacarService, private alert: AlertHelper, public dialog: MatDialog) { }


  ngOnInit(): void {
    this.cargarListaPagosArriendos();
    this.filtrarFecha();
    this.filtrarTipo();
    this.filterEstado();
    this.filtrarSucursal()
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



  mostrarDetalleArriendo(arriendo: Arriendo) {
    this.dialog.open(RentacarModalDetallePagosComponent, {
      height: '80%',
      width: '80%',
      data: arriendo
    });
  }



  filtrarFecha(): void {
    this.rangoFechaFilter.valueChanges.subscribe(res => {
      if (res.start != null && res.end != null) {
        const rango = this.rangoFechaFilter.value;
        //filtro
        const dataFiltered = this.arriendosTabla.filter((data: ArriendoTabla) => data.fecha >= rango.start && data.fecha <= rango.end);
        this.realizarFiltro(dataFiltered)
      }
    });
  }

  filtrarTipo(): void {
    this.tipoFilter.valueChanges.subscribe(res => {
      let filterValue = res.tipo;
      const dataFiltered = this.arriendosTabla.filter((data: ArriendoTabla) => data.tipo == filterValue);
      this.realizarFiltro(dataFiltered)
    });
  }

  filterEstado() {
    this.estadoFilter.valueChanges.subscribe(res => {
      let filterValue = res.estado;
      const dataFiltered = this.arriendosTabla.filter((data: ArriendoTabla) => data.estado == filterValue);
      this.realizarFiltro(dataFiltered)
    });
  }

  filtrarSucursal(): void {
    this.sucursalFilter.valueChanges.subscribe(res => {
      let filterValue = res.sucursal;
      const dataFiltered = this.arriendosTabla.filter((data: ArriendoTabla) => data.sucursal == filterValue);
      this.realizarFiltro(dataFiltered)

      /* 
      this.dataSource.filterPredicate = (data: ArriendoTabla, filter: string) => data.sucursal.includes(filter);
      this.dataSource.filter = filterValue;
      this.dataSource.paginator = this.paginator; */
    });
  }


  realizarFiltro(dataFiltered: ArriendoTabla[]) {
    this.dataSource = new MatTableDataSource(dataFiltered);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  limpiarFiltros() {

    //reiniciar valores
    this.sucursalFilter.patchValue({ sucursal: '' })
    this.estadoFilter.patchValue({ estado: '' })
    this.tipoFilter.patchValue({ tipo: '' })
    this.rangoFechaFilter.patchValue({ start: null, end: null, })
    this.totalEsperadoSeleccion = 0;
    this.totalPagadoSeleccion = 0;

    this.dataSource = new MatTableDataSource(this.arriendosTabla);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

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

