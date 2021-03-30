import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatCalendarView, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { IngresosHostal } from '@app/_models/hostal/ingresoHostal';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { HostalService } from '../../hostal.service';

@Component({
  selector: 'app-hostal-ingresos-list',
  templateUrl: './hostal-ingresos-list.component.html',
  styleUrls: ['./hostal-ingresos-list.component.scss']
})
export class HostalIngresosListComponent implements OnInit, OnChanges {
  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  // ? Inputs & Outputs
  @Input()
  refrescar = '';

  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'fecha',
    'monto',
    'estadoPago',
    'respaldos',
    'nDocumento',
    'cliente',
    'tipoIngreso',
    'sucursal',
    'usuario'
  ];
  dataSource: MatTableDataSource<IngresosHostal> = new MatTableDataSource();
  dataIngresos: IngresosHostal[] = [];

  changelog: string[] = [];
  rangoFecha = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),

  });
  sucursalFilter = new FormGroup({
    idSucursal: new FormControl(),
  });
  clienteFilter = new FormGroup({
    cliente: new FormControl(),
  });
  tipoIngresoFilter = new FormGroup({
    tipoIngreso: new FormControl(),
  });
  estadoPagoFilter = new FormGroup({
    estadoPago: new FormControl(),
    fixed: new FormControl(),
  });
  numeroDocumentoFilter = new FormGroup({
    nDocumento: new FormControl(),

  });
  sucursales: Sucursal[] = [];
  selection = new SelectionModel<IngresosHostal>(true, []);
  tiposIngresos: string[] = [];
  estadosPagos: string[] = [];
  totalSeleccion = 0;
  cuentasRegistradas: any[] = [];
  constructor(
    private hostalService: HostalService,
    public dialog: MatDialog,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService
  ) {

  }

  ngOnInit(): void {

    this.sucursales = this.sucursalService.sucursalListValue;
    this.tiposIngresos = this.hostalService.tiposIngresosListValue;
    this.estadosPagos = this.hostalService.estadosPagosListValue;
    this.rangoFecha.valueChanges.subscribe(res => {
      if (res.start != null && res.end != null) {
        const rango = this.rangoFecha.value;
        this.applyDateFilter(rango.start,
          rango.end);
      }
    });
    this.sucursalFilter.valueChanges.subscribe(res => {
      this.applySucursalFilter(res.idSucursal);
    });
    this.clienteFilter.valueChanges.subscribe(res => {
      this.applyClienteFilter(res.cliente);
    });
    this.tipoIngresoFilter.valueChanges.subscribe(res => {
      this.applyTipoIngresoFilter(res.tipoIngreso);
    });
    this.estadoPagoFilter.valueChanges.subscribe(res => {
      this.applyEstadoPagoFilter(res.estadoPago);
    });
    this.numeroDocumentoFilter.valueChanges.subscribe(res => {
      console.log('filtro');
      this.applyDocumentoFilter(res.nDocumento);
    });

  }

  // ? refresh when form is ready.

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName of Object.keys(changes)) {
      const change = changes[propName];
      const to = JSON.stringify(change.currentValue);
      const from = JSON.stringify(change.previousValue);
      const changeLog = `${propName}: changed from ${from} to ${to} `;
      this.changelog.push(changeLog);
      this.hostalService.ingresoGetAll().subscribe((ingresos: IngresosHostal[]) => {
        this.dataIngresos = ingresos.map(ingreso => {
          ingreso.sucursal = ingreso.Sucursal.razonSocial;
          ingreso.usuario = ingreso.Usuario.nombreUsuario;
          return ingreso;
        });
        this.dataSource = new MatTableDataSource(this.dataIngresos);
        this.dataSource.paginator = this.paginator.toArray()[0];

      });
    }
  }
  recuperarArchivos(listArchivos: any) {
    this.dialog.open(DialogDownloadsComponent, {

      data: { archivos: listArchivos, servicio: 'hostal-ingreso' },

    });
  }

  // ? selection rows
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => {
        this.selection.select(row);

      });
    console.log(this.selection.selected);
  }
  revelarTotal() {
    this.totalSeleccion = 0;
    console.log(this.selection.selected.length);
    this.selection.selected.forEach(data => {
      this.totalSeleccion += data.monto;
    });
  }

  // ? filters
  limpiarFiltros() {
    this.dataSource = new MatTableDataSource(this.dataIngresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyDateFilter(start: Date, end: Date) {
    if (!this.estadoPagoFilter.value.fixed) {
      const datafiltered = this.dataIngresos.map(data => {
        data.fecha = new Date(data.fecha);
        return data;
      }).filter(comp => comp.fecha >= start && comp.fecha <= end);

      this.dataSource = new MatTableDataSource(datafiltered);

      this.dataSource.paginator = this.paginator.toArray()[0];
    } else {
      this.dataSource.filterPredicate = (data: IngresosHostal, filter: string) => {
        const compare = new Date(data.fecha);
        const filterValue = filter.split(' ');
        const startValue = new Date(Number(filterValue[0]));
        const endValue = new Date(Number(filterValue[1]));



        return compare >= startValue && compare <= endValue;
      };
      const filteredDate = `${start.getTime()} ${end.getTime()}`;
      this.dataSource.filter = filteredDate;
      this.dataSource.paginator = this.paginator.toArray()[0];
    }

  }
  applySucursalFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: IngresosHostal, filter: string) => data.sucursal === filter;
    this.dataSource.filter = filterValue;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  applyClienteFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: IngresosHostal, filter: string) => data.cliente.startsWith(filter);
    this.dataSource.filter = filterValue;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  applyTipoIngresoFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: IngresosHostal, filter: string) => data.tipoIngreso.includes(filter);
    this.dataSource.filter = filterValue;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  applyEstadoPagoFilter(filterlimpiarFiltrosValue: string) {
    this.dataSource.filterPredicate = (data: IngresosHostal, filter: string) => data.estadoPago === filter;
    this.dataSource.filter = filterlimpiarFiltrosValue;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  applyDocumentoFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: IngresosHostal, filter: string) => {
      if (!data.nDocumento === null) {
        return data.nDocumento.startsWith(filter);
      } else {
        return data.nDocumento === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  fijarFiltro(e: MatCheckboxChange) {
    if (e.checked) {
      this.dataSource =
        new MatTableDataSource(
          this.dataIngresos
            .filter(data =>
              data.estadoPago === this.estadoPagoFilter.value.estadoPago
            ));
    }
    if (!e.checked) {
      this.dataSource =
        new MatTableDataSource(
          this.dataIngresos
        );
    }
  }
}
