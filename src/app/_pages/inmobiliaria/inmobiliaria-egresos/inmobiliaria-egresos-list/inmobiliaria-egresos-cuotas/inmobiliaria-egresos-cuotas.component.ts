import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EgresoInmobiliariaCuota } from '../../../../../_models/inmobiliaria/egresoInmobiliariaCuota';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InmobiliariaService } from '@app/_pages/inmobiliaria/inmobiliaria.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogShow } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { AlertHelper } from '@app/_helpers/alert.helper';

@Component({
  selector: 'app-inmobiliaria-egresos-cuotas',
  templateUrl: './inmobiliaria-egresos-cuotas.component.html',
  styleUrls: ['./inmobiliaria-egresos-cuotas.component.scss']
})
export class InmobiliariaEgresosCuotasComponent implements OnInit {

  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = null;
  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'fecha',
    'monto',    
    'estadoCuota',
    'numeroCuota',
    'respaldos',
    'acciones'
  ];
  dataSource: MatTableDataSource<EgresoInmobiliariaCuota> = new MatTableDataSource();  
  dataCuota: EgresoInmobiliariaCuota[] = [];

  idEgreso = localStorage.getItem('idEgresoPago')
  idCuota : any;
  cuota: any;
  monto: any; 
  estadoCuota: any;

  // Variables que ayudan a aplicar los filtros
  formFilter = new FormGroup({    
    start: new FormControl(),    
    end: new FormControl(),
    estadoCuota: new FormControl(),
    numeroCuota: new FormControl(),
  })

  selection = new SelectionModel<any>(true, []);
  totalSeleccion = 0;
  selectedRows!: any[];

  constructor(
    private fb: FormBuilder,
    private inmobiliariaService: InmobiliariaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private alert: AlertHelper
  ) { }

  ngOnInit(): void {
    this.obtenerCuotas();
    this.aplicarfiltros();
  }

  obtenerCuotas(){
    this.inmobiliariaService.getCuotas(this.idEgreso)
    .pipe()
    .subscribe((x:any) => {      
      this.dataSource = new MatTableDataSource(x);
      this.dataSource.sort
      this.dataSource.paginator = this.paginator.toArray()[0];      
      this.dataCuota = x;
    })
  }

  //Metodo que permite procesar pago
  procesarPago(){
    this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));      
      this.selectedRows.forEach((x) => {                                
        this.estadoCuota = x.estadoCuota;        
      });
    
      if(this.estadoCuota == "Pagado"){
        this.snackBar.open('Este egreso ya fue pagado', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',          
        });      
      }else{

    //Esto abre un dialog que permite subir un archivo
   const dialogRef = this.dialog.open(DialogRespaldosComponent, {
      data: { url: 'egresoInmobiliariaCuota/upload' }
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
      //this.selectedRows = [];
      this.selection.selected.forEach((x) => this.selectedRows.push(x));      
      this.selectedRows.forEach((x) => {        
        idCuota = x.id;
        cuota = x;
        this.monto = x.monto;
        this.estadoCuota = x.estadoCuota;        
      });
      //Se guardan los datos en las variables creada
      respuesta.forEach((resp: any) => {
        respaldo = { idEgresoCuota: idCuota, url: resp, id: this.idEgreso, monto: this.monto };        
        arrayRespaldos.push(respaldo);        
      });
      

      //Se le agrega el respaldo al pago seleccionado
      this.inmobiliariaService.agregarRespaldos(arrayRespaldos).subscribe(
        (data: any) => {         
          //this.pagarCuota(idCuota, cuota);
          this.inmobiliariaService.closeDialogModal();
          this.alert.createAlert("Registro de pago Creado con exito!");                  
        },
        (error: any) => {
          console.log(error);
        }
      );    
    });
  }
  }
    
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  recuperarArchivos(archivos: any) {     
    if(archivos.estadoCuota == "Pendiente"){
      this.snackBar.open('Este egreso aun no ha sido registrado. Por favor registre el pago', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',          
      });
    } else {            
      this.inmobiliariaService.buscarImagenC(archivos.id).subscribe(
        (dataImagen: any) => {                  
          setTimeout(() => {
            this.dialog.open(DialogShow, {
              data: { archivos: dataImagen, servicio: 'inmobiliaria-egreso-cuota' },
            });
          }, 1000);       
        },
        (error: any) => {
          console.log(error);
        }
      );
    }          
              
  }
  
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => {
        this.selection.select(row);
  
      });
    console.log(this.selection.selected);
  }

  edit(id: any, monto: any, cuota: any) {
    localStorage.setItem('idEgresoPago', id);
    localStorage.setItem('montoEgreso', monto);
    if(cuota == "Pendiente"){
      this.inmobiliariaService.openDialogCuota();
    }else {    
    this.snackBar.open('El pago de esta cuota ya fue registrado', 'cerrar', {
      duration: 2000,
      verticalPosition: 'top',          
    });
  }
  }

  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {
      
      let dataFiltered = this.dataCuota;      
      
      //Filtro Fecha
      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: any) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);
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
    this.dataSource = new MatTableDataSource(this.dataCuota);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  }

   // Cerrar Dialog
   closeDialog(){
    this.inmobiliariaService.closeDialogModal();
   }

}
