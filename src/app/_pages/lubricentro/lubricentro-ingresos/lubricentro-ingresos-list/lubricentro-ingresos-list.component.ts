import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { IngresosLubricentro } from '@app/_models/lubricentro/ingresoLubricentro';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { LubricentroService } from '../../lubricentro.service';
@Component({
  selector: 'app-lubricentro-ingresos-list',
  templateUrl: './lubricentro-ingresos-list.component.html',
  styleUrls: ['./lubricentro-ingresos-list.component.scss']
})
export class LubricentroIngresosListComponent implements OnInit, OnChanges {
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
    'sucursal',
    'respaldos',
    'tipoIngreso',
    'usuario'
  ];
  dataSource: MatTableDataSource<IngresosLubricentro> = new MatTableDataSource();
  dataIngresos: IngresosLubricentro[] = [];

  changelog: string[] = [];
  rangoFecha = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),

  });
  sucursalFilter = new FormGroup({
    idSucursal: new FormControl(),
  });
  tipoIngresoFilter = new FormGroup({
    tipoIngreso: new FormControl(),
  });
  estadoPagoFilter = new FormGroup({
    estadoPago: new FormControl(),
    fixed: new FormControl(),
  });
  sucursales: Sucursal[] = [];
  selection = new SelectionModel<IngresosLubricentro>(true, []);
  tiposIngresos: string[] = [];
  totalSeleccion = 0;
  cuentasRegistradas: any[] = [];
  estadosPagos: string[] = [];
  constructor(
    private lubricentroService: LubricentroService,
    public dialog: MatDialog,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService
  ) {
    this.sucursales = this.sucursalService.sucursalListValue;
    this.tiposIngresos = this.lubricentroService.tiposIngresosListValue;
    this.estadosPagos = this.lubricentroService.estadosPagosListValue;
  }
  ngOnInit(): void {
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
    this.tipoIngresoFilter.valueChanges.subscribe(res => {
      this.applyTipoIngresoFilter(res.tipoIngreso);
    });
    this.estadoPagoFilter.valueChanges.subscribe(res => {
      this.applyEstadoPagoFilter(res.estadoPago);
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
      this.lubricentroService.ingresoGetAll().subscribe((data: IngresosLubricentro[]) => {
        this.dataIngresos = data.map((ingreso: IngresosLubricentro) => {
          ingreso.sucursal = ingreso.Sucursal.razonSocial;
          ingreso.usuario = ingreso.Usuario.nombreUsuario;
          return ingreso;
        });
        console.log(data);
        this.dataSource = new MatTableDataSource(this.dataIngresos);
        this.dataSource.paginator = this.paginator.toArray()[0];

      });
    }
  }
  recuperarArchivos(listArchivos: any) {
    this.dialog.open(DialogDownloadsComponent, {

      data: { archivos: listArchivos, servicio: 'lubricentro-ingreso' },

    });
  }

  // ? selection rows
  // *  INFO this.selection.selected : return array with all selected objects(rows) into table
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

    const dataFiltered = this.dataIngresos.map(data => {
      data.fecha = new Date(data.fecha);
      return data;
    }).filter(comp => comp.fecha >= start && comp.fecha <= end);

    this.dataSource = new MatTableDataSource(dataFiltered);

    this.dataSource.paginator = this.paginator.toArray()[0];


  }
  applySucursalFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: IngresosLubricentro, filter: string) => data.sucursal === filter;
    this.dataSource.filter = filterValue;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  applyTipoIngresoFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: IngresosLubricentro, filter: string) => data.tipoIngreso.includes(filter);
    this.dataSource.filter = filterValue;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  applyEstadoPagoFilter(filterlimpiarFiltrosValue: string) {
    this.dataSource.filterPredicate = (data: IngresosLubricentro, filter: string) => data.estadoPago === filter;
    this.dataSource.filter = filterlimpiarFiltrosValue;
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
