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
import { EgresosFijoImportadora } from '@app/_models/importadora/egresoFijoImportadora';
import { ImportadoraService } from '../../../importadora.service';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-importadora-egresos-tab-gasto-fijo-list',
  templateUrl: './importadora-egresos-tab-gasto-fijo-list.component.html',
  styleUrls: ['./importadora-egresos-tab-gasto-fijo-list.component.scss']
})
export class ImportadoraEgresosTabGastoFijoListComponent implements OnInit {

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
     'tipoEgreso',
     'descripcion',
     'sucursal',
     'usuario',
     'numeroCuota',
   ];

   result = "N/A";

     //Creación de variables y asignación de datos
 dataSource: MatTableDataSource<EgresosFijoImportadora> = new MatTableDataSource();
 dataEgresos: EgresosFijoImportadora[] = [];

 changelog: string[] = [];

 formFilter = new FormGroup({
   id: new FormControl(),
   monto: new FormControl(),
   start: new FormControl(),
   end: new FormControl(),
   idSucursal: new FormControl(),
   descripcion: new FormControl(),
   tipoEgreso: new FormControl(),
   usuario: new FormControl(),
   numeroCuota: new FormControl(),
 })



 empresa = new Empresa();
 idEmpresa = 9;
 sucursales: Sucursal[] = [];
 selection = new SelectionModel<EgresosFijoImportadora>(true, []);
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
   this.getEgreso();
   this.getEmpresa(this.idEmpresa);
   this.aplicarfiltros();
 }


 getEgreso(){
   this.importadoraService.getAllEgresosFijo().subscribe((egresos: EgresosFijoImportadora[]) => {
     this.dataEgresos = egresos.map(Egresos => {
       Egresos.sucursal = Egresos.Sucursal.razonSocial;
       Egresos.usuario = Egresos.Usuario.nombreUsuario;
       return Egresos;
     });
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
     let dataFiltered = this.dataEgresos
    const { id, monto } = res
     if (id) {
      dataFiltered = dataFiltered.filter((data: EgresosFijoImportadora) => (data.id).toString().includes(id))
    }    
    if (monto) {
      dataFiltered = dataFiltered.filter((data: EgresosFijoImportadora) => (data.monto).toString().includes(monto))
    }

     if (res.descripcion) {
       dataFiltered = dataFiltered.filter((data: EgresosFijoImportadora) => data.descripcion == res.descripcion)
     }

     if (res.tipoEgreso) {
       dataFiltered = dataFiltered.filter((data: EgresosFijoImportadora) => data.tipoEgreso == res.tipoEgreso)
     }

     if (res.idSucursal) {
       dataFiltered = dataFiltered.filter((data: EgresosFijoImportadora) => data.Sucursal.razonSocial == res.idSucursal)
     }

     if (res.usuario) {
       dataFiltered = dataFiltered.filter((data: EgresosFijoImportadora) => data.usuario.trim() == res.usuario)
     }

     if (res.start && res.end) {
       dataFiltered = dataFiltered.filter((data: EgresosFijoImportadora) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end)
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
   this.dataSource = new MatTableDataSource(this.dataEgresos);
   this.dataSource.paginator = this.paginator.toArray()[0];
   this.dataSource.paginator['_pageIndex'] = 0
   this.getEgreso()
   this.selection.clear()
   this.totalSeleccion = 0;
 }

 //Cargar los archivos de respaldo
 recuperarArchivos(listArchivos: any) {
  setTimeout(() => {
    this.dialog.open(DialogShow, {    
     data: { archivos: listArchivos, servicio: 'importadora-egresoFijo' },
   });
  }, 1000);
 }

 // Abrir Ventana Modal Registrar Pago
 openDialogRegistrarPago(){
  //Selecciona los valores de la fila seleccionada    
  this.selectedRows = [];
  this.selection.selected.forEach((x) => {this.selectedRows.push(x)});
  if(this.selectedRows.length > 0){
    this.selectedRows.forEach((x) => {      
      localStorage.setItem("idEgresoPago", x.id);
      localStorage.setItem("numeroCuota", x.numeroCuota);
    });
    //Se ejecuta el metodo que abre el dialog, enviandole le id del Egreso por cuota
    let idEgresoPagoCuota = localStorage.getItem("idEgresoPago");
    let valorNumeroC = localStorage.getItem("numeroCuota");
    if(valorNumeroC != "N/A"){
      this.importadoraService.openDialogRegistrarPago(idEgresoPagoCuota);
    } else{    
    this.snackBar.open('Por favor seleccione un egreso con cuotas sin pagar', 'cerrar', {
      duration: 2000,
      verticalPosition: 'top',
    });
  }
  } else {
    this.snackBar.open('Por favor seleccione un egreso con cuotas', 'cerrar', {
      duration: 2000,
      verticalPosition: 'top',
    });
  } 
  
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
  
  this.importadoraService.exportAsExcelFile(newArray, 'Lista-Egresos-Fijos-Importadora');

  }
}

}
