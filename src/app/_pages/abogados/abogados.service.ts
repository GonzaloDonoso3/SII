import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContratosComponent } from './abogados-ingresos/abogados-ingresos-acciones/dialog-contratos/dialog-contratos.component';
import { DialogRegistrarPagoComponent } from './abogados-ingresos/abogados-ingresos-acciones/dialog-registrar-pago/dialog-registrar-pago.component';
import { DialogRepactarCuotasComponent } from './abogados-ingresos/abogados-ingresos-acciones/dialog-repactar-cuotas/dialog-repactar-cuotas.component';


@Injectable({
  providedIn: 'root'
})
export class AbogadosService {

  constructor(public dialog:MatDialog) { }

  ngOnInit(): void {
  }


  openDialogContratos():void{
    const dialogRef = this.dialog.open(DialogContratosComponent,{});
    dialogRef.afterClosed().subscribe(res =>{
      console.log(res);
    });
  }

  openDialogRegistrarPago():void{
    const dialogRef = this.dialog.open(DialogRegistrarPagoComponent,{});
    dialogRef.afterClosed().subscribe(res =>{
      console.log(res);
    });
  }

  openDialogRepactarCuotas():void{
    const dialogRef = this.dialog.open(DialogRepactarCuotasComponent,{});
    dialogRef.afterClosed().subscribe(res =>{
      console.log(res);
    });
  }

  closeDialogContratos(){
    this.dialog.closeAll();
  }


}
