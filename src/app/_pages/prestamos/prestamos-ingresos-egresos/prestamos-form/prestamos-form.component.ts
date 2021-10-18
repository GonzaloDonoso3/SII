import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRespaldosComponent } from '@app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog } from '@angular/material/dialog';
import { PrestamosService} from '@app/_pages/prestamos/prestamos.service'
import { AlertHelper } from '@app/_helpers/alert.helper';

export interface DialogData {
  url: any;
}

@Component({
  selector: 'app-prestamos-form',
  templateUrl: './prestamos-form.component.html',
  styleUrls: ['./prestamos-form.component.scss']
})
export class PrestamosFormComponent implements OnInit {
  @Output()
  formularioListo = new EventEmitter<string>();
  // ? set checkbox

  nameRespaldo = '';

  //importando los modelos al arreglo
  prestamos: any = {};

  addressForm = this.fb.group({
    empresaS: [null, Validators.required],    
    bancoS: [null, Validators.required],
    empresaD: [null, Validators.required],    
    bancoD: [null, Validators.required],
    fecha: [null, Validators.required],
    monto: [null, Validators.required],    
    tipoPago: [null, Validators.required],    
    responsable: [null, Validators.required],
    descripcion: [null, Validators.required],
  })

  empresas: string[];
  bancos: string[];
  tiposPagos: string[];
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private prestamosService: PrestamosService,
    private alert: AlertHelper
  ) { 
    this.empresas = ['Teresa Del Carmen', 'Teresa Garrido e Hijos', 'Sociedad Vargas', 'Miguel Vargas', 'Sociedad Garrido', 'Solanch Macarena', 'Firma Abogados'];
    //this.empresasD = ['Teresa Del Carmen', 'Teresa Garrido e Hijos', 'Sociedad Vargas', 'Miguel Vargas', 'Sociedad Garrido', 'Solanch Macarena', 'Firma Abogados'];
    this.bancos = ['Banco de Chile', 'Banco Santander', 'Banco Itau', 'Banco de Estado', 'Banco Falabella', 'Banco Ripley'];
    this.tiposPagos = ['Efectivo', 'Debito', 'Credito', 'Transferencia', 'Cheque'];
  }

  ngOnInit(): void {
  }
  
  onSubmit() {
    // $ consulta el estado del formulario antes de recibir los adjuntos
    switch (this.addressForm.status) {
      case 'VALID':

        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'prestamos/upload' }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.nameRespaldo = result;
          this.prestamos.RespaldoPrestamos = [];
          this.prestamos.empresaS = this.addressForm.value.empresaS;
          this.prestamos.bancoS = this.addressForm.value.bancoS;
          this.prestamos.empresaD = this.addressForm.value.empresaD;
          this.prestamos.bancoD = this.addressForm.value.bancoD;
          this.prestamos.fecha = this.addressForm.value.fecha;
          this.prestamos.monto = this.addressForm.value.monto;          
          this.prestamos.tipoPago = this.addressForm.value.tipoPago;
          this.prestamos.responsable = this.addressForm.value.responsable;                    
          this.prestamos.descripcion = this.addressForm.value.descripcion;                    

          for (const name of this.nameRespaldo) {
            this.prestamos.RespaldoPrestamos.push({ url: name });
          }
          if (result.length > 0) {
            this.prestamosService
              .buscarPrestamos(this.prestamos)
              .pipe()
              .subscribe(
                (data) => {
                  this.alert.createAlert("Registro Creado con exito!");                  
                  this.formularioListo.emit('true');
                  this.addressForm.reset();

                },
                (error) => {
                  this.snackBar.open('Tenemos Problemas para realizar el registro, favor contactar al equipo de desarrollo', 'cerrar', {
                    duration: 2000,
                    verticalPosition: 'top',
                  });
                }
              );
          } else {
            this.snackBar.open('Debemos Recibir sus respaldos para continuar !!', 'cerrar', {
              duration: 5000,
              verticalPosition: 'top',
            });
          }

        });
        break;

      case 'INVALID':
        this.snackBar.open('EL formulario debe ser Completado !!', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
        break;

      default:
        break;
    }



  }

}
