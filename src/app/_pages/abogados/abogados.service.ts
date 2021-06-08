import { Injectable } from '@angular/core';
import { DialogContratosComponent } from './abogados-ingresos/abogados-ingresos-acciones/dialog-contratos/dialog-contratos.component';
import { DialogRegistrarPagoComponent } from './abogados-ingresos/abogados-ingresos-acciones/dialog-registrar-pago/dialog-registrar-pago.component';
import { DialogRepactarCuotasComponent } from './abogados-ingresos/abogados-ingresos-acciones/dialog-repactar-cuotas/dialog-repactar-cuotas.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class AbogadosService {

  constructor(
    public dialog:MatDialog,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
  }


  // Metodo que permite abrir un Dialog (Modal)
  openDialogContratos():void{
    const dialogRef = this.dialog.open(DialogContratosComponent,{});
    dialogRef.afterClosed().subscribe(res =>{
      console.log(res);
    });
  }

  // Metodo que permite abrir un Dialog (Modal)
  openDialogRegistrarPago(idContrato: any):void{
    //Si el cliente selecciono un contrato se habre el modal
    if(idContrato != null){
      const dialogRef = this.dialog.open(DialogRegistrarPagoComponent,{});
      dialogRef.afterClosed().subscribe(res =>{
        console.log(res);
      });
    }else{
      //Si no, se muestra un error
      this.snackBar.open('Por favor seleccione un contrato', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } 
  }

  // Metodo que permite abrir un Dialog (Modal)
  openDialogRepactarCuotas(idContrato: any):void{
    //Si el cliente selecciono un contrato se habre el modal
    if(idContrato != null){
      const dialogRef = this.dialog.open(DialogRepactarCuotasComponent,{});
      dialogRef.afterClosed().subscribe(res =>{
        console.log(res);
      });
    }else{
      //Si no, se muestra un error
      this.snackBar.open('Por favor seleccione un contrato', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }
  }

  // Metodo que permite cerrar un Dialog (Modal)
  closeDialogContratos(){
    this.dialog.closeAll();
    //Se eliminan los localStorage
    localStorage.removeItem("nombreCliente");
    localStorage.removeItem("idCliente");
    localStorage.removeItem("idContratoPago");
  }

  // Cerrar dialog Repactar Cuota y Registrar Pago
  closeDialogModal(){
    this.dialog.closeAll();
    localStorage.removeItem("idContratoPago");
  }

}
