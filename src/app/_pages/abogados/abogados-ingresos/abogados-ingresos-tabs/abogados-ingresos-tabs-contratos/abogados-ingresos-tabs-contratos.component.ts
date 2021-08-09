import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbogadosTabsService } from '../../../abogados-tabs.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { Cliente } from '@app/_models/shared/cliente';
import { Contrato } from '../../../../../_models/abogados/contrato';

import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';

import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-abogados-ingresos-tabs-contratos',
  templateUrl: './abogados-ingresos-tabs-contratos.component.html',
  styleUrls: ['./abogados-ingresos-tabs-contratos.component.scss']
})
export class AbogadosIngresosTabsContratosComponent implements OnInit {

  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = new MatSort;

  // ? Inputs & Outputs
  @Input()
  refrescar = '';

  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'fechaContrato',
    'clienteRut',
    'cliente',
    'montoContrato',
    'estadoPago',
    'sucursal',
    'usuario'
  ];

  // Tabla en donde se almacenará los datos de la bd 
  dataSource: MatTableDataSource<Contrato> = new MatTableDataSource();
  dataContrato: Contrato[] = [];

  // Definir el formulario que permitirá aplicar los filtros
  formFilter = new FormGroup({
    id: new FormControl(),
    montoContrato: new FormControl(),
    rut: new FormControl(),
    cliente: new FormControl(),
    estadoPago: new FormControl(),
    sucursal: new FormControl(),
    usuario: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),    
  })

  sucursales: Sucursal[] = [];
  clientes: Cliente[] = [];
  selection = new SelectionModel<any>(true, []);
  totalSeleccion = 0;
  selectedRows!: any[];



  constructor(
    private abogadosTabsService: AbogadosTabsService,
    private sucursalService: SucursalSharedService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {

  }

  //Metodo que se ejecuta al abrir la página
  ngOnInit(): void {

    this.sucursales = this.sucursalService.sucursalListValue;
    this.clientes = this.abogadosTabsService.obtenerClientes();
    this.getContratos();
    this.aplicarfiltros();

  }

  // Obtener el listado de contratos desde la BD
  getContratos() {
    //Carga Tabla 
    this.abogadosTabsService.obtenerContratos().subscribe((result: Contrato[]) => {
      this.dataContrato = result.map(Contrato => {
        Contrato.sucursal = Contrato.Sucursal.razonSocial;
        Contrato.usuario = Contrato.Usuario.nombreUsuario;
        return Contrato;
      });
      this.dataSource = new MatTableDataSource(this.dataContrato);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort
    });

  }

  // ? selection rows
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // Metodo que sirve para la seleccion de un campo de la tabla
  masterToggle() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => {
        this.selection.select(row);

      });
    console.log(this.selection.selected);
  }

  // Filtros
  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {
      const { id, montoContrato } = res
      let dataFiltered = this.dataContrato;

      //Filtro Rut
      if (res.rut) {
        dataFiltered = dataFiltered.filter((data: any) => data.clienteRut == res.rut);
      }

      if (id) {
        dataFiltered = dataFiltered.filter((data: Contrato) => (data.id).toString().includes(id))
      }    
      if (montoContrato) {
        dataFiltered = dataFiltered.filter((data: Contrato) => (data.montoContrato).toString().includes(montoContrato))
      }
      //Filtro Cliente
      if (res.cliente) {
        dataFiltered = dataFiltered.filter((data: Contrato) => data.cliente == res.cliente);
      }

      //Filtro Fecha
      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: Contrato) => new Date(data.fechaContrato) >= res.start && new Date(data.fechaContrato) <= res.end);
      }

      //Filtro Estado Pago
      if (res.estadoPago) {
        dataFiltered = dataFiltered.filter((data: Contrato) => data.estadoPago == res.estadoPago);
      }

      //Filtro Sucursal
      if (res.sucursal) {
        dataFiltered = dataFiltered.filter((data: Contrato) => data.sucursal.includes(res.sucursal.toUpperCase()));
      }

      //Filtro Usuario
      if (res.usuario) {
        dataFiltered = dataFiltered.filter((data: Contrato) => data.usuario.includes(res.usuario));
      }

      if(res.montoContrato){
        dataFiltered = dataFiltered.filter((data: Contrato) => data.montoContrato == res.montoContrato);
      }


      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort;
      this.selection.clear();
    })
  }

  //Limpiar los filtros
  resetTable() {
    this.formFilter.patchValue({ start: null, end: null, rut: null, cliente: null, estadoPago: null, sucursal: null, usuario: null })
    this.dataSource = new MatTableDataSource(this.dataContrato);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort
    this.dataSource.paginator['_pageIndex'] = 0
    this.updateTable()
    this.selection.clear()
    this.totalSeleccion = 0
  }

  updateTable() {
    this.abogadosTabsService.obtenerContratos().subscribe((result: Contrato[]) => {
      this.dataContrato = result.map(Contrato => {
        Contrato.sucursal = Contrato.Sucursal.razonSocial;
        Contrato.usuario = Contrato.Usuario.nombreUsuario;
        return Contrato;
      });
      this.dataSource = new MatTableDataSource(this.dataContrato);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort

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
        const { Cliente, Causas, Sucursal, Usuario, ...newObject } = item
        return newObject
      })
    
    this.abogadosTabsService.exportAsExcelFile(newArray, 'Lista-Ingresos-Contratos-FirmaAbogados');

    }
  }
}
