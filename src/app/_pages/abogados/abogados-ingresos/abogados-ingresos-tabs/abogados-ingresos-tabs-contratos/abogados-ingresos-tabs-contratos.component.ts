import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbogadosTabsService } from '../../../abogados-tabs.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { Cliente } from '@app/_models/shared/cliente';
import { Contrato } from '../../../../../_models/abogados/contrato';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { AgGridAngular } from 'ag-grid-angular';




@Component({
  selector: 'app-abogados-ingresos-tabs-contratos',
  templateUrl: './abogados-ingresos-tabs-contratos.component.html',
  styleUrls: ['./abogados-ingresos-tabs-contratos.component.scss']
})
export class AbogadosIngresosTabsContratosComponent implements OnInit {

  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  // ? Inputs & Outputs
  @Input()
  refrescar = '';

  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'rut',
    'cliente',
    'fecha',
    'monto',
    'estadoPago',
    'sucursal',
    'usuario'
  ];
  dataSource: MatTableDataSource<Contrato> = new MatTableDataSource();
  dataContrato: Contrato[] = [];

  formFilter = new FormGroup({
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
  ) {

  }

  ngOnInit(): void {

    this.sucursales = this.sucursalService.sucursalListValue;
    this.clientes = this.abogadosTabsService.obtenerClientes();
    this.getContratos();
    this.aplicarfiltros();

  }

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

  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {

      let dataFiltered = this.dataContrato;

      //Filtro Rut Falta
      if (res.rut) {
        dataFiltered = dataFiltered.filter((data: Contrato) => {
          try {
            return data.Cliente.rut.includes(res.rut)
          } catch (error) {
            return false;
          }
        });
      }

      //Filtro Cliente Falta
      if (res.cliente) {
        dataFiltered = dataFiltered.filter((data: Contrato) => {
          try {
            return data.cliente.includes(res.cliente.toUpperCase())
          } catch (error) {
            return false;
          }
        });
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


      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.selection.clear();
    })
  }

  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoEgreso: null, Propiedad: null, descripcionEgreso: null, })
    this.dataSource = new MatTableDataSource(this.dataContrato);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  }

  //Metodo exportar excel
  exportAsXLSX(): void {
    this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.abogadosTabsService.exportAsExcelFile(this.selectedRows, 'Lista-Contratos');
  }
}
