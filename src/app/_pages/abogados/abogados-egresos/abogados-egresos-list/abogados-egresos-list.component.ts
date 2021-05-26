import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { RegistroEgresoFirma } from '@app/_models/abogados/egresosFirma';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { AbogadosService } from '@app/_pages/abogados/abogados.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ViewChild } from '@angular/core';
import { DatePipe } from "@angular/common";


@Component({
  selector: 'app-abogados-egresos-list',
  templateUrl: './abogados-egresos-list.component.html',
  styleUrls: ['./abogados-egresos-list.component.scss'],
  providers: [DatePipe]
})
export class AbogadosEgresosListComponent implements OnInit, OnChanges {


// ? childrens
@ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
@ViewChild('agGrid') agGrid!: AgGridAngular;

// ? Inputs & Outputs
@Input()
refrescar = '';

// DEFINIENDO LOS CAMPOS DE LA TABLA.
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

dataSource: MatTableDataSource<RegistroEgresoFirma> = new MatTableDataSource();
dataEgresos: RegistroEgresoFirma[] = [];

changelog: string[] = [];


//FILTROS
formFilter = new FormGroup({
  start: new FormControl(),
  end: new FormControl(),
  idSucursal: new FormControl(),
  tipoEgreso: new FormControl(),
  //numeroCuota: new FormControl(),
})


sucursales: Sucursal[] = [];
selection = new SelectionModel<RegistroEgresoFirma>(true, []);
tiposEgresos: string[] = [];
totalSeleccion = 0;
selectedRows!: any[];
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

// ACTUALIZAR CUANDO EL FORMULARIO ESTE CARGADO.

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
      //Conviertiendo los numeros de cuotas Nulos en N/A
      this.dataEgresos.forEach(data => {        
        if (data.numeroCuota== null) {
          data.numeroCuota = this.result;          
        }
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

//METODO QUE PERMITE EXPORTA A EXCEL
exportAsXLSX(): void {
  this.selectedRows = [];
  this.selection.selected.forEach((x) => this.selectedRows.push(x));
  this.abogadosService.exportAsExcelFile(this.selectedRows, 'Egresos-Abogados');
}


revelarTotal() {
  this.totalSeleccion = 0;  
  this.selection.selected.forEach(data => {
    this.totalSeleccion += data.monto;
  });
}


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


// LIMPIANDO LOS FILTROS
limpiarFiltros() {
  this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoEgreso: null })
  this.dataSource = new MatTableDataSource(this.dataEgresos);
  this.dataSource.paginator = this.paginator.toArray()[0];
  this.selection.clear()
  this.totalSeleccion = 0;
}



// SELECTOR DE FILAS
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

masterToggle() {
  this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.filteredData.forEach(row => {
      this.selection.select(row);
    });
}
}
