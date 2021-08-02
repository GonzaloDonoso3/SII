import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogShow } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { EgresoLubricentro } from '@app/_models/lubricentro/egresoLubricentro';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { LubricentroService } from '../../lubricentro.service';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-lubricentro-egresos-list',
  templateUrl: './lubricentro-egresos-list.component.html',
  styleUrls: ['./lubricentro-egresos-list.component.scss'],
  providers: [DatePipe]
})
export class LubricentroEgresosListComponent implements OnInit, OnChanges {


  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = null;

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
    'usuario',
    'numeroCuota'
  ];

  result = "N/A"; 

  //Creación de variables y asignación de datos
  dataSource: MatTableDataSource<EgresoLubricentro> = new MatTableDataSource();
  dataEgresos: EgresoLubricentro[] = [];

  changelog: string[] = [];

  //filtros
  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    tipoEgreso: new FormControl(),
    numeroCuota: new FormControl(),
    monto: new FormControl(),
  })

  sucursales: Sucursal[] = [];
  selection = new SelectionModel<EgresoLubricentro>(true, []);
  tiposEgresos: string[] = [];
  totalSeleccion = 0;
  cuentasRegistradas: any[] = [];
  selectedRows!: any[];
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
    this.aplicarfiltros();
  }



  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {

      let dataFiltered = this.dataEgresos;

      if (res.idSucursal) {
        dataFiltered = dataFiltered.filter((data: EgresoLubricentro) => data.sucursal == res.idSucursal);
      }

      if (res.tipoEgreso) {
        dataFiltered = dataFiltered.filter((data: EgresoLubricentro) => data.tipoEgreso == res.tipoEgreso);
      }

      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: EgresoLubricentro) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);
      }

      if (res.monto){
        dataFiltered = dataFiltered.filter((data: EgresoLubricentro) => data.monto == res.monto);
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort;
      this.selection.clear();
    })
  }


  // ? filters
  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoEgreso: null, monto: null })
    this.dataSource = new MatTableDataSource(this.dataEgresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator['_pageIndex'] = 0;
    this.actualizarTabla();
    this.selection.clear()
    this.totalSeleccion = 0;
  }




  recuperarArchivos(listArchivos: any) {
    setTimeout(() => {
    this.dialog.open(DialogShow, {
      data: { archivos: listArchivos, servicio: 'lubricentro-egreso' },
    });
  }, 1000);
  }




  revelarTotal() {
    this.totalSeleccion = 0;
    //console.log(this.selection.selected.length);
    this.selection.selected.forEach(data => {
      this.totalSeleccion += data.monto;
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
          egreso.monto = egreso.monto;
          return egreso;
        });
        //console.log(data);
        this.dataEgresos.forEach(data => {
          if (data['numeroCuota']== null) {
            data.numeroCuota = this.result;          
          }
        });
        this.dataSource = new MatTableDataSource(this.dataEgresos);
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort;
      });
    }
  }

  actualizarTabla(){
    this.lubricentroService.egresoGetAll().subscribe((data: EgresoLubricentro[]) => {
      this.dataEgresos = data.map(egreso => {
        egreso.sucursal = egreso.Sucursal.razonSocial;
        egreso.usuario = egreso.Usuario.nombreUsuario;
        return egreso;
      });
      //console.log(data);
      this.dataEgresos.forEach(data => {
        if (data['numeroCuota']== null) {
          data.numeroCuota = this.result;          
        }
      });
      this.dataSource = new MatTableDataSource(this.dataEgresos);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort;
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

  //Metodo exportar excel
  exportAsXLSX(): void {
    this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.lubricentroService.exportAsExcelFile(this.selectedRows, 'Egresos-Lubricentro');
  }


}
