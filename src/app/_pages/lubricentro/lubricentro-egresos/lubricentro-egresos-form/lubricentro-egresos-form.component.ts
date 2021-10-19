import { Usuario } from '@models/shared/usuario';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRespaldosComponent } from '@app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { EgresoLubricentro } from '@app/_models/lubricentro/egresoLubricentro';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { LubricentroService } from '../../lubricentro.service';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { DatePipe } from "@angular/common";
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { first } from 'rxjs/operators';
import { Empresa } from '@app/_models/shared/empresa';

@Component({
  selector: 'app-lubricentro-egresos-form',
  templateUrl: './lubricentro-egresos-form.component.html',
  styleUrls: ['./lubricentro-egresos-form.component.scss'],
  providers: [DatePipe]
})
export class LubricentroEgresosFormComponent implements OnInit {

  @Output()
  formularioListo = new EventEmitter<string>();
  // ? set checkbox
  tiposEgresos: string[] = [];
  cuentasRegistradas: any[] = [];
  // ? construccion del formulario,

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  //Variables que usan para los egresos de Prestamos bancarios y automotriz
  mostrarDatos : boolean = true;
  empresa = new Empresa();
  idEmpresa = 3;
  datoCuota = 'N/A';
  montoTotal = '1000';
  selected: any;
  opcionSeleccionado: string = '';
  verSeleccion: string = '';
  result2='';
  result3='';
  numberConvert='';


  egresosForm = this.fb.group({
    //agregar el detalle del formulario;
    fecha: [null, Validators.required],
    monto: [null],
    montoCuota: [null],
    tipoEgreso: [null, Validators.required],
    descripcion: [null, Validators.required],
    responsable: [null, Validators.required],
    idSucursal: [null, Validators.required],
    idIngreso: [null,],
    numeroCuota: [null],
    /* idCuentaAsignada: [null, Validators.required], */
  });
  egreso: EgresoLubricentro = new EgresoLubricentro();
  nameRespaldo: string[] = [];
  
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private lubricentroService: LubricentroService,    
    private cuentasService: CuentasBancariasService,
    private alert: AlertHelper,
    private empresaService: EmpresaSharedService,
  ) { }

  ngOnInit(): void {
    this.getEmpresa(this.idEmpresa);
    this.tiposEgresos = this.lubricentroService.tiposEgresosListValue;
    this.cuentasService.obtenerCuentas().subscribe(data => {
      this.cuentasRegistradas = data;

    });
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
    this.egresosForm.controls["numeroCuota"].setValidators(Validators.required);
    this.egresosForm.controls["numeroCuota"].updateValueAndValidity();  
    this.egresosForm.controls["monto"].clearValidators();           
    this.egresosForm.controls["monto"].updateValueAndValidity();
                          
  }
//Metodo para ocultar los numeros de cuotas
  desactivarEdicion(): void {
    this.mostrarDatos = true;
    this.egresosForm.controls["monto"].setValidators(Validators.required);
    this.egresosForm.controls["monto"].updateValueAndValidity();                         
    this.egresosForm.controls["numeroCuota"].clearValidators();           
    this.egresosForm.controls["numeroCuota"].updateValueAndValidity();
   
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


  onSubmit() {
    switch (this.egresosForm.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'egresoLubricentro/upload' }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.nameRespaldo = result;
          this.egreso.RespaldoEgresoLubricentros = [];
          this.egreso.fecha = this.egresosForm.value.fecha;
          // Si el usuario ingresa Egreso Bancario y Automotriz al monto se le asigna el numero de cuota                    
          if((this.egresosForm.value.monto == '' || this.egresosForm.value.monto == null) 
          && (this.egresosForm.value.montoCuota == '' || this.egresosForm.value.montoCuota == null)) { 
            //this.egreso.monto = this.addressForm.value.montoCuota;
            this.transform('');
            this.egreso.monto = 1000;                  
          } else {
            //this.egreso.monto = this.addressForm.value.monto; 
            this.egreso.monto = parseInt(this.numberConvert);                   
          }
          this.egreso.descripcion = this.egresosForm.value.descripcion;
          this.egreso.responsable = this.egresosForm.value.responsable;
          this.egreso.idSucursal = this.egresosForm.value.idSucursal;
          this.egreso.idIngreso = this.egresosForm.value.idIngreso;
          this.egreso.idUsuario = this.usuario.id;          
          this.egreso.tipoEgreso = this.egresosForm.value.tipoEgreso;
          this.egreso.numeroCuota = this.egresosForm.value.numeroCuota;

          for (const respaldo of this.nameRespaldo) {
            this.egreso.RespaldoEgresoLubricentros.push({ url: respaldo });
          }          

          //Se le asigna la id del usuario logueado
          this.egreso.idUsuario = this.usuario.id;

          if (this.egreso.RespaldoEgresoLubricentros.length > 0) {
            this.lubricentroService
              .egresoRegistrar(this.egreso)
              .pipe()
              .subscribe(
                (data: any) => {
                  this.alert.createAlert("Registro Creado con exito!");                  
                  this.formularioListo.emit('true');
                  this.egresosForm.reset();
                },
                (error: any) => {
                  this.snackBar.open('Tenemos Problemas para realizar el registro, favor contactar al equipo de desarrollo', 'cerrar', {
                    duration: 2000,
                    verticalPosition: 'top',
                  });
                  console.log(error);
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
        this.snackBar.open('Debe completar el Formulario', 'cerrar', {
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
