import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { RentacarService } from '../../rentacar.service';
import { first } from 'rxjs/operators';
import { Empresa } from '@app/_models/shared/empresa';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaSharedService } from '../../../shared/shared-services/empresa-shared.service';
import { EgresosRentacar } from '../../../../_models/rentacar/egresoRentacar';
import { DatePipe } from "@angular/common";

//import { SSL_OP_SINGLE_DH_USE } from 'node:constants';

@Component({
  selector: 'app-rentacar-egresos-form',  
  templateUrl: './rentacar-egresos-form.component.html',
  styleUrls: ['./rentacar-egresos-form.component.scss'],
  providers: [DatePipe]
})
export class RentacarEgresosFormComponent implements OnInit {
  
  @Output() formularioListo = new EventEmitter<string>();
  

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  nameRespaldo = '';
  empresa = new Empresa();
  idEmpresa = 4;
  egreso = new EgresosRentacar();
  empresaRazonSocial = '';
  num: number = 0;
  //Variables que usan para los egresos de Prestamos bancarios y automotriz
  mostrarDatos : boolean = true;
  datoCuota = 'N/A';
  montoTotal = '1000';
  selected: any;
  opcionSeleccionado: string = '';
  verSeleccion: string = '';
  result2='';
  result3='';
  numberConvert='';

  
  // ? Configuración de formulario
  addressForm = this.fb.group({
    idSucursal: [null, Validators.required],
    tipoEgreso: [null, Validators.required],
    descripcionEgreso: [null, Validators.required],
    fecha: [null, Validators.required],    
    monto: [null],
    montoCuota: [null],
    responsable: [null, Validators.required],
    numeroCuota: [null],
    otraPropiedad: ['']
  });

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private alert: AlertHelper,
    private rentacarService: RentacarService,
    private route: ActivatedRoute,
    private empresaService: EmpresaSharedService,
    private miDatePipe: DatePipe,  
  ) { }
 

  ngOnInit(): void {
    this.getEmpresa(this.idEmpresa);        
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

  getEmpresa(id: number): any {
    this.empresaService
      .getByIdWithSucursales(id)
      .pipe(first())
      .subscribe((x) => {
        x.Sucursals = Object.values(x.Sucursals);
        this.empresa = x;
      });
  }

  onSubmit() {
    // $ consulta el estado del formulario antes de recibir los adjuntos
    switch (this.addressForm.status) {
      //Si el formulario esta correcto
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {
          

          data: { url: 'egresoRentacar/upload' }
        });        
        dialogRef.afterClosed().subscribe(result => {                      
          //Se le asignan los datos del formulario al objeto EgresoInmobiliaria
          this.nameRespaldo = result;
          this.egreso.RespaldoEgresos = [];
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
          this.egreso.descripcion = this.addressForm.value.descripcionEgreso;
          this.egreso.responsable = this.addressForm.value.responsable;
          this.egreso.idSucursal = this.addressForm.value.idSucursal;
          this.egreso.tipoEgreso = this.addressForm.value.tipoEgreso;
          this.egreso.idArriendo = this.addressForm.value.idArriendo;
          this.egreso.numeroCuota = this.addressForm.value.numeroCuota;           
          this.egreso.fecha = this.addressForm.value.fecha;
          // if(this.addressForm.value.numeroCuota > 1){                          
          //   let sumarMes= 0;
          //   let restarMes= 0;
          //   let contadorCuota = 0;                                               
          //     for (let i = 0; i < this.addressForm.value.numeroCuota; i++) {                     
          //           this.addressForm.value.fecha.setMonth(this.addressForm.value.fecha.getMonth() + sumarMes);                                                                                                  
          //           this.egreso.fecha = this.addressForm.value.fecha;
          //           sumarMes = sumarMes + 1;
          //           contadorCuota = contadorCuota + 1;
          //           this.egreso.numeroCuota = contadorCuota.toString().concat("/").concat(this.addressForm.value.numeroCuota);                                                                                                                                                                                                                                                                                                                                                                                         
          //           restarMes = (sumarMes + 1) - sumarMes;                                 
          //           if(sumarMes >= 2){                                            
          //             sumarMes = restarMes;                      
          //           }                                        
                
          //       //Se le asigna la id del usuario logueado
          //       this.egreso.idUsuario = this.usuario.id;

          // //Se le agrega los respaldos subidos
          // for (const name of this.nameRespaldo) {
          //   this.egreso.RespaldoEgresos.push({ url: name });
          // }
          // //Si todo esta correcto se ingresa el objeto
          // if (result.length > 0) {            
          //   this.rentacarService
          //     .createEgresos(this.egreso)
          //     .pipe(first())
          //     .subscribe(
          //       (data: any) => {                                                                 
          //         this.alert.createAlert("Registro Creado con exito");                  
          //         this.formularioListo.emit(this.num + "");
          //         this.num++;
          //         this.addressForm.reset();

          //       },
          //       (error: any) => {
          //         this.snackBar.open('Tenemos Problemas para realizar el registro, favor contactar al equipo de desarrollo', 'cerrar', {
          //           duration: 2000,
          //           verticalPosition: 'top',
          //         });
          //       }
          //     );
          // } else {
          //   //Si es incorrecto se envía un mensaje de error
          //   this.snackBar.open('Debemos Recibir sus respaldos para continuar', 'cerrar', {
          //     duration: 5000,
          //     verticalPosition: 'top',
          //   });
          // }
          //   }   
          //   return;
          // }
          // else {
          //   this.egreso.fecha = this.addressForm.value.fecha;                         
          //   this.addressForm.value.numeroCuota = "1/1";             
          //   this.egreso.numeroCuota = this.addressForm.value.numeroCuota;          
          // }          


          //Se le asigna la id del usuario logueado
          this.egreso.idUsuario = this.usuario.id;

          //Se le agrega los respaldos subidos
          for (const name of this.nameRespaldo) {
            this.egreso.RespaldoEgresos.push({ url: name });
          }
          //Si todo esta correcto se ingresa el objeto
          if (result.length > 0) {            
            this.rentacarService
              .createEgresos(this.egreso)
              .pipe(first())
              .subscribe(
                (data: any) => {                                                                 
                  this.alert.createAlert("Registro Creado con exito");
                  this.formularioListo.emit(this.num + "");
                  this.num++;
                  this.addressForm.reset();
                },
                (error: any) => {
                  this.snackBar.open('Tenemos Problemas para realizar el registro, favor contactar al equipo de desarrollo', 'cerrar', {
                    duration: 2000,
                    verticalPosition: 'top',
                  });
                }
              );
          } else {
            //Si es incorrecto se envía un mensaje de error
            this.snackBar.open('Debemos Recibir sus respaldos para continuar', 'cerrar', {
              duration: 5000,
              verticalPosition: 'top',
            });
          }
        });
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

