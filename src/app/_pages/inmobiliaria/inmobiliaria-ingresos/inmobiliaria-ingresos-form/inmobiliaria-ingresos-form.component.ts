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
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { AlertHelper } from '@app/_helpers/alert.helper';



@Component({
  selector: 'app-inmobiliaria-ingresos-form',
  templateUrl: './inmobiliaria-ingresos-form.component.html',
  styleUrls: ['./inmobiliaria-ingresos-form.component.scss']
})
export class InmobiliariaIngresosFormComponent implements OnInit {


  @Output()
  formularioListo = new EventEmitter<string>();
  // ? set checkbox

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');

  nameRespaldo = '';
  tiposIngresos: any[] = [];


  // ? Validar si es necesario importar modelos de datos
  ingreso: any = {};
  // ? Configuración de formulario
  addressForm = this.fb.group({
    idSucursal: [null, Validators.required],
    propiedad: [null, Validators.required],
    tipoIngreso: [null, Validators.required],
    descripcionIngreso: [null, Validators.required],
    fecha: [null, Validators.required],
    monto: [null, Validators.required],
    otraPropiedad: [''],
    otroTipoIngreso: [''],
  });

  sucursales: Sucursal[];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
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
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'ingresoInmobiliaria/upload' }
        });
        dialogRef.afterClosed().subscribe(result => {
          //Se le asignan los datos del formulario al objeto EgresoInmobiliaria
          this.nameRespaldo = result;
          this.ingreso.RespaldoIngresoInmobiliaria = [];
          this.ingreso.idSucursal = this.addressForm.value.idSucursal;
          this.ingreso.propiedad = this.addressForm.value.propiedad;
          this.ingreso.tipoIngreso = this.addressForm.value.tipoIngreso;
          this.ingreso.descripcionIngreso = this.addressForm.value.descripcionIngreso;
          this.ingreso.fecha = this.addressForm.value.fecha;
          this.ingreso.monto = this.addressForm.value.monto;

          //Si el usuario elegio otra propiedad se le asigna el nombre ingresado
          if (this.addressForm.value.propiedad == 'Otra') {
            this.ingreso.propiedad = this.addressForm.value.otraPropiedad;
          } else {
            this.ingreso.propiedad = this.addressForm.value.propiedad;
          }
          
          //Si el usuario elegio otro tipoIngreso se le asigna el nombre ingresado
          if (this.addressForm.value.tipoIngreso == 'Otro') {
            this.ingreso.tipoIngreso = this.addressForm.value.ingresoOtros;
          } else {
            this.ingreso.tipoIngreso = this.addressForm.value.tipoIngreso;
          }
          
          //Se le asigna la id del usuario logueado
          this.ingreso.idUsuario = this.usuario.id;

          //Se le agrega los respaldos subidos
          for (const name of this.nameRespaldo) {
            this.ingreso.RespaldoIngresoInmobiliaria.push({ url: name });
          }
          //Si todo esta correcto se ingresa el objeto
          if (result.length > 0) {
            this.inmobiliariaService
              .create(this.ingreso)
              .pipe()
              .subscribe(
                (data) => {
                  this.alert.createAlert("Registro Creado con exito!");
                  this.formularioListo.emit('true');
                  this.addressForm.reset();

                },
                (error) => {
                  //Si es incorrecto se envía un mensaje de error
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

  //metodo que permite activar el input de otraPropiedad y otroTipo
  get f() {
    return this.addressForm.controls;
  }

}
