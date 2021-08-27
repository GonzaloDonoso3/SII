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
import { MatSnackBar } from '@angular/material/snack-bar';

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
    'responsable',
    'descripcion',
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
    id: new FormControl(),
    monto: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    tipoEgreso: new FormControl(),
    numeroCuota: new FormControl(),    
  })

  sucursales: Sucursal[] = [];
  selection = new SelectionModel<EgresoLubricentro>(true, []);
  selectedRows!: any[];
  tiposEgresos: string[] = [];
  totalSeleccion = 0;
  cuentasRegistradas: any[] = [];
  
  constructor(
    private lubricentroService: LubricentroService,
    public dialog: MatDialog,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
    private snackBar: MatSnackBar
  ) {
    this.sucursales = this.sucursalService.sucursalListValue;
    this.tiposEgresos = this.lubricentroService.tiposEgresosListValue;
  }

  ngOnInit(): void {
    this.aplicarfiltros();
    this.actualizarTabla()
  }



  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {
      const { id, monto } = res

      let dataFiltered = this.dataEgresos;

      if (id) {
        dataFiltered = dataFiltered.filter((data: EgresoLubricentro) => (data.id).toString().includes(id))
      }    
      if (monto) {
        dataFiltered = dataFiltered.filter((data: EgresoLubricentro) => (data.monto).toString().includes(monto))
      }
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
        this.lubricentroService.openDialogRegistrarPago(idEgresoPagoCuota);
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

  actualizarTabla(){
    this.lubricentroService.egresoGetAll().subscribe((data: EgresoLubricentro[]) => {
      this.dataEgresos = data.map(egreso => {
        egreso.sucursal = egreso.Sucursal.razonSocial;
        egreso.usuario = egreso.Usuario.nombreUsuario;
        return egreso;
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
    if(this.selection.selected.length == 0) {
      this.snackBar.open('!Seleccione algún registro!', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.selection.selected.forEach((x) => this.selectedRows.push(x));
        const newArray = this.selectedRows.map((item) => {
        const { RespaldoEgresoLubricentros, Usuario, Sucursal, ...newObject } = item
        return newObject
      })
    
    this.lubricentroService.exportAsExcelFile(newArray, 'Lista-Egresos-Rentacar');

    }
  }


}
