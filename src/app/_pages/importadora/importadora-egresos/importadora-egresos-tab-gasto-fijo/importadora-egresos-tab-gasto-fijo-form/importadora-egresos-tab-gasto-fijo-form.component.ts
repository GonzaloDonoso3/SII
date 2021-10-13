import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { Observable } from 'rxjs';
import { first, map,startWith } from 'rxjs/operators';
import { UsuarioSharedService } from '@app/_pages/shared/shared-services/usuario-shared.service';
import { ImportadoraService } from '../../../importadora.service';
import { Empresa } from '@app/_models/shared/empresa';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';


@Component({
  selector: 'app-importadora-egresos-tab-gasto-fijo-form',
  templateUrl: './importadora-egresos-tab-gasto-fijo-form.component.html',
  styleUrls: ['./importadora-egresos-tab-gasto-fijo-form.component.scss']
})
export class ImportadoraEgresosTabGastoFijoFormComponent implements OnInit {

  formularioListo = new EventEmitter<string>();
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');

  nameRespaldo = '';
  tiposIngresos: any[] = [];
  idEmpresa = 9;
  empresa = new Empresa();

  mostrarDatos : boolean = true;
  datoCuota = 'N/A';
  montoTotal = '1000';
  selected: any;
  opcionSeleccionado: string = '';
  verSeleccion: string = '';
  result2='';
  result3='';
  numberConvert='';


  // ? Validar si es necesario importar modelos de datos
  egreso: any = {};
  // ? Configuración de formulario
  addressForm = this.fb.group({
    idSucursal: [null, Validators.required],
    tipoEgreso: [null, Validators.required],
    descripcion: [null, Validators.required],
    fecha: [null, Validators.required],
    monto: [null],
    montoCuota: [null],
    numeroCuota: [null],
  });

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private usuariosService: UsuarioSharedService,
    private ImportadoraService: ImportadoraService,
    private empresaService: EmpresaSharedService,
    private alert: AlertHelper
  ) { 
  }

  ngOnInit(): void {
    this.getEmpresa(this.idEmpresa);
   }
 
   getEmpresa(id: number): any {
     this.empresaService
       .getByIdWithSucursales(id)
       .pipe(first())
       .subscribe((x) => {
         x.Sucursals = Object.values(x.Sucursals);
         this.empresa = x;
       });
   }

   //Metodo para mostrar numero de cuotas
  activarEdicion(): void {
    this.mostrarDatos = false; 
    this.addressForm.controls["numeroCuota"].setValidators(Validators.required);
    this.addressForm.controls["numeroCuota"].updateValueAndValidity();  
    this.addressForm.controls["monto"].clearValidators();           
    this.addressForm.controls["monto"].updateValueAndValidity();
                          
  }
//Metodo para ocultar los numeros de cuotas
  desactivarEdicion(): void {
    this.mostrarDatos = true;
    this.addressForm.controls["monto"].setValidators(Validators.required);
    this.addressForm.controls["monto"].updateValueAndValidity();                         
    this.addressForm.controls["numeroCuota"].clearValidators();           
    this.addressForm.controls["numeroCuota"].updateValueAndValidity();
   
  }

//Capturamos los tipos de egresos
  capturar() {
    this.verSeleccion = this.opcionSeleccionado;
    if(this.verSeleccion == "Prestamos Bancarios"  || this.verSeleccion == "Prestamos Automotriz"){
      this.transform('');     
    }else{
      this.transform('');
    }     
  }

  onSubmit(){
    // $ consulta el estado del formulario antes de recibir los adjuntos
    switch (this.addressForm.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'egresoFijoImportadora/upload' }
        });
        dialogRef.afterClosed().subscribe(result => {
          //Se le asignan los datos del formulario al objeto EgresoInmobiliaria
          this.nameRespaldo = result;
          this.egreso.RespaldoEgresoFijoImportadoras = [];
          this.egreso.idSucursal = this.addressForm.value.idSucursal;
          this.egreso.tipoEgreso = this.addressForm.value.tipoEgreso;
          this.egreso.descripcion = this.addressForm.value.descripcion;
          this.egreso.fecha = this.addressForm.value.fecha;
          this.egreso.numeroCuota = this.addressForm.value.numeroCuota;
          // Si el usuario ingresa Egreso Bancario y Automotriz al monto se le asigna el numero de cuota                  
          if((this.addressForm.value.monto == '' || this.addressForm.value.monto == null) 
          && (this.addressForm.value.montoCuota == '' || this.addressForm.value.montoCuota == null)) { 
            //this.egreso.monto = this.addressForm.value.montoCuota;
            this.transform('');
            this.egreso.monto = 1000;                  
          } else {
            //this.egreso.monto = this.addressForm.value.monto; 
            this.egreso.monto = parseInt(this.numberConvert);                   
          }
          
          //Se le asigna la id del usuario logueado
          this.egreso.idUsuario = this.usuario.id;

          //Se le agrega los respaldos subidos
          for (const name of this.nameRespaldo) {
            this.egreso.RespaldoEgresoFijoImportadoras.push({ url: name });
          }
          //Si todo esta correcto se ingresa el objeto
          if (result.length > 0) {
            this.ImportadoraService
              .createEgresosFijo(this.egreso)
              .pipe()
              .subscribe(
                (data) => {
                  this.snackBar.open('Egreso Registrado', 'cerrar', {
                    duration: 2000,
                    verticalPosition: 'top',
                  });
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

  transform(val: any) {
    if (val!='' || val != null) {
      //console.log(val, '*************')
      val = this.format_number(val, '');
    }else{
      val = this.format_number('', '');
    }
    return val;
  }

  format_number(number: any, prefix: any) {
    let result = '', number_string= ''; 
    if (number!='' && number!=null) {
      let thousand_separator = '.',
      decimal_separator = ',',
      regex = new RegExp('[^' + decimal_separator + '\\d]', 'g');
      number_string = number.replace(regex, '').toString();
      let split = number_string.split(decimal_separator),
      rest = split[0].length % 3;
      result = split[0].substr(0, rest);
      let thousands = split[0].substr(rest).match(/\d{3}/g);
      if (thousands) {
        let separator = rest ? thousand_separator : '';
        result += separator + thousands.join(thousand_separator);
      }
      result =
        split[1] != undefined ? result + decimal_separator + split[1] : result;
    }
    this.result2=result;
    this.result3=result;
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
