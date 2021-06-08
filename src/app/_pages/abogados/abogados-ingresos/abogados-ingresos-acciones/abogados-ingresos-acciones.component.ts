import { Component, OnInit } from '@angular/core';
import { DialogContratosComponent } from './dialog-contratos/dialog-contratos.component';
import { MatDialog } from '@angular/material/dialog';
import { AbogadosService } from '../../abogados.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-abogados-ingresos-acciones',
  templateUrl: './abogados-ingresos-acciones.component.html',
  styleUrls: ['./abogados-ingresos-acciones.component.scss']
})
export class AbogadosIngresosAccionesComponent implements OnInit {

  validacion: boolean = false;
  
  nombreClienteLocal : any;

  constructor(
    public dialog:MatDialog,
    private abogadosService: AbogadosService,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    localStorage.removeItem("nombreCliente");
    localStorage.removeItem("idCliente");
    localStorage.removeItem("idContratoPago");
  }


  //Metodo que hace aparecer el componente dialog-mostrar-contratos
  activarTablaContratos(){
    //Se captura el valor del LocalStorage
    this.nombreClienteLocal = localStorage.getItem("nombreCliente");
    //Pregunta si el localStorage Existe
    if(this.nombreClienteLocal != null){
      // Si existe se muestra el componente
      this.validacion = true;
    }
    else{
      // Si no existe muestra un mensaje
      this.snackBar.open('Por favor seleccione un cliente, en el formulario', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }
  }


  //Este metodo oculta el componente dialog-mostrar-contratos
  desactivarTablaContratos(){
    this.validacion = false;
    //Se eliminan los localStorage
    localStorage.removeItem("nombreCliente");
    localStorage.removeItem("idCliente");
    localStorage.removeItem("idContratoPago");
  }


  //Este metodo abre el dialog-contratos (Modal)
  openDialogContratos():void{
    //Se captura el valor del LocalStorage
    this.nombreClienteLocal = localStorage.getItem("nombreCliente");
    //Pregunta si el localStorage Existe
    if(this.nombreClienteLocal){
      // Si existe se abre el dialog
    this.abogadosService.openDialogContratos();
    }
    else{
      // Si no existe muestra un mensaje
      this.snackBar.open('Por favor seleccione un cliente, en el formulario', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }
  }
}
