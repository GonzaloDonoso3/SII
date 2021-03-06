import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogShow } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { first } from 'rxjs/operators';
import { Empresa } from '@app/_models/shared/empresa';
import { IngresosImportadora } from '@app/_models/importadora/ingresoImportadora';
import { ImportadoraService } from '../../importadora.service';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-importadora-ingresos-list',
  templateUrl: './importadora-ingresos-list.component.html',
  styleUrls: ['./importadora-ingresos-list.component.scss']
})
export class ImportadoraIngresosListComponent implements OnInit {


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
     'respaldos',
     'fecha',
     'monto',
     'medioPago',
     'codigoAutorizacion',
     'tipoIngreso',
     'descripcionIngreso',
     'vendedor',
     'sucursal',
     'usuario',
   ];

     //Creación de variables y asignación de datos
 dataSource: MatTableDataSource<IngresosImportadora> = new MatTableDataSource();
 dataIngresos: IngresosImportadora[] = [];

 changelog: string[] = [];

 formFilter = new FormGroup({
   id: new FormControl(),
   monto: new FormControl(),
   start: new FormControl(),
   end: new FormControl(),
   idSucursal: new FormControl(),
   descripcionIngreso: new FormControl(),
   tipoIngreso: new FormControl(),
   usuario: new FormControl(),
   vendedor: new FormControl(),
   medioPago: new FormControl(),
   codigoAutorizacion: new FormControl(),
 })



 empresa = new Empresa();
 idEmpresa = 9;
 sucursales: Sucursal[] = [];
 selection = new SelectionModel<IngresosImportadora>(true, []);
 tiposEgresos: string[] = [];
 estadosPagos: string[] = [];
 totalSeleccion = 0;
 cuentasRegistradas: any[] = [];
 selectedRows!: any[];

 constructor(
   public dialog: MatDialog,
   private empresaService: EmpresaSharedService,
   private importadoraService: ImportadoraService,
   private snackBar: MatSnackBar
 ) { }

 ngOnInit(): void {
   this.getIngresos();
   this.getEmpresa(this.idEmpresa);
   this.aplicarfiltros();
 }


 getIngresos(){
   this.importadoraService.getAll().subscribe((ingresos: IngresosImportadora[]) => {
     this.dataIngresos = ingresos.map(Ingresos => {
       Ingresos.sucursal = Ingresos.Sucursal.razonSocial;
       Ingresos.usuario = Ingresos.Usuario.nombreUsuario;
       return Ingresos;
     });
     this.dataSource = new MatTableDataSource(this.dataIngresos);
     this.dataSource.paginator = this.paginator.toArray()[0];
     this.dataSource.sort = this.sort;
   });
 }

 getEmpresa(id: number): any {
   this.empresaService
     .getByIdWithSucursales(id)
     .pipe(first())
     .subscribe((x) => {
       x.Sucursals = Object.values(x.Sucursals);
       this.empresa = x;
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

 //Sumar el total de las filas seleccionadas
 revelarTotal() {
   this.totalSeleccion = 0;

   this.selection.selected.forEach(data => {
     this.totalSeleccion += data.monto;
   });
 }

 aplicarfiltros() {
   this.formFilter.valueChanges.subscribe((res) => {
     let dataFiltered = this.dataIngresos
     const { id, monto } = res
     if (id) {
      dataFiltered = dataFiltered.filter((data: IngresosImportadora) => (data.id).toString().includes(id))
    }    
    if (monto) {
      dataFiltered = dataFiltered.filter((data: IngresosImportadora) => (data.monto).toString().includes(monto))
    }

     if (res.descripcionIngreso) {
       dataFiltered = dataFiltered.filter((data: IngresosImportadora) => data.descripcionIngreso == res.descripcionIngreso)
     }

     if (res.tipoEgreso) {
       dataFiltered = dataFiltered.filter((data: IngresosImportadora) => data.tipoIngreso == res.tipoEgreso)
     }

     if (res.medioPago) {
       dataFiltered = dataFiltered.filter((data: IngresosImportadora) => data.medioPago == res.medioPago)
     }
     if (res.codigoAutorizacion) {
       dataFiltered = dataFiltered.filter((data: IngresosImportadora) => data.codigoAutorizacion == res.codigoAutorizacion)
     }

     if (res.idSucursal) {
       dataFiltered = dataFiltered.filter((data: IngresosImportadora) => data.Sucursal.razonSocial == res.idSucursal)
     }

     if (res.usuario) {
       dataFiltered = dataFiltered.filter((data: IngresosImportadora) => data.usuario.trim() == res.usuario)
     }

     if (res.vendedor) {
       dataFiltered = dataFiltered.filter((data: IngresosImportadora) => data.vendedor.trim() == res.vendedor)
     }

     if (res.start && res.end) {
       dataFiltered = dataFiltered.filter((data: IngresosImportadora) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end)
     }

     this.dataSource = new MatTableDataSource(dataFiltered)
     this.dataSource.paginator = this.paginator.toArray()[0]
     this.totalSeleccion = 0
     this.selection.clear()
   })
 }


 // Inicio Filtros
 resetTable() {
   this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoEgreso: null, vendedor: null, descripcionEgreso: null, usuario: null, codigoAutorizacion: null, medioPago: null})
   this.dataSource = new MatTableDataSource(this.dataIngresos);
   this.dataSource.paginator = this.paginator.toArray()[0];
   this.dataSource.paginator['_pageIndex'] = 0
   this.getIngresos()
   this.selection.clear()
   this.totalSeleccion = 0;
 }

 //Cargar los archivos de respaldo
 recuperarArchivos(listArchivos: any) {
  setTimeout(() => {
   this.dialog.open(DialogShow, {
     data: { archivos: listArchivos, servicio: 'importadora-ingreso' },
   });
  }, 1000);
 }

 //Metodo exportar excel

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
      const { Sucursal, Usuario, RespaldoIngresoImportadoras, idSucursal, idUsuario, ...newObject } = item
      return newObject
    })
  
  this.importadoraService.exportAsExcelFile(newArray, 'Lista-Ingresos-Importadora');

  }
}
}
