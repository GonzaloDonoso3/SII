import { Component, OnInit, ViewChildren, QueryList, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbogadosTabsService } from '@app/_pages/abogados/abogados-tabs.service';
import { AbogadosService } from '@app/_pages/abogados/abogados.service';
import { MatPaginator } from '@angular/material/paginator';
import { Cuota } from '../../../../../_models/abogados/cuota';
import { Contrato } from '../../../../../_models/abogados/contrato';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog } from '@angular/material/dialog';
import { PagoEstado } from '../../../../../_models/rentacar/responseListaArriendos';
import { ImportadoraService } from '../../../importadora.service';

@Component({
  selector: 'app-dialog-neumaticos',
  templateUrl: './dialog-neumaticos.component.html',
  styleUrls: ['./dialog-neumaticos.component.scss']
})
export class DialogNeumaticosComponent implements OnInit {


    // ? childrens
    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

    // ? table definitions.
    displayedColumns: string[] = [
      'select',
      //'totalTipoNeumatico',
      'id',
      'neumatico',
      'cantidad',
      'conteiner',
      'costoNeumatico',
      'comision',
      'interior',
      'maritimo',
      'portuario',
      'seguros',
      'unitario',
      'total',
      'totalVenta',
      'ganancia',
      'botones'      
    ];
    dataSource: MatTableDataSource<Contrato> = new MatTableDataSource();
    dataContrato: Contrato[] = [];

    idConteiner = 0;
    nombreClienteLocal = localStorage.getItem("nombreCliente");
    idCuota : any;
    cuota: any;
    
  // Variables que ayudan a aplicar los filtros
    formFilter = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
      estadoPago: new FormControl(),
    })
  
    selection = new SelectionModel<any>(true, []);
    totalSeleccion = 0;
    selectedRows!: any[];

  constructor(
    private abogadosTabsService: AbogadosTabsService,
    private abogadosService: AbogadosService,
    public dialog: MatDialog,
    private importadoraService: ImportadoraService
  ) { }

  ngOnInit(): void {
    this.getConteiner();
    this.aplicarfiltros();
  }

//obtener los contratos del cliente
  getConteiner(){
    this.idConteiner = Number(localStorage.getItem("idConteiner"));
    //Carga Tabla 
    this.importadoraService
    .getConteinerById(this.idConteiner)
    .pipe()
    .subscribe((x: any) => {
     this.dataSource = new MatTableDataSource(x.EgresoNeumaticoImportadoras);
     this.dataSource.paginator = this.paginator.toArray()[0];
     this.dataContrato = x.EgresoNeumaticoImportadoras;     
   });
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
  }

  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {

      let dataFiltered = this.dataContrato;      

      //Filtro Fecha
      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: any) => new Date(data.fechaPago) >= res.start && new Date(data.fechaPago) <= res.end);
      }
      
      //Filtro Estado Pago
      if (res.estadoPago) {
        dataFiltered = dataFiltered.filter((data: any) => data.estado == res.estadoPago);
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.selection.clear();
    })
  }

  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, estadoPago: null})
    this.dataSource = new MatTableDataSource(this.dataContrato);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  }

   // Cerrar Dialog
   closeDialog(){
    this.abogadosService.closeDialogModal();
   }

    //Metodo exportar excel
  exportAsXLSX(): void {
    this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.importadoraService.exportAsExcelFile(this.selectedRows, 'Lista-Neumaticos-Conteiner-Importadora');
    }
    
    //Abrir Modal Editar  
  openDialogEdit(){      
  //Selecciona los valores de la fila seleccionada
  this.selectedRows = [];
  this.selection.selected.forEach((x) => this.selectedRows.push(x));
  this.selectedRows.forEach((x) => {
    localStorage.setItem("idConteiner", x.id);
  });
  //Se ejecuta el metodo que abre el dialog, enviandole le id del contrato
  let idConteiner = localStorage.getItem("idConteiner");  
  this.importadoraService.openDialogEditContainerN(idConteiner);
}

openDialogEdit2
  ( id: any, 
    neumatico: any, 
    cantidad: any,
    conteiner: any,
    costoNeumatico: any,
    comision: any,
    interior: any,
    maritimo: any,
    portuario: any,
    seguros: any,
    unitario: any,
    total: any,
    totalVenta: any,
    ganancia: any){
  localStorage.setItem("idContainerEdit", id);
  localStorage.setItem("neumaticoEdit", neumatico);
  localStorage.setItem("cantidadEdit", cantidad);
  localStorage.setItem("conteinerEdit", conteiner);
  localStorage.setItem("costoNeumaticoEdit", costoNeumatico);
  localStorage.setItem("comisionEdit", comision);
  localStorage.setItem("interiorEdit", interior);
  localStorage.setItem("maritimoEdit", maritimo);
  localStorage.setItem("portuarioEdit", portuario);
  localStorage.setItem("segurosEdit", seguros);
  localStorage.setItem("unitarioEdit", unitario);
  localStorage.setItem("totalEdit", total);
  localStorage.setItem("totalVentaEdit", totalVenta);
  localStorage.setItem("gananciaEdit", ganancia);
  this.importadoraService.openDialogEditContainer();
}

}
