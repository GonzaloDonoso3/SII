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
      'id',
      'neumatico',
      'unitarioChino',
      'totalTipoNeumatico',            
      'cantidad',
      'conteiner',      
      'comision',
      'interior',
      'maritimo',
      'portuario',
      'seguros',
      'unitario',
      'total',
      'ganancia',
      'costoNeumatico',
      'totalVenta',      
      'utilidad', 
      'botones'      
    ];

    displayedTotalColumns: string[] = ['item', 'cost'];
    
    dataSource: MatTableDataSource<Contrato> = new MatTableDataSource();
    dataContrato: Contrato[] = [];

    idConteiner = 0;
    nombreClienteLocal = localStorage.getItem("nombreCliente");
    idCuota : any;
    cuota: any;
    sumaUnitarioC: number = 0 ;
    sumaUnitarioTC: number = 0 ;
    sumaCantidad: number = 0 ;
    sumaConteiner: number = 0 ;
    sumaComision: number = 0 ;
    sumaInterior: number = 0 ;
    sumaMaritimo: number = 0 ;
    sumaPortuario: number = 0 ;
    sumaSeguros: number = 0 ;
    sumaCostoU: number = 0 ;
    sumaCostoTU: number = 0 ;
    sumaGanancia: number = 0 ;
    sumaUnitarioV: number = 0 ;
    sumaUnitarioTV: number = 0 ;
    sumaUtilidad: number = 0 ;
    
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

    calculation(e: any) {    
    let sumCantidad: number = 0;
    let sumUnitarioC: number = 0;
    let sumUnitarioTC: number = 0;
    let sumConteiner: number = 0;
    let sumComisión: number = 0;
    let sumInterior: number = 0;
    let sumMaritimo: number = 0;
    let sumPortuario: number = 0 ;
    let sumSeguros: number = 0 ;
    let sumCostoU: number = 0 ;
    let sumCostoTU: number = 0 ;
    let sumGanancia: number = 0 ;
    let sumUnitarioV: number = 0 ;
    let sumUnitarioTV: number = 0 ;
    let sumUtilidad: number = 0 ;
    if (e)
      for (let row of e.data) {
        if (row.id != 0) sumCantidad += row.cantidad;
        if (row.id != 0) sumUnitarioC += row.unitarioChino;
        if (row.id != 0) sumUnitarioTC += row.totalTipoNeumatico;
        if (row.id != 0) sumConteiner += row.pContainer;
        if (row.id != 0) sumComisión += row.costoComision;
        if (row.id != 0) sumInterior += row.costoInterior;
        if (row.id != 0) sumMaritimo += row.costoMaritimo;
        if (row.id != 0) sumPortuario += row.impuestoProntuario;
        if (row.id != 0) sumSeguros += row.seguros;
        if (row.id != 0) sumCostoU += row.valorUnitario;
        if (row.id != 0) sumCostoTU += row.montoTotal;
        if (row.id != 0) sumGanancia += row.pGanancia;
        if (row.id != 0) sumUnitarioV += row.costoNeumatico;
        if (row.id != 0) sumUnitarioTV += row.totalVenta;
        if (row.id != 0) sumUtilidad -= row.utilidad;        
      }
      this.sumaCantidad = sumCantidad;
      this.sumaUnitarioC = sumUnitarioC;
      this.sumaUnitarioTC = sumUnitarioTC;
      this.sumaConteiner = sumConteiner;
      this.sumaComision = sumComisión;
      this.sumaInterior = sumInterior;
      this.sumaMaritimo = sumMaritimo;
      this.sumaPortuario = sumPortuario;
      this.sumaSeguros = sumSeguros;
      this.sumaCostoU = sumCostoU;
      this.sumaCostoTU = sumCostoTU;
      this.sumaGanancia = sumGanancia;
      this.sumaUnitarioV = sumUnitarioV;
      this.sumaUnitarioTV = sumUnitarioTV;
      this.sumaUtilidad = sumUtilidad;
    //return sum;
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
     this.calculation(this.dataSource);
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
    this.importadoraService.closeDialogModal();
   }

    //Metodo exportar excel
  exportAsXLSX(): void {
    this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.importadoraService.exportAsExcelFile(this.selectedRows, 'Lista-Neumaticos-Conteiner-Importadora');
    }
    

openDialogEdit2
  ( 
    id: any, 
    unitarioChino: any,
    totalTipoNeumatico: any,
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
    ganancia: any,
    utilidad: any){
  localStorage.setItem("idContainerEdit", id);  
  localStorage.setItem("unitarioChinoEdit", unitarioChino);  
  localStorage.setItem("totalTipoNeumaticoEdit", totalTipoNeumatico);  
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
  localStorage.setItem("utilidadEdit", utilidad);  
  this.importadoraService.openDialogEditContainer();
}

}
