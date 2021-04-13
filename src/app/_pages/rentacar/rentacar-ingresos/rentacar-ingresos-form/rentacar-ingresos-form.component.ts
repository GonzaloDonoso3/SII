import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RentacarService } from '../../rentacar.service';

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
    licitacion: [null, Validators.required],
    fecha: [null, Validators.required],
  })

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private rentacarService: RentacarService) {

  }

  ngOnInit(): void {
    this.cargarLicitaciones();
  }


  cargarLicitaciones() {
    this.rentacarService.getLicitaciones().subscribe((data) => {
      console.log(data);
    })
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

