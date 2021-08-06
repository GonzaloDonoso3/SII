import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { first } from 'rxjs/operators';
import { Empresa } from '@app/_models/shared/empresa';
import { EgresosFijoImportadora } from '@app/_models/importadora/egresoFijoImportadora';
import { EgresosContainerImportadora } from '@app/_models/importadora/egresoContainerImportadora';
import { ImportadoraService } from '../../../importadora.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-importadora-egresos-tab-gasto-neumaticos-list',
  templateUrl: './importadora-egresos-tab-gasto-neumaticos-list.component.html',
  styleUrls: ['./importadora-egresos-tab-gasto-neumaticos-list.component.scss']
})
export class ImportadoraEgresosTabGastoNeumaticosListComponent implements OnInit {

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
   'nContainer',
   'costoNeumatico',
   'costoComision',
   'costoInterior',
   'costoMaritimo',
   'seguros',
   'impuestoProntuario',
   'montoTotal',
   'fecha',
   'sucursal',
   'usuario',
 ];

   //Creación de variables y asignación de datos
dataSource: MatTableDataSource<EgresosContainerImportadora> = new MatTableDataSource();
dataEgresos: EgresosContainerImportadora[] = [];

changelog: string[] = [];

formFilter = new FormGroup({
  id: new FormControl(),
  montoTotal: new FormControl(),
  start: new FormControl(),
  end: new FormControl(),
  idSucursal: new FormControl(),
  descripcion: new FormControl(),
  tipoEgreso: new FormControl(),
  usuario: new FormControl(),
})



empresa = new Empresa();
idEmpresa = 9;
sucursales: Sucursal[] = [];
selection = new SelectionModel<EgresosContainerImportadora>(true, []);
tiposEgresos: string[] = [];
estadosPagos: string[] = [];
totalSeleccion = 0;
cuentasRegistradas: any[] = [];
selectedRows!: any[];
idConteiner !: any;

constructor(
 public dialog: MatDialog,
 private empresaService: EmpresaSharedService,
 private importadoraService: ImportadoraService,
 private snackBar: MatSnackBar,
) { }

ngOnInit(): void {
 this.getEgreso();
 this.getEmpresa(this.idEmpresa);
 this.aplicarfiltros();
}


getEgreso(){
 this.importadoraService.getAllEgresosConteiner().subscribe((egresos: EgresosContainerImportadora[]) => {
   this.dataEgresos = egresos.map(Egresos => {
     Egresos.sucursal = Egresos.Sucursal.razonSocial;
     Egresos.usuario = Egresos.Usuario.nombreUsuario;
     return Egresos;
   });   
   this.dataSource = new MatTableDataSource(this.dataEgresos);
   this.dataSource.paginator = this.paginator.toArray()[0];
   this.dataSource.sort = this.sort
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
   this.totalSeleccion += data.montoTotal;
 });
}

aplicarfiltros() {
 this.formFilter.valueChanges.subscribe((res) => {
   let dataFiltered = this.dataEgresos
   const { id, montoTotal } = res
  
   if (id) {
    dataFiltered = dataFiltered.filter((data: EgresosContainerImportadora) => (data.id).toString().includes(id))
  }    
  if (montoTotal) {
    dataFiltered = dataFiltered.filter((data: EgresosContainerImportadora) => (data.montoTotal).toString().includes(montoTotal))
  }

   if (res.idSucursal) {
     dataFiltered = dataFiltered.filter((data: EgresosContainerImportadora) => data.Sucursal.razonSocial == res.idSucursal)
   }

   if (res.usuario) {
     dataFiltered = dataFiltered.filter((data: EgresosContainerImportadora) => data.usuario.trim() == res.usuario)
   }

   if (res.start && res.end) {
     dataFiltered = dataFiltered.filter((data: EgresosContainerImportadora) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end)
   }

   this.dataSource = new MatTableDataSource(dataFiltered)
   this.dataSource.paginator = this.paginator.toArray()[0]
   this.totalSeleccion = 0
   this.selection.clear()
 })
}


  // Inicio Filtros
  resetTable() {
   this.formFilter.patchValue({ start: null, end: null, idSucursal: null, usuario: null})
   this.dataSource = new MatTableDataSource(this.dataEgresos);
   this.dataSource.paginator = this.paginator.toArray()[0];
   this.dataSource.paginator['_pageIndex'] = 0
   this.getEgreso()
   this.selection.clear()
   this.totalSeleccion = 0;
  }
  
  //Cargar los archivos de respaldo
  recuperarArchivos(listArchivos: any) {
   this.dialog.open(DialogDownloadsComponent, {
     data: { archivos: listArchivos, servicio: 'importadora-egresoConteiner' },
   });
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
    
    this.importadoraService.exportAsExcelFile(newArray, 'Lista-Egresos-Neumaticos-Importadora');
  
    }
  }

  // Abrir Ventana Modal Registrar Pago
  openDialogNeumatico(){
    //Selecciona los valores de la fila seleccionada
    this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.selectedRows.forEach((x) => {
      localStorage.setItem("idConteiner", x.id);
    });
    //Se ejecuta el metodo que abre el dialog, enviandole le id del contrato
    let idConteiner = localStorage.getItem("idConteiner");
    this.importadoraService.openDialogNeumatico(idConteiner);
  }
}
