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
    'respaldos',
    'estadoPago',
    'sucursal',
    'tipoIngreso',
    'usuario'
  ];
  dataSource: MatTableDataSource<IngresosLubricentro> = new MatTableDataSource();
  dataIngresos: IngresosLubricentro[] = [];

  changelog: string[] = [];

  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    tipoIngreso: new FormControl(),
    estadoPago: new FormControl(),
  })


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
    this.aplicarfiltros();
  }



  recuperarArchivos(listArchivos: any) {
    this.dialog.open(DialogDownloadsComponent, {

      data: { archivos: listArchivos, servicio: 'lubricentro-ingreso' },

    });
  }


  revelarTotal() {
    this.totalSeleccion = 0;
    console.log(this.selection.selected.length);
    this.selection.selected.forEach(data => {
      this.totalSeleccion += data.monto;
    });
  }


  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {

      let dataFiltered = this.dataIngresos;

      if (res.estadoPago) {
        dataFiltered = dataFiltered.filter((data: IngresosLubricentro) => data.estadoPago == res.estadoPago);
      }

      if (res.tipoIngreso) {
        dataFiltered = dataFiltered.filter((data: IngresosLubricentro) => data.tipoIngreso == res.tipoIngreso);
      }

      if (res.idSucursal) {
        dataFiltered = dataFiltered.filter((data: IngresosLubricentro) => data.sucursal == res.idSucursal);
      }

      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: IngresosLubricentro) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.selection.clear();
    })
  }


  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoIngreso: null, estadoPago: null, })
    this.dataSource = new MatTableDataSource(this.dataIngresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
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


}
