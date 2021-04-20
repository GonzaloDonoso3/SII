import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbogadosTabsService } from '../../../abogados-tabs.service';
import { Cliente } from '../../../../../_models/shared/cliente';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';



@Component({
  selector: 'app-abogados-ingresos-tabs-clientes',
  templateUrl: './abogados-ingresos-tabs-clientes.component.html',
  styleUrls: ['./abogados-ingresos-tabs-clientes.component.scss']
})
export class AbogadosIngresosTabsClientesComponent implements OnInit {

   // ? childrens
   @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  // ? Inputs & Outputs
  @Input()
  refrescar = '';

  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'rut',
    'nombre',
    'telefono',
    'email',
    'direccion'
  ];

  // Tabla en donde se almacenará los datos de la bd 
  dataSource: MatTableDataSource<Cliente> = new MatTableDataSource();
  dataCliente: Cliente[] = [];

  // Definir el formulario que permitirá aplicar los filtros
  formFilter = new FormGroup({
    rut: new FormControl(),
    nombre: new FormControl(),
    telefono: new FormControl(),
    email: new FormControl(),
    direccion: new FormControl(),

  })


  sucursales: Sucursal[] = [];
  selection = new SelectionModel<Cliente>(true, []);
  totalSeleccion = 0;
  selectedRows!: any[];


  constructor(
    private abogadosTabsService: AbogadosTabsService,
    public dialog: MatDialog,
  ) { 
    
  }

  ngOnInit(): void {
    this.getClientes();
    this.aplicarfiltros();
  }

  // Obtener el listado de cliente desde la BD
  getClientes(){
       //Carga Tabla 
       this.abogadosTabsService.obtenerClientes().subscribe((Cliente: Cliente[]) => {
        this.dataCliente = Cliente.map(Cliente => {
          return Cliente;
        });
        this.dataSource = new MatTableDataSource(this.dataCliente);
        this.dataSource.paginator = this.paginator.toArray()[0];
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

      let dataFiltered = this.dataCliente;

      //Filtro Rut
      if (res.rut) {
        dataFiltered = dataFiltered.filter((data: Cliente) => data.rut == res.rut);
      }

      //Filtro Nombre
      if (res.nombre) {
        dataFiltered = dataFiltered.filter((data: Cliente) => data.nombre == res.nombre);
      }

      //Filtro Telefono
      if (res.telefono) {
        dataFiltered = dataFiltered.filter((data: Cliente) => data.fono == res.telefono);
      }
      
      //Filtro Email
      if (res.email) {
        dataFiltered = dataFiltered.filter((data: Cliente) => data.email == res.email);
      }

      //Filtro Dirección
      if (res.direccion) {
        dataFiltered = dataFiltered.filter((data: Cliente) => data.direccion == res.direccion);
      }
      

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.selection.clear();
    })
  }

  //Limpiar los filtros
  limpiarFiltros() {
    this.formFilter.patchValue({ rut: null, nombre: null, telefono: null, email: null, direccion: null})
    this.dataSource = new MatTableDataSource(this.dataCliente);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  }
  
  //Metodo exportar excel
  exportAsXLSX(): void {
    this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.abogadosTabsService.exportAsExcelFile(this.selectedRows, 'Lista-Clientes');
  }
}
