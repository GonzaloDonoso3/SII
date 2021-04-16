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
import { AbogadosIngresosAccionesComponent } from '../abogados-ingresos-acciones.component';
import { Empresa } from '@app/_models/shared/empresa';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { first } from 'rxjs/operators';
import { AbogadosService } from '../../../abogados.service';


@Component({
  selector: 'app-dialog-mostrar-contratos',
  templateUrl: './dialog-mostrar-contratos.component.html',
  styleUrls: ['./dialog-mostrar-contratos.component.scss']
})
export class DialogMostrarContratosComponent implements OnInit {
  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  nombreClienteLocal = localStorage.getItem("nombreCliente");
  idCliente = localStorage.getItem("idCliente");

  idEmpresa = 2;
  empresa = new Empresa();

    // ? table definitions.
    displayedColumns: string[] = [
      'select',
      'id',
      'rut',
      'fecha',
      'nContrato',
      'monto',
      'saldo',
      'estadoPago',
      'sucursal',
      'usuario'
    ];
    dataSource: MatTableDataSource<Contrato> = new MatTableDataSource();
    dataContrato: Contrato[] = [];
  
    formFilter = new FormGroup({
      rut: new FormControl(),
      start: new FormControl(),
      end: new FormControl(),
      nContrato: new FormControl(),
      estadoPago: new FormControl(),
      sucursal: new FormControl(),
      usuario: new FormControl(),
      
    })
  selection = new SelectionModel<any>(true, []);
  totalSeleccion = 0;
  selectedRows!: any[];
  

  constructor(
    private abogadosAcciones: AbogadosIngresosAccionesComponent,
    private abogadosTabsService: AbogadosTabsService,
    private empresaService: EmpresaSharedService,
    private abogadosService: AbogadosService
  ) { }

  ngOnInit(): void {
    this.getContratosCliente();
    this.aplicarfiltros();
    this.obtenerEmpresa(this.idEmpresa);
  }

  getContratosCliente(){
    //Carga Tabla 
    this.abogadosTabsService.obtenerContratosCliente(this.idCliente).subscribe((result: Contrato[]) => {
     this.dataContrato = result.map(Contrato => {
       Contrato.sucursal = Contrato.Sucursal.razonSocial;
       Contrato.usuario = Contrato.Usuario.nombreUsuario;
       
       return Contrato; 
     });
     this.dataSource = new MatTableDataSource(this.dataContrato);
     this.dataSource.paginator = this.paginator.toArray()[0];
     console.log(this.dataContrato);
   });
}

  desactivarTablaContratos(){
   this.abogadosAcciones.desactivarTablaContratos();
  }

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

      //Filtro N° Contrato
      if (res.nContrato) {
        dataFiltered = dataFiltered.filter((data: Contrato) => data.nContrato == res.nContrato);
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
        dataFiltered = dataFiltered.filter((data: Contrato) => data.sucursal == res.sucursal);
      }

      //Filtro Usuario
      if (res.usuario) {
        dataFiltered = dataFiltered.filter((data: Contrato) => data.usuario == res.usuario);
      }
      

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.selection.clear();
    })
  }

  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, sucursal: null, usuario: null, estadoPago: null, nContrato: null, })
    this.dataSource = new MatTableDataSource(this.dataContrato);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  }

  obtenerEmpresa(id: number): any {
    this.empresaService
      .getByIdWithSucursales(id)
      .pipe(first())
      .subscribe((x:any) => {
        x.Sucursals = Object.values(x.Sucursals);

        this.empresa = x;
      });
  }

   // Metodo exportar excel
   exportAsXLSX(): void {
    this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.abogadosTabsService.exportAsExcelFile(this.selectedRows, 'Lista-Contratos-Cliente');
  }

  // Abrir Ventanas Modal
  openDialogRegistrarPago(){
    this.abogadosService.openDialogRegistrarPago();
  }

  openDialogRepactarCuotas(){
    this.abogadosService.openDialogRepactarCuotas();
  }

}
