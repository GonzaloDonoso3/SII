import { Usuario } from '@models/shared/usuario';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RentacarService } from '../../rentacar.service';




@Component({
  selector: 'app-rentacar-ingresos-form',
  templateUrl: './rentacar-ingresos-form.component.html',
  styleUrls: ['./rentacar-ingresos-form.component.scss']
})
export class RentacarIngresosFormComponent implements OnInit {

  @Output() formularioListo = new EventEmitter<string>();


  ingresoForm: FormGroup = this.fb.group({
    monto: [null, Validators.required],
    descripcionIngreso: [null, Validators.required],
    licitacion: [null, Validators.required],
    fecha: [null, Validators.required],
  })

  arrayLicitaciones: any[] = [];
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');

  ingresoLicitacion: any = {};

  constructor(private fb: FormBuilder, private alert: AlertHelper, private snackBar: MatSnackBar, private rentacarService: RentacarService) {

  }

  ngOnInit(): void {
    this.cargarLicitaciones();
  }


  cargarLicitaciones() {
    this.rentacarService.getLicitaciones().subscribe((response) => {
      this.arrayLicitaciones = response.data;
    })
  }

  onSubmit() {

    switch (this.ingresoForm.status) {
      case 'VALID':


        //capturar los respaldos en un modal


        this.ingresoLicitacion.fecha_ingresoLicitacion = this.ingresoForm.value.fecha;
        this.ingresoLicitacion.descripcion_ingresoLicitacion = this.ingresoForm.value.descripcionIngreso;
        this.ingresoLicitacion.id_licitacion = this.ingresoForm.value.licitacion;
        this.ingresoLicitacion.monto_ingresoLicitacion = this.ingresoForm.value.monto;
        this.ingresoLicitacion.userAt = this.usuario.nombreUsuario;

        this.rentacarService.postIngresoLicitacion(this.ingresoLicitacion).subscribe((response) => {

          console.log(response.data.id_ingresoLicitacion);
          //subir imagenes con la id

          this.formularioListo.emit('true');
          this.alert.createAlert("Registro Creado con exito!");
          this.ingresoForm.reset();
        })

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

