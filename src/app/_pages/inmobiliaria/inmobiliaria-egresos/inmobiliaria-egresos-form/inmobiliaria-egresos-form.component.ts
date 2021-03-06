import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InmobiliariaService } from '../../inmobiliaria.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { DatePipe } from "@angular/common";
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { first } from 'rxjs/operators';
import { Empresa } from '@app/_models/shared/empresa';

@Component({
  selector: 'app-inmobiliaria-egresos-form',
  templateUrl: './inmobiliaria-egresos-form.component.html',
  styleUrls: ['./inmobiliaria-egresos-form.component.scss'],
  providers: [DatePipe]
})
export class InmobiliariaEgresosFormComponent implements OnInit {

  @Output()
  formularioListo = new EventEmitter<string>();
  // ? set checkbox

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');

  nameRespaldo = '';
  tiposEgresos: any[] = [];
  //Variables que usan para los egresos de Prestamos bancarios y automotriz
  mostrarDatos : boolean = true;
  idEmpresa = 5;
  empresa = new Empresa();
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
    propiedad: [null, Validators.required],
    tipoEgreso: [null, Validators.required],
    descripcionEgreso: [null, Validators.required],
    fecha: [null, Validators.required],
    monto: [null],
    montoCuota: [null],
    responsable: [null, Validators.required],
    numeroCuota: [null],
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
    private empresaService: EmpresaSharedService,   
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
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
    //Si el formulario esta correcto
    case 'VALID':
      const dialogRef = this.dialog.open(DialogRespaldosComponent, {

        data: { url: 'egresoInmobiliaria/upload' }
      });
      dialogRef.afterClosed().subscribe(result => {
        //Se le asignan los datos del formulario al objeto EgresoInmobiliaria
        this.nameRespaldo = result;
        this.egreso.RespaldoEgresoInmobiliaria = [];
        // Si el usuario ingresa Egreso Bancario o Automotriz al monto se le asigna el numero de cuota
        if((this.addressForm.value.monto == '' || this.addressForm.value.monto == null) 
          && (this.addressForm.value.montoCuota == '' || this.addressForm.value.montoCuota == null)) {             
            this.transform('');
            this.egreso.monto = 1000;                  
          } else {          
          this.egreso.monto = parseInt(this.numberConvert);                   
        }
        this.egreso.idSucursal = this.addressForm.value.idSucursal;
        this.egreso.propiedad = this.addressForm.value.propiedad;
        this.egreso.tipoEgreso = this.addressForm.value.tipoEgreso;
        this.egreso.descripcion = this.addressForm.value.descripcionEgreso;
        this.egreso.fecha = this.addressForm.value.fecha;        
        this.egreso.responsable = this.addressForm.value.responsable; 
        this.egreso.numeroCuota = this.addressForm.value.numeroCuota;

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
