import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { RentacarService } from '../../rentacar.service';
import { EgresosRentacar } from '@app/_models/rentacar/egresoRentacar';
import { MatDialog } from '@angular/material/dialog';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { first } from 'rxjs/operators';
import { Empresa } from '@app/_models/shared/empresa';

import { CalendarOptions } from '@fullcalendar/angular';
import { DatePipe } from "@angular/common";


@Component({
  selector: 'app-rentacar-egresos-list',
  templateUrl: './rentacar-egresos-list.component.html',
  styleUrls: ['./rentacar-egresos-list.component.scss'],
  providers: [DatePipe]
})
export class RentacarEgresosListComponent implements OnInit {

  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = null;


  // ? Inputs & Outputs
  @Input() refrescar = '';

  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'respaldos',
    'fecha',
    'monto',
    'tipoEgreso',
    'descripcionEgreso',
    'sucursal',
    'usuario',
    'responsable',
    'numeroCuota'
  ];

  result = "N/A";
  resultAsNumber = parseFloat(this.result); 
  

  //Creación de variables y asignación de datos
  dataSource: MatTableDataSource<EgresosRentacar> = new MatTableDataSource();
  dataEgresos: EgresosRentacar[] = [];


  changelog: string[] = [];

  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    descripcionEgreso: new FormControl(),
    tipoEgreso: new FormControl(),
    usuario: new FormControl(),
    responsable: new FormControl(),
    numeroCuota: new FormControl(),
  })



  empresa = new Empresa();
  idEmpresa = 4;
  sucursales: Sucursal[] = [];
  selection = new SelectionModel<EgresosRentacar>(true, []);
  tiposEgresos: string[] = [];
  estadosPagos: string[] = [];
  totalSeleccion = 0;
  cuentasRegistradas: any[] = [];
  selectedRows!: any[];

  constructor(
    private rentacarService: RentacarService,
    public dialog: MatDialog,
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
  ) { }
  
   
  ngOnInit(): void {
    this.getEgresos();
    this.getEmpresa(this.idEmpresa);
    this.aplicarfiltros();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.refrescar);
    this.getEgresos();
    this.aplicarfiltros();
  }

  getEgresos() {    
    this.rentacarService.getAllEgresos().subscribe((egresos: EgresosRentacar[]) => {            
      this.dataEgresos = egresos.map(Egresos => {
        Egresos.sucursal = Egresos.Sucursal.razonSocial;
        Egresos.usuario = Egresos.Usuario.nombreUsuario;
        return Egresos;
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
    this.formFilter.valueChanges.subscribe(res => {

      let dataFiltered = this.dataEgresos;

      if (res.descripcionEgreso) {
        dataFiltered = dataFiltered.filter((data: EgresosRentacar) => data.descripcion.includes(res.descripcionEgreso));
      }

      if (res.tipoEgreso) {
        dataFiltered = dataFiltered.filter((data: EgresosRentacar) => data.tipoEgreso == res.tipoEgreso);
      }

      if (res.idSucursal) {
        dataFiltered = dataFiltered.filter((data: EgresosRentacar) => data.Sucursal.razonSocial == res.idSucursal);
      }

      if (res.usuario) {
        dataFiltered = dataFiltered.filter((data: EgresosRentacar) => data.usuario.trim() == res.usuario);
      }

      if (res.responsable) {
        dataFiltered = dataFiltered.filter((data: EgresosRentacar) => data.responsable.trim() == res.responsable);
      }

      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: EgresosRentacar) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.dataSource.sort = this.sort;
      this.selection.clear();

    })
  }


  // Inicio Filtros
  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoEgreso: null, responsable: null, descripcionEgreso: null, usuario: null, numeroCuota: null })
    this.dataSource = new MatTableDataSource(this.dataEgresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort;
    this.selection.clear()
    this.totalSeleccion = 0;
  }

  //Cargar los archivos de respaldo
  recuperarArchivos(listArchivos: any) {
    this.dialog.open(DialogDownloadsComponent, {
      data: { archivos: listArchivos, servicio: 'rentacar-egreso' },
    });
  }

  //Metodo exportar excel
  exportAsXLSX(): void {
    this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.rentacarService.exportAsExcelFile(this.selectedRows, 'Lista-Egresos-Rentacar');
  }

  }
