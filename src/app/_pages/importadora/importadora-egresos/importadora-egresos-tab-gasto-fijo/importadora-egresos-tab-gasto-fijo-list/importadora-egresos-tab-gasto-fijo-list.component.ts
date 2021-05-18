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
import { ImportadoraService } from '../../../importadora.service';

@Component({
  selector: 'app-importadora-egresos-tab-gasto-fijo-list',
  templateUrl: './importadora-egresos-tab-gasto-fijo-list.component.html',
  styleUrls: ['./importadora-egresos-tab-gasto-fijo-list.component.scss']
})
export class ImportadoraEgresosTabGastoFijoListComponent implements OnInit {

   // ? childrens
   @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

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
   ];

     //Creación de variables y asignación de datos
 dataSource: MatTableDataSource<EgresosFijoImportadora> = new MatTableDataSource();
 dataEgresos: EgresosFijoImportadora[] = [];

 changelog: string[] = [];

 formFilter = new FormGroup({
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
     console.log(this.dataEgresos);
     this.dataSource = new MatTableDataSource(this.dataEgresos);
     this.dataSource.paginator = this.paginator.toArray()[0];
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
 limpiarFiltros() {
   this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoEgreso: null, vendedor: null, descripcionEgreso: null, usuario: null, codigoAutorizacion: null, medioPago: null})
   this.dataSource = new MatTableDataSource(this.dataEgresos);
   this.dataSource.paginator = this.paginator.toArray()[0];
   this.selection.clear()
   this.totalSeleccion = 0;
 }

 //Cargar los archivos de respaldo
 recuperarArchivos(listArchivos: any) {
   this.dialog.open(DialogDownloadsComponent, {
     data: { archivos: listArchivos, servicio: 'importadora-egresoFijo' },
   });
 }

 //Metodo exportar excel
exportAsXLSX(): void {
 this.selectedRows = [];
 this.selection.selected.forEach((x) => this.selectedRows.push(x));
 this.importadoraService.exportAsExcelFile(this.selectedRows, 'Lista-Egresos-Fijos-Importadora');
}

}
