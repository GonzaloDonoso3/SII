import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { EgresoLubricentro } from '@app/_models/lubricentro/egresoLubricentro';

import { Sucursal } from '@app/_models/shared/sucursal';

import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { LubricentroService } from '../../lubricentro.service';

@Component({
  selector: 'app-lubricentro-egresos-list',
  templateUrl: './lubricentro-egresos-list.component.html',
  styleUrls: ['./lubricentro-egresos-list.component.scss']
})
export class LubricentroEgresosListComponent implements OnInit, OnChanges {


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
    'respaldos',
    'tipoEgreso',
    'sucursal',
    'usuario'
  ];
  dataSource: MatTableDataSource<EgresoLubricentro> = new MatTableDataSource();
  dataEgresos: EgresoLubricentro[] = [];

  changelog: string[] = [];
  rangoFecha = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),

  });
  sucursalFilter = new FormGroup({
    idSucursal: new FormControl(),
  });
  tipoEgresoFilter = new FormGroup({
    tipoEgreso: new FormControl(),
  });
  sucursales: Sucursal[] = [];
  selection = new SelectionModel<EgresoLubricentro>(true, []);
  tiposEgresos: string[] = [];
  totalSeleccion = 0;
  cuentasRegistradas: any[] = [];
  constructor(
    private lubricentroService: LubricentroService,
    public dialog: MatDialog,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService
  ) {
    this.sucursales = this.sucursalService.sucursalListValue;
    this.tiposEgresos = this.lubricentroService.tiposEgresosListValue;
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
    this.tipoEgresoFilter.valueChanges.subscribe(res => {
      this.applyTipoEgresoFilter(res.tipoEgreso);
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
      this.lubricentroService.egresoGetAll().subscribe((data: EgresoLubricentro[]) => {
        this.dataEgresos = data.map(egreso => {
          egreso.sucursal = egreso.Sucursal.razonSocial;
          egreso.usuario = egreso.Usuario.nombreUsuario;
          return egreso;
        });
        console.log(data);
        this.dataSource = new MatTableDataSource(this.dataEgresos);
        this.dataSource.paginator = this.paginator.toArray()[0];

      });
    }
  }
  recuperarArchivos(listArchivos: any) {
    this.dialog.open(DialogDownloadsComponent, {

      data: { archivos: listArchivos, servicio: 'lubricentro-egreso' },

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
    this.dataSource = new MatTableDataSource(this.dataEgresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyDateFilter(start: Date, end: Date) {

    const dataFiltered = this.dataEgresos.map(data => {
      data.fecha = new Date(data.fecha);
      return data;
    }).filter(comp => comp.fecha >= start && comp.fecha <= end);

    this.dataSource = new MatTableDataSource(dataFiltered);

    this.dataSource.paginator = this.paginator.toArray()[0];


  }
  applySucursalFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: EgresoLubricentro, filter: string) => data.sucursal === filter;
    this.dataSource.filter = filterValue;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  applyTipoEgresoFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: EgresoLubricentro, filter: string) => data.tipoEgreso === filter;
    this.dataSource.filter = filterValue;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  /* fijarFiltro(e: MatCheckboxChange) {
    if (e.checked) {
      this.dataSource =
        new MatTableDataSource(
          this.dataEgresos
            .filter(data =>
              data.estadoPago == this.estadoPagoFilter.value.estadoPago
            ));
    }
    if (!e.checked) {
      this.dataSource =
        new MatTableDataSource(
          this.dataEgresos
        );
    }
  } */

}
