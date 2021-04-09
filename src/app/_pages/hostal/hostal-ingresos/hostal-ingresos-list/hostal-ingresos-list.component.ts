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


  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    tipoIngreso: new FormControl(),
    cliente: new FormControl(),
    estadoPago: new FormControl(),
    nDocumento: new FormControl(),
  })


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

    this.aplicarfiltros();
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

      if (res.cliente) {
        dataFiltered = dataFiltered.filter((data: IngresosHostal) => data.cliente.includes(res.cliente));
      }

      if (res.nDocumento) {
        dataFiltered = dataFiltered.filter((data: IngresosHostal) => data.nDocumento.includes(res.nDocumento));
      }

      if (res.estadoPago) {
        dataFiltered = dataFiltered.filter((data: IngresosHostal) => data.estadoPago == res.estadoPago);
      }

      if (res.tipoIngreso) {
        dataFiltered = dataFiltered.filter((data: IngresosHostal) => data.tipoIngreso == res.tipoIngreso);
      }

      if (res.idSucursal) {
        dataFiltered = dataFiltered.filter((data: IngresosHostal) => data.sucursal == res.idSucursal);
      }

      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: IngresosHostal) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.selection.clear();
    })
  }





  // ? filters
  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoIngreso: null, estadoPago: null, cliente: null, nDocumento: null })
    this.dataSource = new MatTableDataSource(this.dataIngresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
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
  }



}


