import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { InmobiliariaService } from '../../inmobiliaria.service';
import { IngresosInmobiliaria } from '@app/_models/inmobiliaria/ingresoInmobiliaria';
import { MatDialog } from '@angular/material/dialog';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogShow } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inmobiliaria-ingresos-list',
  templateUrl: './inmobiliaria-ingresos-list.component.html',
  styleUrls: ['./inmobiliaria-ingresos-list.component.scss']
})
export class InmobiliariaIngresosListComponent implements OnInit {

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
    'propiedad',
    'respaldos',
    'fecha',
    'monto',
    'tipoIngreso',
    'descripcionIngreso',
    'sucursal',
    'usuario'
  ];
  dataSource: MatTableDataSource<IngresosInmobiliaria> = new MatTableDataSource();
  dataIngresos: IngresosInmobiliaria[] = [];

  changelog: string[] = [];


  formFilter = new FormGroup({
    id: new FormControl(),
    monto: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    tipoIngreso: new FormControl(),
    descripcionIngreso: new FormControl(),
    Propiedad: new FormControl(),        
  })

  sucursales: Sucursal[] = [];
  selection = new SelectionModel<IngresosInmobiliaria>(true, []);
  tiposIngresos: string[] = [];
  estadosPagos: string[] = [];
  totalSeleccion = 0;
  selectedRows!: any[]
  cuentasRegistradas: any[] = [];
  
  constructor(
    private inmobiliariaService: InmobiliariaService,
    public dialog: MatDialog,
    private sucursalService: SucursalSharedService,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.sucursales = this.sucursalService.sucursalListValue;
    this.tiposIngresos = this.inmobiliariaService.tiposIngresosListValue;
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
      //Carga Tabla 
      this.inmobiliariaService.getAll().subscribe((ingresos: IngresosInmobiliaria[]) => {
        this.dataIngresos = ingresos.map(ingresos => {
          ingresos.sucursal = ingresos.Sucursal.razonSocial;
          ingresos.usuario = ingresos.Usuario.nombreUsuario;
          ingresos.monto = ingresos.monto;
          return ingresos;
        });
        this.dataSource = new MatTableDataSource(this.dataIngresos);
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort;
      });
    }
  }

  recuperarArchivos(listArchivos: any) {
    setTimeout(() => {
    this.dialog.open(DialogShow, {
      data: { archivos: listArchivos, servicio: 'inmobiliaria-ingreso' },
    });
  }, 1000);
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

  revelarTotal() {
    this.totalSeleccion = 0;
    this.selection.selected.forEach(data => {
      this.totalSeleccion += data.monto;
    });
  }

  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {
      const { id, monto } = res

      let dataFiltered = this.dataIngresos;

      if (id) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => (data.id).toString().includes(id))
      }    
      if (monto) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => (data.monto).toString().includes(monto))
      }
      if (res.Propiedad) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => data.propiedad.includes(res.Propiedad));
      }

      if (res.descripcionIngreso) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => data.descripcionIngreso.includes(res.descripcionIngreso));
      }

      if (res.tipoIngreso) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => data.tipoIngreso == res.tipoIngreso);
      }

      if (res.idSucursal) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => data.sucursal == res.idSucursal);
      }

      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);
      }

      if(res.monto){
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => data.monto == res.monto)
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.dataSource.sort = this.sort;
      this.selection.clear();
    })
  }




  // Filtros
  resetTable() {
    this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoIngreso: null, estadoPago: null, cliente: null, nDocumento: null })
    this.dataSource = new MatTableDataSource(this.dataIngresos)
    this.dataSource.paginator = this.paginator.toArray()[0]
    this.dataSource.sort = this.sort
    this.dataSource.paginator['_pageIndex'] = 0
    this.updateTable()
    this.selection.clear()
    this.totalSeleccion = 0
  }

  updateTable(){
    this.inmobiliariaService.getAll().subscribe((ingresos: IngresosInmobiliaria[]) => {
      this.dataIngresos = ingresos.map(ingresos => {
        ingresos.sucursal = ingresos.Sucursal.razonSocial
        ingresos.usuario = ingresos.Usuario.nombreUsuario
        return ingresos
      });
      
      this.dataSource = new MatTableDataSource(this.dataIngresos)
      this.dataSource.paginator = this.paginator.toArray()[0]
      this.dataSource.sort = this.sort
    });
  }

  exportAsXLSX(): void {
    this.selectedRows = [];
    if(this.selection.selected.length == 0) {
      this.snackBar.open('!Seleccione alg??n registro!', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.selection.selected.forEach((x) => this.selectedRows.push(x));
        const newArray = this.selectedRows.map((item) => {
        const { Sucursal, Usuario, RespaldoIngresoInmobiliaria, ...newObject } = item
        return newObject
      })
    
    this.inmobiliariaService.exportAsExcelFile(newArray, 'Lista-Egresos-Rentacar');

    }
  }
}
