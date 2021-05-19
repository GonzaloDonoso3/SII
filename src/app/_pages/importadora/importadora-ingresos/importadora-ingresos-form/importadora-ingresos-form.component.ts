import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
import { EmpresaSharedService } from '../../../shared/shared-services/empresa-shared.service';
import { Empresa } from '@app/_models/shared/empresa';
import { ImportadoraService } from '../../importadora.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-importadora-ingresos-form',
  templateUrl: './importadora-ingresos-form.component.html',
  styleUrls: ['./importadora-ingresos-form.component.scss']
})
export class ImportadoraIngresosFormComponent implements OnInit {

  
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');

  nameRespaldo = '';
  tiposIngresos: any[] = [];
  idEmpresa = 9;
  empresa = new Empresa();
  rango = 0;
  chequeList : any[] = [];
  confirmCheque: Boolean = false;


  // ? Validar si es necesario importar modelos de datos
  ingreso: any = {};
  // ? Configuración de formulario
  addressForm = this.fb.group({
    idSucursal: [null, Validators.required],
    tipoIngreso: [null, Validators.required],
    descripcionIngreso: [null, Validators.required],
    fecha: [null, Validators.required],
    monto: [null, Validators.required],
    medioPago: [null, Validators.required],
    vendedor: [''],
    codigoAutorizacion: [''],
  });

  addressFormCheque = this.fb.group({
    descripcionIngreso: [null, Validators.required],
    fecha: [null, Validators.required],
    monto: [null, Validators.required],
  });

  displayedColumns: string[] = [
    'fecha',
    'descripcion',
    'monto',
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  sucursales: Sucursal[];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private importadoraService: ImportadoraService,
    private empresaService: EmpresaSharedService,
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
  }

  ngOnInit(): void {
    this.getEmpresa(this.idEmpresa);
    this.confirmCheque = false;
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
 

  onSubmit(){
    // $ consulta el estado del formulario antes de recibir los adjuntos
    switch (this.addressForm.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'ingresoImportadora/upload' }
          
        });
        dialogRef.afterClosed().subscribe(result => {
          //Se le asignan los datos del formulario al objeto ingresoImportadora
          this.nameRespaldo = result;
          this.ingreso.RespaldoIngresoImportadoras = [];
          this.ingreso.idSucursal = this.addressForm.value.idSucursal;
          this.ingreso.vendedor = this.addressForm.value.vendedor;
          this.ingreso.tipoIngreso = this.addressForm.value.tipoIngreso;
          this.ingreso.medioPago = this.addressForm.value.medioPago;
          this.ingreso.descripcionIngreso = this.addressForm.value.descripcionIngreso;
          this.ingreso.fecha = this.addressForm.value.fecha;
          this.ingreso.monto = this.addressForm.value.monto;
          this.ingreso.codigoAutorizacion = this.addressForm.value.codigoAutorizacion;

          //Si el usuario elegio otra propiedad se le asigna el nombre ingresado
          if (this.addressForm.value.vendedor == "") {
            this.ingreso.vendedor = this.usuario.nombreUsuario;
          } 
          
          //Si el usuario elegio otro tipoIngreso se le asigna el nombre ingresado
          if (this.addressForm.value.codigoAutorizacion == "") {
            this.ingreso.codigoAutorizacion = "NO POSEE";
          } 
          
          //Se le asigna la id del usuario logueado
          this.ingreso.idUsuario = this.usuario.id;

          //Se le agrega los respaldos subidos
          for (const name of this.nameRespaldo) {
            this.ingreso.RespaldoIngresoImportadoras.push({ url: name });
          }

          console.log(this.ingreso);
          //Si todo esta correcto se ingresa el objeto
          if (result.length > 0) {
            this.importadoraService
              .create(this.ingreso)
              .pipe()
              .subscribe(
                (data) => {
                  this.snackBar.open('Ingreso Registrado', 'cerrar', {
                    duration: 2000,
                    verticalPosition: 'top',
                  });
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

    onSelect(){
      if(this.addressForm.value.medioPago == "CHEQUE"){
        this.clickMethod();
      }
    }
    
    clickMethod() {
      if(confirm("¿Estas segur@ de querer agregar cheques? (Una vez ingresado un cheque no se podrá eliminar)")) {
        if(this.addressForm.value.idSucursal != null && this.addressForm.value.tipoIngreso != null){
          this.confirmCheque = true;
          this.chequeList = [];
          this.dataSource = new MatTableDataSource(this.chequeList);
        }else{
          alert("Faltan datos (Sucursal o Tipo Ingreso)");
          this.addressForm.reset();
        }
      }
    }


    onSubmitCheque(){
      this.ingreso.idSucursal = this.addressForm.value.idSucursal;
      this.ingreso.vendedor = this.addressForm.value.vendedor;
      this.ingreso.tipoIngreso = this.addressForm.value.tipoIngreso;
      this.ingreso.medioPago = this.addressForm.value.medioPago;
      this.ingreso.monto = this.addressFormCheque.value.monto;
      this.ingreso.descripcionIngreso = this.addressFormCheque.value.descripcionIngreso;
      this.ingreso.fecha = this.addressFormCheque.value.fecha;
      this.ingreso.codigoAutorizacion = "NO POSEE";

      //Si el usuario elegio otra propiedad se le asigna el nombre ingresado
      if (this.addressForm.value.vendedor == "") {
        this.ingreso.vendedor = this.usuario.nombreUsuario;
      } 
      
      //Se le asigna la id del usuario logueado
      this.ingreso.idUsuario = this.usuario.id;

      
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'ingresoImportadora/upload' }
          
        });
        dialogRef.afterClosed().subscribe(result => {
          this.nameRespaldo = result;
          this.ingreso.RespaldoIngresoImportadoras = [];

          //Se le agrega los respaldos subidos
          for (const name of this.nameRespaldo) {
            this.ingreso.RespaldoIngresoImportadoras.push({ url: name });
          }

          this.chequeList.push(this.ingreso);
          this.dataSource = new MatTableDataSource(this.chequeList);
          this.rango = this.rango - 1; 

          if (result.length > 0) {
            this.importadoraService
              .create(this.ingreso)
              .pipe()
              .subscribe(
                (data) => {
                  this.snackBar.open('Ingreso Registrado', 'cerrar', {
                    duration: 2000,
                    verticalPosition: 'top',
                  });
                  this.addressFormCheque.reset();

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
    }

    onSubmitChequeFinal(){
      this.addressForm.reset();
      this.addressFormCheque.reset();
      this.confirmCheque = false;
    }
}
