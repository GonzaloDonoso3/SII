import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rentacar-ingresos-form',
  templateUrl: './rentacar-ingresos-form.component.html',
  styleUrls: ['./rentacar-ingresos-form.component.scss']
})
export class RentacarIngresosFormComponent implements OnInit {



  ingresoForm: FormGroup = this.fb.group({
    monto: [null, Validators.required],
    tipoIngreso: [null, Validators.required],
    descripcionIngreso: [null, Validators.required],
    fecha: [null, Validators.required],
  })

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {

  }




  ngOnInit(): void {

  }

  onSubmit() {

    switch (this.ingresoForm.status) {
      case 'VALID':


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

