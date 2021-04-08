import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbogadosTabsService } from '../../../abogados-tabs.service';
import { Cliente } from '../../../../../_models/abogados/cliente';
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
  dataSource: MatTableDataSource<Cliente> = new MatTableDataSource();
  dataCliente: any;

  changelog: string[] = [];

  rutFilter = new FormGroup({
    rut: new FormControl(),
  });
  nombreFilter = new FormGroup({
    nombre: new FormControl(),
  });
  telefonoFilter = new FormGroup({
    telefono: new FormControl(),
  });
  emailFilter = new FormGroup({
    email: new FormControl(),
  });
  direccionFilter = new FormGroup({
    direccion: new FormControl(),

  });
  sucursales: Sucursal[] = [];
  selection = new SelectionModel<Cliente>(true, []);
  tiposIngresos: string[] = [];
  estadosPagos: string[] = [];
  totalSeleccion = 0;
  cuentasRegistradas: any[] = [];


  constructor(
    private abogadosTabsService: AbogadosTabsService,
    public dialog: MatDialog,
  ) { 
    
  }

  ngOnInit(): void {
    this.getClientes();

    this.rutFilter.valueChanges.subscribe(res => {
      this.applyRutFilter(res.rut);
    });

    this.nombreFilter.valueChanges.subscribe(res => {
      this.applyNombreFilter(res.nombre);
    });

    this.telefonoFilter.valueChanges.subscribe(res => {
      this.applyTelefonoFilter(res.telefono);
    });

    this.emailFilter.valueChanges.subscribe(res => {
      this.applyEmailFilter(res.email);
    });

    this.direccionFilter.valueChanges.subscribe(res => {
      this.applyDireccionFilter(res.direccion);
    });
  }

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
  limpiarFiltros() {
    this.dataSource = new MatTableDataSource(this.dataCliente);
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyRutFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
      if (!data.rut === null) {
        return data.rut.startsWith(filter);
      } else {
        return data.rut === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyNombreFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
      if (!data.nombre === null) {
        return data.nombre.startsWith(filter);
      } else {
        return data.nombre === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyTelefonoFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
      if (!data.fono === null) {
        return data.fono.startsWith(filter);
      } else {
        return data.fono === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyEmailFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
      if (!data.email === null) {
        return data.email.startsWith(filter);
      } else {
        return data.email === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyDireccionFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
      if (!data.direccion === null) {
        return data.direccion.startsWith(filter);
      } else {
        return data.direccion === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  

  recuperarArchivos(listArchivos: any) {
    this.dialog.open(DialogDownloadsComponent, {

      data: { archivos: listArchivos, servicio: 'inmobiliaria-ingreso' },

    });
  }
}
