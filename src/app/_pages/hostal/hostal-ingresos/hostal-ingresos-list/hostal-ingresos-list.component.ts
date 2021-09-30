import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogShow } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { IngresosHostal } from '@app/_models/hostal/ingresoHostal';
import { Sucursal } from '@app/_models/shared/sucursal';
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
  @ViewChild(MatSort) sort = new MatSort;

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
    id: new FormControl(),
    monto: new FormControl(),
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
  selectedRows!: any[];
  cuentasRegistradas: any[] = [];
  
  

  constructor(
    private hostalService: HostalService,
    public dialog: MatDialog,
    private sucursalService: SucursalSharedService,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {

    this.sucursales = this.sucursalService.sucursalListValue;
    this.tiposIngresos = ['Alojamiento', 'Desayuno', 'Almuerzo', 'Cena', ' Consumo Bebidas', 'Consumo Varios'];
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
          ingreso.monto = ingreso.monto;
          return ingreso;
        });
        this.dataSource = new MatTableDataSource(this.dataIngresos);
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort

      });
    }
  }


  recuperarArchivos(listArchivos: any) {    
    setTimeout(() => {
      this.dialog.open(DialogShow, {    
        data: { archivos: listArchivos, servicio: 'hostal-ingreso' },
      });  
     }, 1000);                                       
    
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
      const { id, monto } = res
      let dataFiltered = this.dataIngresos;

      if (id) {
        dataFiltered = dataFiltered.filter((data: IngresosHostal) => (data.id).toString().includes(id))
      }    
      if (monto) {
        dataFiltered = dataFiltered.filter((data: IngresosHostal) => (data.monto).toString().includes(monto))
      }

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

      if (res.monto){
        dataFiltered = dataFiltered.filter((data: IngresosHostal) => data.monto == res.monto )
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort
      this.totalSeleccion = 0;
      this.selection.clear();
    })
  }





  // ? filters
  limpiarFiltros() {
    
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

  resetTable() {
    this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoIngreso: null, estadoPago: null, cliente: null, nDocumento: null })
    this.dataSource = new MatTableDataSource(this.dataIngresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort
    this.dataSource.paginator['_pageIndex'] = 0
    this.updateTable()
    this.selection.clear()
    this.totalSeleccion = 0;
  }

  updateTable(){
    this.hostalService.ingresoGetAll().subscribe((ingresos: IngresosHostal[]) => {
      this.dataIngresos = ingresos.map(ingreso => {
        ingreso.sucursal = ingreso.Sucursal.razonSocial;
        ingreso.usuario = ingreso.Usuario.nombreUsuario;
        return ingreso;
      });
      this.dataSource = new MatTableDataSource(this.dataIngresos);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort
    });
  }

  exportAsXLSX(): void {
    this.selectedRows = [];
    if(this.selection.selected.length == 0) {
      this.snackBar.open('!Seleccione algún registro!', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.selection.selected.forEach((x) => this.selectedRows.push(x));
        const newArray = this.selectedRows.map((item) => {
        const { RespaldoIngresos, Usuario, Sucursal, ...newObject } = item
        return newObject
      })
    
    this.hostalService.exportAsExcelFile(newArray, 'Lista-Egresos-Rentacar');

    }
  }



}


