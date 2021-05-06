import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { EgresoHostal } from '@app/_models/hostal/egresoHostal';
import { RegistroEgresoFirma } from '@app/_models/registros/egresosFirma';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { AbogadosService } from '@app/_pages/abogados/abogados.service';


@Component({
  selector: 'app-abogados-egresos-list',
  templateUrl: './abogados-egresos-list.component.html',
  styleUrls: ['./abogados-egresos-list.component.scss']
})
export class AbogadosEgresosListComponent implements OnInit, OnChanges {


// ? childrens
@ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

// ? Inputs & Outputs
@Input()
refrescar = '';

//selectedRows: any[];


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
];

dataSource: MatTableDataSource<RegistroEgresoFirma> = new MatTableDataSource();
dataEgresos: RegistroEgresoFirma[] = [];

changelog: string[] = [];


//filtros
formFilter = new FormGroup({
  start: new FormControl(),
  end: new FormControl(),
  idSucursal: new FormControl(),
  tipoEgreso: new FormControl(),
})


sucursales: Sucursal[] = [];
selection = new SelectionModel<RegistroEgresoFirma>(true, []);
tiposEgresos: string[] = [];
totalSeleccion = 0;
cuentasRegistradas: any[] = [];
constructor(
  private abogadosService: AbogadosService,
  public dialog: MatDialog,
  private sucursalService: SucursalSharedService,
  private cuentasService: CuentasBancariasService
) {
  this.sucursales = this.sucursalService.sucursalListValue;
  this.tiposEgresos = this.abogadosService.tiposEgresosListValue;  
}

ngOnInit(): void {
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
    this.abogadosService.egresoGetAll().subscribe((data: RegistroEgresoFirma[]) => {            
      this.dataEgresos = data.map(egreso => {
        egreso.sucursal = egreso.Sucursal.razonSocial;
        egreso.usuario = egreso.Usuario.nombreUsuario;
        return egreso;
      });
      this.dataSource = new MatTableDataSource(this.dataEgresos);
      this.dataSource.paginator = this.paginator.toArray()[0];
    });
  }
}


recuperarArchivos(listArchivos: any) {
  this.dialog.open(DialogDownloadsComponent, {    
    data: { archivos: listArchivos, servicio: 'abogados-egresos' },    
  });
}

//Metodo exportar excel
// exportAsXLSX(): void {
//   this.selectedRows = [];
//   this.selection.selected.forEach((x) => this.selectedRows.push(x));
//   this.abogadosService.exportAsExcelFile(this.selectedRows, 'Lista-Cuotas');
// }


revelarTotal() {
  this.totalSeleccion = 0;  
  this.selection.selected.forEach(data => {
    console.log("LO QUE LLEVA LA LISTA",this.selection.selected)
    this.totalSeleccion += data.monto;
  });
}


exportTable() {
  this.totalSeleccion = 0;  
  this.selection.selected.forEach(data => {
    console.log("LO QUE LLEVA LA LISTA EN EXCEL",this.selection.selected)
    //this.totalSeleccion += data.monto;
  });
}

// exporter(): void {
//   this.selectedRows = [];
//   this.agGrid.api.getSelectedRows().forEach((x) => this.selectedRows.push(x));
//   this.selectedRows.forEach((x) => {
//     const fechaF = new Date(x.createdAt);
//     const fechaG = new Date(x.updatedAt);
//     const formato = {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'numeric',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       second: 'numeric',
//     };
//     x.createdAt = fechaF.toLocaleDateString('es-GB', formato);
//     x.updatedAt = fechaF.toLocaleDateString('es-GB', formato);
//   });
//   console.log(this.selectedRows);
//   this.excelService.exportAsExcelFile(this.selectedRows, 'sample');
// }

aplicarfiltros() {
  this.formFilter.valueChanges.subscribe(res => {

    let dataFiltered = this.dataEgresos;      

    if (res.idSucursal) {      
      dataFiltered = dataFiltered.filter((data: RegistroEgresoFirma) => data.sucursal == res.idSucursal);      
    }

    if (res.tipoEgreso) {      
      dataFiltered = dataFiltered.filter((data: RegistroEgresoFirma) => data.tipoEgreso == res.tipoEgreso);
    }

    if (res.start && res.end) {
      dataFiltered = dataFiltered.filter((data: RegistroEgresoFirma) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);        
    }

    this.dataSource = new MatTableDataSource(dataFiltered);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear();
  })
}


// ? filters
limpiarFiltros() {
  this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoEgreso: null })
  this.dataSource = new MatTableDataSource(this.dataEgresos);
  this.dataSource.paginator = this.paginator.toArray()[0];
  this.selection.clear()
  this.totalSeleccion = 0;
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
