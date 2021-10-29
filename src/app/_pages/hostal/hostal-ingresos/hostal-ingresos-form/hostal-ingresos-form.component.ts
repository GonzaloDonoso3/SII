import { Usuario } from '@models/shared/usuario';
import { Component, EventEmitter, Output, Directive, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HostalService } from '../../hostal.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { AlertHelper } from '@app/_helpers/alert.helper';
export interface DialogData {
  url: any;

}

@Component({
  selector: 'app-hostal-ingresos-form',
  templateUrl: './hostal-ingresos-form.component.html',
  styleUrls: ['./hostal-ingresos-form.component.scss']
})

export class HostalIngresosFormComponent {
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
    descripcion: [null, Validators.required],
    fecha: [null, Validators.required],
    monto: [null, Validators.required],
    cliente: [null, Validators.required],
    tipoCliente: [null, Validators.required],
    referencia: [null, Validators.required],
    tipoPago: [null, Validators.required],
    estadoPago: [null, Validators.required],
    nDocumento: [null, Validators.required],
    nAutorizacion: [null, Validators.required],
    /*  idCuentaAsignada: [null, Validators.required], */
  });
  sucursales: Sucursal[];
  hasUnitNumber = false;
  // ! Cambiar por un servicio
  defTiposIngreso: string[];
  tiposCliente: string[];
  referencias: string[];
  tiposPagos: string[];
  estadoPagos: string[];
  cuentasRegistradas: any[] = [];
  result2='';
  numberConvert='';

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private hostalService: HostalService,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
    private alert: AlertHelper
  ) {
    this.sucursales = this.sucursalService.sucursalListValue;    
    this.defTiposIngreso = ['Alojamiento', 'Desayuno', 'Almuerzo', 'Cena', ' Consumo Bebidas', 'Consumo Varios'];    
    this.tiposCliente = ['Particular', 'Empresa'];
    this.referencias = ['Llamada', 'Booking', 'Correo', 'PaginaWeb', 'Facebook'];
    this.tiposPagos = ['Efectivo', 'Debito', 'Credito', 'Transferencia', 'Cheque'];
    this.estadoPagos = ['PENDIENTE', 'PAGADO'];
    this.obtenerCuentas();
  }


  obtenerCuentas() {
    this.cuentasService.obtenerCuentas().subscribe(data => {
      this.cuentasRegistradas = data;
    });
  }

  onSubmit() {
    // $ consulta el estado del formulario antes de recibir los adjuntos
    switch (this.addressForm.status) {
      case 'VALID':

        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'ingresoHostal/upload' }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.nameRespaldo = result;
          this.ingreso.RespaldoIngresos = [];
          this.ingreso.fecha = this.addressForm.value.fecha;
          //this.ingreso.monto = this.addressForm.value.monto;
          this.ingreso.monto = parseInt(this.numberConvert);
          this.ingreso.tipoPago = this.addressForm.value.tipoPago;
          this.ingreso.cliente = this.addressForm.value.cliente;
          this.ingreso.tipoCliente = this.addressForm.value.tipoCliente;
          this.ingreso.idSucursal = this.addressForm.value.idSucursal;
          this.ingreso.descripcionIngreso = this.addressForm.value.descripcion;
          this.ingreso.nDocumento = this.addressForm.value.nDocumento;
          this.ingreso.estadoPago = this.addressForm.value.estadoPago;
          this.ingreso.idUsuario = this.usuario.id;
          //this.addressForm.value.idUsuario;
          this.ingreso.nAutorizacion = this.addressForm.value.nAutorizacion;
          this.ingreso.idCuentaAsignada = 1;
          this.ingreso.referenciaCliente = this.addressForm.value.referencia;


          let cadena = '';
          for (const tipos of this.tiposIngresos) {
            cadena = cadena + ' ' + tipos;
          }
          this.ingreso.tipoIngreso = cadena;

          for (const name of this.nameRespaldo) {
            this.ingreso.RespaldoIngresos.push({ url: name });
          }
          if (result.length > 0) {
            this.hostalService
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

  chequearTipoIngreso(e: MatCheckboxChange) {

    if (e.checked) {
      this.tiposIngresos.push(e.source.name);
    }
    if (!e.checked) {
      this.tiposIngresos = this.tiposIngresos.filter(data => data !== e.source.name);
    }

  }

  transform(val: any) {
    if (val) {
      val = this.format_number(val, '');
    }
    return val;
  }

  format_number(number: any, prefix: any) {
    let thousand_separator = '.',
      decimal_separator = ',',
      regex = new RegExp('[^' + decimal_separator + '\\d]', 'g'),
      number_string = number.replace(regex, '').toString(),
      split = number_string.split(decimal_separator),
      rest = split[0].length % 3,
      result = split[0].substr(0, rest),
      thousands = split[0].substr(rest).match(/\d{3}/g);
    if (thousands) {
      let separator = rest ? thousand_separator : '';
      result += separator + thousands.join(thousand_separator);
    }
    result =
      split[1] != undefined ? result + decimal_separator + split[1] : result;
      
      this.result2=result;
      this.numberConvert=number_string;  
    return prefix == undefined ? result : result ? prefix + result : '';
  }

  restrictNumeric(e: any) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
     return false;
    }
    if (e.which === 0) {
     return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
   }


}
