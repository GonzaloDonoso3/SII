import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HostalService } from '@app/_pages/hostal/hostal.service';

@Component({
  selector: 'app-hostal-egresos-cuota-dialog',
  templateUrl: './hostal-egresos-cuota-dialog.component.html',
  styleUrls: ['./hostal-egresos-cuota-dialog.component.scss']
})
export class HostalEgresosCuotaDialogComponent implements OnInit {

  idCuotaEdit : any;
  montoCuotaEdit : any;

  //Configuracion de formulario
  addressForm = this.fb.group({
    monto: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private hostalService: HostalService
  ) { }

  ngOnInit(): void {
    this.idCuotaEdit = localStorage.getItem("idEgresoPago");
    this.montoCuotaEdit = localStorage.getItem("montoEgreso");
    this.getMontoCuota();
  }

  getMontoCuota() {
    this.f.monto.setValue(this.montoCuotaEdit);    
  }

  get f() {
    return this.addressForm.controls;
  }

  onSubmit(){
    switch (this.addressForm.status) {
      //Si el formulario esta correcto
      case 'VALID':
        this.hostalService
      .updateMonto(this.idCuotaEdit ,this.addressForm.value)
      .pipe()
      .subscribe(
        (data) => {
          this.snackBar.open('Monto editado con exito', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          this.addressForm.reset();
          this.hostalService.closeDialogModal();
          
        },
        (error) => {          
          this.snackBar.open('No se pudo editar editar el monto de la cuota, contacte con informatica', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      );
        break;
      
      //Si el formulario es erroneo 
      case 'INVALID':
        this.snackBar.open('EL formulario debe ser Completado', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
        break;
      
      default:
        break;
    }
  }

}
