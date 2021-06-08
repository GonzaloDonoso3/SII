import { Component, OnInit, ViewChildren, QueryList, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbogadosTabsService } from '../../../abogados-tabs.service';
import { AbogadosService } from '../../../abogados.service';
import { MatPaginator } from '@angular/material/paginator';
import { Cuota } from '../../../../../_models/abogados/cuota';
import { Contrato } from '../../../../../_models/abogados/contrato';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog } from '@angular/material/dialog';
import { PagoEstado } from '../../../../../_models/rentacar/responseListaArriendos';


@Component({
  selector: 'app-dialog-registrar-pago',
  templateUrl: './dialog-registrar-pago.component.html',
  styleUrls: ['./dialog-registrar-pago.component.scss']
})
export class DialogRegistrarPagoComponent implements OnInit {

    // ? childrens
    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

    // ? table definitions.
    displayedColumns: string[] = [
      'select',
      'id',
      'fecha',
      'monto',
      'estadoPago'
    ];
    dataSource: MatTableDataSource<Contrato> = new MatTableDataSource();
    dataContrato: Contrato[] = [];

    idContrato = localStorage.getItem("idContratoPago");
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
  ) { }

  ngOnInit(): void {
    this.getContratosCliente();
    this.aplicarfiltros();
  }

//obtener los contratos del cliente
  getContratosCliente(){
    //Carga Tabla 
    this.abogadosTabsService
    .obtenerContratoNumero(this.idContrato)
    .pipe()
    .subscribe((x: any) => {
     this.dataSource = new MatTableDataSource(x.CuotasContratos);
     this.dataSource.paginator = this.paginator.toArray()[0];
     this.dataContrato = x.CuotasContratos;
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
    console.log(this.selection.selected);
  }

  //Metodo que permite procesar pago
  procesarPago(){
    //Esto abre un dialog que permite subir un archivo
   const dialogRef = this.dialog.open(DialogRespaldosComponent, {
      data: { url: 'cuotasContrato/upload' }
    });
    //Despues de subir el archivo se ejecuta esto
    dialogRef.afterClosed().subscribe(result => {
      //Se declaran las variables que se usaran para subir el respaldo
      let respaldo = {};
      const arrayRespaldos: {}[] = [];
      const respuesta = result;
      let idCuota: string;
      let cuota: any;

      //Se captura la id de la fila seleccionada en la tabla
      this.selectedRows = [];
      this.selection.selected.forEach((x) => this.selectedRows.push(x));
      this.selectedRows.forEach((x) => {
        idCuota = x.id;
        cuota = x;
      });
      //Se guardan los datos en las variables creada
      respuesta.forEach((resp: any) => {
        respaldo = { idCuotaFirma: idCuota, url: resp };
        arrayRespaldos.push(respaldo);
      });

      //Se le agrega el respaldo al pago seleccionado
      this.abogadosTabsService.agregarRespaldos(arrayRespaldos).subscribe(
        () => {
          this.pagarCuota(idCuota, cuota);
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  //Metodo que permite realizar el pago de la cuota
  pagarCuota(idCuota: string, cuota:any): void {
    const body = { idCuota };
    this.abogadosTabsService
      .registrarPago(body)
      .pipe()
      .subscribe((x:any) => {
        this.abogadosTabsService
          .obtenerContratoNumero(this.idContrato)
          .pipe()
          .subscribe((x:any) => {
            this.dataSource = new MatTableDataSource(x.CuotasContratos);
            this.dataSource.paginator = this.paginator.toArray()[0];
            this.abogadosService.closeDialogModal();
          });
      });
  }

  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {

      let dataFiltered = this.dataContrato;
      console.log(this.dataContrato);

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
}
