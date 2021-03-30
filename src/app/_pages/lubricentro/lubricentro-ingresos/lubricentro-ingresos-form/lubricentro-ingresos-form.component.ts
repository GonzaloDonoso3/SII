import { Usuario } from '@models/shared/usuario';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRespaldosComponent } from '@app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { LubricentroService } from '../../lubricentro.service';
import { AlertHelper } from '@app/_helpers/alert.helper';

@Component({
  selector: 'app-lubricentro-ingresos-form',
  templateUrl: './lubricentro-ingresos-form.component.html',
  styleUrls: ['./lubricentro-ingresos-form.component.scss'],
  providers: [LubricentroService]
})
export class LubricentroIngresosFormComponent {

  @Output()
  formularioListo = new EventEmitter<string>();
  // ? set checkbox

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');

  nameRespaldo = '';
  tiposIngresos: any[] = [];


  // ? Validar si es necesario importar modelos de datos
  ingreso: any = {};
  // ? Configuración de formulario
  ingresosForm = this.fb.group({
    idSucursal: [null, Validators.required],
    descripcion: [null, Validators.required],
    fecha: [null, Validators.required],
    monto: [null, Validators.required],
    cliente: [null, Validators.required],
    telefono: [null, Validators.required],
    correo: [null, [Validators.required, Validators.email]],
    tipoCliente: [null, Validators.required],
    referencia: [null, Validators.required],
    tipoPago: [null, Validators.required],
    estadoPago: [null, Validators.required],
    nDocumento: [null, Validators.required],
    nAutorizacion: [null, Validators.required],
    /*  idCuentaAsignada: [null, Validators.required], */
    tipoVehiculo: [null, Validators.required],
    ppu: [null, Validators.required],
    marca: [null, Validators.required],
    modelo: [null, Validators.required],
    anio: [null, Validators.required],
    kmActual: [null, Validators.required],
    kmProximo: [null, Validators.required],
  });
  sucursales: Sucursal[];
  hasUnitNumber = false;
  // ! Cambiar por un servicio
  defTiposIngreso: string[];
  tiposCliente: string[];
  referencias: string[];
  tiposPagos: string[];
  estadoPagos: string[];
  tiposVehiculos: string[];
  cuentasRegistradas: any[] = [];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private lubricentroService: LubricentroService,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
    private alert: AlertHelper
  ) {

    this.sucursales = this.sucursalService.sucursalListValue;
    this.defTiposIngreso = this.lubricentroService.tiposIngresosListValue;
    this.tiposCliente = this.lubricentroService.tiposClientesListValue;
    this.referencias = this.lubricentroService.referenciasListValue;
    this.tiposPagos = this.lubricentroService.tiposPagosListValue;
    this.estadoPagos = this.lubricentroService.estadosPagosListValue;
    this.tiposVehiculos = this.lubricentroService.tiposVehiculosListValue;
    this.cuentasService.obtenerCuentas()
      .subscribe(data => { this.cuentasRegistradas = data; });
  }
  onSubmit() {
    // $ consulta el estado del formulario antes de recibir los adjuntos
    switch (this.ingresosForm.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'ingresoLubricentro/upload' }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.nameRespaldo = result;
          this.ingreso.RespaldoIngresoLubricentros = [];
          this.ingreso.fecha = this.ingresosForm.value.fecha;
          this.ingreso.monto = this.ingresosForm.value.monto;
          this.ingreso.tipoPago = this.ingresosForm.value.tipoPago;
          this.ingreso.cliente = this.ingresosForm.value.cliente;
          this.ingreso.tipoCliente = this.ingresosForm.value.tipoCliente;
          this.ingreso.idSucursal = this.ingresosForm.value.idSucursal;
          this.ingreso.descripcionIngreso = this.ingresosForm.value.descripcion;
          this.ingreso.nDocumento = this.ingresosForm.value.nDocumento;
          this.ingreso.estadoPago = this.ingresosForm.value.estadoPago;
          this.ingreso.idUsuario = this.usuario.id;
          //this.ingresosForm.value.idUsuario;
          this.ingreso.nAutorizacion = this.ingresosForm.value.nAutorizacion;
          this.ingreso.correo = this.ingresosForm.value.correo;
          this.ingreso.telefono = this.ingresosForm.value.telefono;
          this.ingreso.idCuentaAsignada = this.ingresosForm.value.idCuentaAsignada;
          this.ingreso.referenciaCliente = this.ingresosForm.value.referencia;
          this.ingreso.anio = this.ingresosForm.value.anio;
          this.ingreso.kmActual = this.ingresosForm.value.kmActual;
          this.ingreso.kmProximo = this.ingresosForm.value.kmProximo;
          this.ingreso.marca = this.ingresosForm.value.marca;
          this.ingreso.modelo = this.ingresosForm.value.modelo;
          this.ingreso.ppu = this.ingresosForm.value.ppu;
          this.ingreso.tipoVehiculo = this.ingresosForm.value.tipoVehiculo;

          let cadena = '';
          for (const tipos of this.tiposIngresos) {
            cadena = cadena + ' ' + tipos;
          }
          this.ingreso.tipoIngreso = cadena;
          for (const name of this.nameRespaldo) {
            this.ingreso.RespaldoIngresoLubricentros.push({ url: name });
          }
          if (result.length > 0) {
            console.log(this.ingreso);
            this.lubricentroService
              .ingresoRegistrar(this.ingreso)
              .pipe()
              .subscribe(
                (data) => {
                  this.alert.createAlert("Registro Creado con exito!");
                  /*   this.snackBar.open('Regitro Exitoso !!', 'cerrar', {
                      duration: 2000,
                      verticalPosition: 'top',
                    }); */
                  this.formularioListo.emit('true');
                  this.ingresosForm.reset();

                },
                (error) => {
                  this.snackBar.open('Tenemos Problemas para realizar el registro, favbor contactar al equipo de desarrollo', 'cerrar', {
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

  chequearTipoIngreso(e: MatCheckboxChange) {

    if (e.checked) {
      this.tiposIngresos.push(e.source.name);
    }
    if (!e.checked) {
      this.tiposIngresos = this.tiposIngresos.filter(data => data !== e.source.name);
    }

  }

}
