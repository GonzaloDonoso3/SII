import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren, ViewChild } from '@angular/core';
import { DatePipe } from "@angular/common";
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EgresoAgroFirma } from '@app/_models/agroFirma/egresoAgroFirma';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { ProyectoAgrofirma } from '@app/_models/agroFirma/proyectoAgroFirma';
import { AgroFirmaService } from '@app/_pages/agroFirma/agro-firma.service';
import { MatDialog } from '@angular/material/dialog';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { DialogDownloadsComponent, DialogShow } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-agro-firma-egresos-list',
  templateUrl: './agro-firma-egresos-list.component.html',
  styleUrls: ['./agro-firma-egresos-list.component.scss'],
  providers: [DatePipe]
})
export class AgroFirmaEgresosListComponent implements OnInit {
  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = null;

  // ? Inputs & Outputs
  @Input() updateTable!: number
  @Input() projectId!: Observable<number>

  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'fecha',
    'proyecto',
    'monto',
    'tipoEgreso',    
    'descripcion',    
    'numeroCuota',
    'respaldos',
  ];


  result = "N/A"; 
  idProyecto = null;
  urlTree!: any;
  proyecto : any = '0';  

  dataSource: MatTableDataSource<EgresoAgroFirma> = new MatTableDataSource();
  dataEgresos: EgresoAgroFirma[] = [];

  changelog: string[] = [];


  //filtros
  formFilter = new FormGroup({
    id: new FormControl(),
    monto: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    idProyecto: new FormControl(),
    proyecto: new FormControl(),
    descripcion: new FormControl(),
    tipoEgreso: new FormControl(),
    numeroCuota: new FormControl(),
  })


  sucursales: Sucursal[] = [];
  proyectos: ProyectoAgrofirma[] = [];
  selection = new SelectionModel<EgresoAgroFirma>(true, []);
  tiposEgresos: string[] = [];
  selectedRows!: any[];
  totalSeleccion = 0;
  cuentasRegistradas: any[] = [];

  constructor(
    private agroFirmaService: AgroFirmaService,
    public dialog: MatDialog,
    private sucursalService: SucursalSharedService,
    private snackBar: MatSnackBar
  ) {
    this.sucursales = this.sucursalService.sucursalListValue;    
    this.tiposEgresos = this.agroFirmaService.tiposEgresosListValue;         
  }

  ngOnInit(): void {
    this.proyecto = localStorage.getItem("proyectoID");
    this.aplicarfiltros();
    this.actualizarTabla();
  }
 

    ngOnChanges(changes: SimpleChanges){
      if(changes.updateTable !== undefined) {
        if(!changes.updateTable.firstChange) {
          this.actualizarTabla()
        }
      }
      if(changes.projectId !== undefined) {
        if(!changes.projectId.firstChange) {
          this.actualizarTabla()
        }
      }
    }

    actualizarTabla(){                                                      
      this.agroFirmaService.getIncomeByProject(Number(this.projectId)).subscribe((data: EgresoAgroFirma[]) => {        
        this.dataEgresos = data.map(egreso => {                    
          return egreso;
        });
        //Conviertiendo los numeros de cuotas Nulos en N/A
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
  
    recuperarArchivos(listArchivos: any) {          
      this.dialog.open(DialogShow, { 
        data: { archivos: listArchivos, servicio: 'agroFirma-egreso' },
      });
    }
    
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
          this.agroFirmaService.openDialogRegistrarPago(idEgresoPagoCuota);
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

    //METODO QUE PERMITE EXPORTA A EXCEL
    
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
          const { idCuentaProyecto, idUsuario, idProyecto, ProyectoAgrofirma, RespaldoEgresos, ...newObject } = item
          return newObject
        })
      
      this.agroFirmaService.exportAsExcelFile(newArray, 'Lista-Ingresos-Contratos-FirmaAbogados');
  
      }
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
        const { id, monto, start, end } = res
        let dataFiltered = this.dataEgresos;  
        
        if (res.id) {
          dataFiltered = dataFiltered.filter((data: EgresoAgroFirma) => (data.id).toString().includes(id))
        }    
        if (res.monto) {
          dataFiltered = dataFiltered.filter((data: EgresoAgroFirma) => (data.monto).toString().includes(monto))
        }
  
        if (res.idSucursal) {
          dataFiltered = dataFiltered.filter((data: EgresoAgroFirma) => data.sucursal == res.idSucursal);
        }
  
        if (res.tipoEgreso) {
          dataFiltered = dataFiltered.filter((data: EgresoAgroFirma) => data.tipoEgreso == res.tipoEgreso);
        }
  
        if (res.start && res.end) {
          dataFiltered = dataFiltered.filter((data: EgresoAgroFirma) => new Date(data.fecha) >= start && new Date(data.fecha) <= end);        
        }
  
        this.dataSource = new MatTableDataSource(dataFiltered);
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort;
        this.selection.clear();
      })
    }
  
  
    // ? filters
    limpiarFiltros() {
      this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoEgreso: null })
      this.dataSource = new MatTableDataSource(this.dataEgresos);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator['_pageIndex'] = 0;
      this.actualizarTabla();
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
