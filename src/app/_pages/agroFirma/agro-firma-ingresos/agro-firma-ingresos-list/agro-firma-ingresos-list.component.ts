import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren, ViewChild } from '@angular/core';
import { DatePipe } from "@angular/common";
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IngresoAgroFirma } from '@app/_models/agroFirma/ingresoAgroFirma';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { ProyectoAgrofirma } from '@app/_models/agroFirma/proyectoAgroFirma';
import { AgroFirmaService } from '@app/_pages/agroFirma/agro-firma.service';
import { MatDialog } from '@angular/material/dialog';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-agro-firma-ingresos-list',
  templateUrl: './agro-firma-ingresos-list.component.html',
  styleUrls: ['./agro-firma-ingresos-list.component.scss'],
  providers: [DatePipe]
})

export class AgroFirmaIngresosListComponent implements OnInit {
  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = null;

  // ? Inputs & Outputs
  @Input()
  refrescar = '';
  // Input Decorator para obtener el id del proyecto seleccionado desde el componente padre
  @Input() idProyecto!: Observable<number>
  
  // ? table definitions.
  displayedColumns: string[] = [
    'id',
    'fecha',
    'proyecto',
    'tipoIngreso',
    'monto',
    'descripcionIngreso',
    'nAutorizacion',    
    'nDocumento',
    'estadoPago'
  ];


  result = "N/A"; 
  
  urlTree!: any;
  proyecto : any = '0';  

  dataSource: MatTableDataSource<IngresoAgroFirma> = new MatTableDataSource();
  dataIngresos: IngresoAgroFirma[] = [];

  changelog: string[] = [];


  //filtros
  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    idProyecto: new FormControl(),
    proyecto: new FormControl(),
    descripcionIngreso: new FormControl(),
    tipoEgreso: new FormControl(),
    numeroCuota: new FormControl(),
  })


  sucursales: Sucursal[] = [];
  proyectos: ProyectoAgrofirma[] = [];
  selection = new SelectionModel<IngresoAgroFirma>(true, []);
  tipoIngreso: any[] = [];
  selectedRows!: any[];
  totalSeleccion = 0;
  cuentasRegistradas: any[] = [];

  constructor(
    private agroFirmaService: AgroFirmaService,
    public dialog: MatDialog,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
  ) {
    this.sucursales = this.sucursalService.sucursalListValue;    
    //this.proyectos = this.agroFirmaService.proyectosListValue;  
    this.tipoIngreso = [{nombre: "EFECTIVO"}, {nombre: "CHEQUE"}, {nombre: "TRANSFERENCIA"}]       
  }

  ngOnInit(): void {}
 
    ngOnChanges(changes: SimpleChanges) {
      this.actualizarTabla()
    }

    actualizarTabla(){                                                   
      this.agroFirmaService.obtenerIngresosPorProyecto(Number(this.idProyecto)).subscribe((data: IngresoAgroFirma[]) => {     
        this.dataSource = new MatTableDataSource(data);        
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort;
      });

    }
  
    recuperarArchivos(listArchivos: any) {    
      this.dialog.open(DialogDownloadsComponent, {
        data: { archivos: listArchivos, servicio: 'agroFirma-egreso' },
      });
    }
    
    //METODO QUE PERMITE EXPORTA A EXCEL
    exportAsXLSX(): void {
    this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.agroFirmaService.exportAsExcelFile(this.selectedRows, 'Egresos-Abogados');
    }

  
    revelarTotal() {    
      this.totalSeleccion = 0;
      console.log(this.selection.selected.length);
      this.selection.selected.forEach(data => {
        this.totalSeleccion += data.monto;
      });
    }
  
  
    aplicarfiltros() {
    /*   this.formFilter.valueChanges.subscribe(res => {

        let dataFiltered = this.dataEgresos;      

        if (res.idSucursal) {
          dataFiltered = dataFiltered.filter((data: IngresoAgroFirma) => data.sucursal == res.idSucursal);
        }

        if (res.tipoEgreso) {
          dataFiltered = dataFiltered.filter((data: IngresoAgroFirma) => data.tipoEgreso == res.tipoEgreso);
        }

        if (res.start && res.end) {
          dataFiltered = dataFiltered.filter((data: IngresoAgroFirma) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);        
        }

        this.dataSource = new MatTableDataSource(dataFiltered);
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort;
        this.selection.clear();
      }) */
    }
  
  
    // ? filters
    limpiarFiltros() {
      /* this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoEgreso: null })
      this.dataSource = new MatTableDataSource(this.dataEgresos);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator['_pageIndex'] = 0;
      this.actualizarTabla();
      this.selection.clear()
      this.totalSeleccion = 0; */
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

