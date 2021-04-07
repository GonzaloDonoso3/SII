import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InmobiliariaService } from '../../inmobiliaria.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { AlertHelper } from '@app/_helpers/alert.helper';

@Component({
  selector: 'app-inmobiliaria-egresos-form',
  templateUrl: './inmobiliaria-egresos-form.component.html',
  styleUrls: ['./inmobiliaria-egresos-form.component.scss']
})
export class InmobiliariaEgresosFormComponent implements OnInit {

  @Output()
  formularioListo = new EventEmitter<string>();
  // ? set checkbox

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');

  nameRespaldo = '';
  tiposEgresos: any[] = [];


  // ? Validar si es necesario importar modelos de datos
  egreso: any = {};
  // ? Configuración de formulario
  addressForm = this.fb.group({
    idSucursal: [null, Validators.required],
    propiedad: [null, Validators.required],
    tipoEgreso: [null, Validators.required],
    descripcionEgreso: [null, Validators.required],
    fecha: [null, Validators.required],
    monto: [null, Validators.required],
    responsable: [null, Validators.required],
    otraPropiedad: ['']
  });

  sucursales: Sucursal[];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private alert: AlertHelper,
    private inmobiliariaService: InmobiliariaService,
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
  }

  ngOnInit(): void {
  }

  onSubmit(){
  // $ consulta el estado del formulario antes de recibir los adjuntos
  switch (this.addressForm.status) {
    //Si el formulario esta correcto
    case 'VALID':
      const dialogRef = this.dialog.open(DialogRespaldosComponent, {

        data: { url: 'egresoInmobiliaria/upload' }
      });
      dialogRef.afterClosed().subscribe(result => {
        //Se le asignan los datos del formulario al objeto EgresoInmobiliaria
        this.nameRespaldo = result;
        this.egreso.RespaldoEgresoInmobiliaria = [];
        this.egreso.idSucursal = this.addressForm.value.idSucursal;
        this.egreso.propiedad = this.addressForm.value.propiedad;
        this.egreso.tipoEgreso = this.addressForm.value.tipoEgreso;
        this.egreso.descripcion = this.addressForm.value.descripcionEgreso;
        this.egreso.fecha = this.addressForm.value.fecha;
        this.egreso.monto = this.addressForm.value.monto;
        this.egreso.responsable = this.addressForm.value.responsable; 

        //Si el usuario elegio otra propiedad se le asigna el nombre ingresado
        if (this.addressForm.value.propiedad == 'Otra') {
          this.egreso.propiedad = this.addressForm.value.otraPropiedad;
        } else {
          this.egreso.propiedad = this.addressForm.value.propiedad;
        }
        
        //Se le asigna la id del usuario logueado
        this.egreso.idUsuario = this.usuario.id;

        //Se le agrega los respaldos subidos
        for (const name of this.nameRespaldo) {
          this.egreso.RespaldoEgresoInmobiliaria.push({ url: name });
        }
        //Si todo esta correcto se ingresa el objeto
        if (result.length > 0) {
          this.inmobiliariaService
            .createEgresos(this.egreso)
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
          //Si es incorrecto se envía un mensaje de error
          this.snackBar.open('Debemos Recibir sus respaldos para continuar !!', 'cerrar', {
            duration: 5000,
            verticalPosition: 'top',
          });
        }
      });
      break;
    
      //Si el formulario es erroneo 
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

  //metodo que permite activar el input de otraPropiedad
  get f() {
    return this.addressForm.controls;
  }
}
