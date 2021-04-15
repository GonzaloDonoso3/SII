import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContratosComponent } from './abogados-ingresos/abogados-ingresos-acciones/dialog-contratos/dialog-contratos.component';

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


  closeDialogContratos(){
    this.dialog.closeAll();
  }


}
