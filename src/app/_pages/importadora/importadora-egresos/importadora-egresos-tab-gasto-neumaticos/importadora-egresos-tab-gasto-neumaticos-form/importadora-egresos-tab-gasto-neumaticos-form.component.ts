import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { Empresa } from '@app/_models/shared/empresa';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { first } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { nuevoContrato } from '../../../../../_models/abogados/nuevoContrato';
import { nuevaCuota } from '../../../../../_models/abogados/nuevaCuota';
import { Usuario } from '@app/_models/shared/usuario';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { EgresosContainerImportadora } from '@app/_models/importadora/egresoContainerImportadora';
import { EgresosNeumaticoImportadora } from '@app/_models/importadora/egresoNeumaticoImportadora';
import { ImportadoraService } from '../../../importadora.service';
import { Console } from 'node:console';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-importadora-egresos-tab-gasto-neumaticos-form',
  templateUrl: './importadora-egresos-tab-gasto-neumaticos-form.component.html',
  styleUrls: ['./importadora-egresos-tab-gasto-neumaticos-form.component.scss']
})
export class ImportadoraEgresosTabGastoNeumaticosFormComponent implements OnInit {

  idEmpresa = 9;
  sucursales!: Sucursal[];
  empresa = new Empresa();
  montoTotal !: number;
  montoTotalNeumatico !: number;
  cantidadTipo !:number;
  costoComision  !: number;
  costoInterior  !: number;
  costoMaritimo !: number;
  seguros !: number;
  impuestoProntuario !: number;
  idConteiner!: any;
  nameRespaldo = '';

  //Validadores
  existeConteiner !: Boolean;
  cantidadNeumaticos !:  number;
  porcentajeConteiner !: number;
  


  container = new EgresosContainerImportadora();
  neumatico = new EgresosNeumaticoImportadora();
  


  listaCuotas : nuevaCuota[] = [];
  listaNeumatico: EgresosNeumaticoImportadora[] = [];

  dataSource: MatTableDataSource<EgresosNeumaticoImportadora> = new MatTableDataSource();
  fechaCompromisoCuota : any;

  saldoPendiente = 0;
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  idCliente = localStorage.getItem("idCliente");
  nombreClienteLocal = localStorage.getItem("nombreCliente");
  

// Variables que permiten realizar los filtros
  addressFormConteiner = this.fb.group({
    fecha: ['', Validators.required],
    idSucursal: ['', Validators.required],
    nContainer: ['', Validators.required],
    costoNeumatico: ['', Validators.required],
    costoComision: ['', Validators.required],
    costoInterior: ['', Validators.required],
    costoMaritimo: ['', Validators.required],
    impuestoProntuario: ['', Validators.required],
    seguros: ['', Validators.required],
    cantidadTipo: ['', Validators.required],
  });

// Variables que permiten realizar los filtros
  addressFormNeumatico = this.fb.group({
    tipoNeumatico: ['', Validators.required],
    cantidad: ['', Validators.required],
    pContainer: ['', Validators.required],
    pGanancia: ['', Validators.required],
  });

  displayedColumns: string[] = [
    'neumatico',
    'cantidad',
    'conteiner',
    'costoNeumatico',
    'comision',
    'interior',
    'maritimo',
    'portuario',
    'seguros',
    'unitario',
    'ganancia',
    'total'
  ];

  
  constructor(
    private fb: FormBuilder,
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
    private snackBar: MatSnackBar,
    private importadoraService: ImportadoraService,
    public dialog: MatDialog,
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
  }

  
  ngOnInit(): void {
    this.obtenerEmpresa(this.idEmpresa);
    this.existeConteiner = false;
    this.porcentajeConteiner = 100;
    this.cantidadNeumaticos = 0;
    // Sumar fechas
    // var fecha = new Date();
    // var dias = 15; // Número de días a agregar
    // fecha.setDate(fecha.getDate() + dias);
    // console.info("fecha: " + fecha)
  }

  //Metodo que ayuda a obtener los valores del formulario
  get f(): any {
    return this.addressFormConteiner.controls;
  }

  //Metodo que ayuda a obtener los valores del formulario
  get c(): any {
    return this.addressFormNeumatico.controls;
  }

  //Metodo que los datos del contrato (formulario) esten correctos
  validarConteiner(){
    this.existeConteiner = true;
    switch (this.addressFormConteiner.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'egresoContainerImportadora/upload' }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.nameRespaldo = result;
          this.container.RespaldoEgresoContainerImportadoras = [];
          this.container.id;
          this.container.fecha = this.f.fecha.value;
          this.container.idSucursal = this.f.idSucursal.value;
          this.container.nContainer = this.f.nContainer.value;
          this.container.costoComision = this.f.costoComision.value;
          this.container.costoInterior = this.f.costoInterior.value;
          this.container.costoMaritimo = this.f.costoMaritimo.value;
          this.container.costoNeumatico = this.f.costoNeumatico.value;
          this.container.impuestoProntuario = this.f.impuestoProntuario.value;
          this.container.seguros = this.f.seguros.value;
          this.container.montoTotal = this.f.costoComision.value + this.f.costoInterior.value + this.f.costoMaritimo.value + this.f.costoNeumatico.value + this.f.impuestoProntuario.value+ this.f.seguros.value;
          this.container.idUsuario = this.usuario.id;
          this.montoTotal = this.container.montoTotal;
          this.cantidadTipo = this.f.cantidadTipo.value;
          this.cantidadNeumaticos = this.cantidadTipo;

          //Se le agrega los respaldos subidos
          for (const name of this.nameRespaldo) {
            this.container.RespaldoEgresoContainerImportadoras.push({ url: name });
          }
          //Si todo esta correcto se ingresa el objeto
          if (result.length > 0) {
              this.importadoraService
              .createEgresosConteiner(this.container)
              .pipe()
              .pipe()
              .subscribe((x: any) => {
                this.snackBar.open('Egreso Registrado', 'cerrar', {
                  duration: 2000,
                  verticalPosition: 'top',
                });
                this.idConteiner = x.payload.id;
                this.existeConteiner = true;
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

  //Metodo que permite agregar las cuotas a una tabla 
  agregarNeumatico(): any{

    //Si el monto de las cuotas es menor al saldo pendiente 
    if (this.montoTotal >= 0 && (this.porcentajeConteiner - this.c.pContainer.value)  >= 0 && (this.cantidadNeumaticos - 1) >= 0) {
      switch (this.addressFormNeumatico.status) {
        case 'VALID':
              this.neumatico.idContainer = this.idConteiner;
              this.neumatico.tipoNeumatico = this.c.tipoNeumatico.value;
              this.neumatico.cantidad = this.c.cantidad.value;
              this.neumatico.pContainer = this.c.pContainer.value;
        
              this.neumatico.costoNeumatico = (this.container.costoNeumatico * (this.c.pContainer.value /100));
              this.neumatico.costoComision = (this.container.costoComision * (this.c.pContainer.value /100));
              this.neumatico.costoInterior = (this.container.costoInterior * (this.c.pContainer.value /100));
              this.neumatico.costoMaritimo = this.container.costoMaritimo/this.cantidadTipo;
              this.neumatico.seguros = this.container.seguros/this.cantidadTipo;
              this.neumatico.impuestoProntuario = (this.container.impuestoProntuario * (this.c.pContainer.value /100));
        
              //Valores Unitarios
              this.costoComision  = (this.container.costoComision * (this.c.pContainer.value /100))/this.c.cantidad.value;
              this.costoInterior  = (this.container.costoInterior * (this.c.pContainer.value /100))/this.c.cantidad.value;
              this.costoMaritimo = this.container.costoMaritimo/this.cantidadTipo;
              this.seguros = this.container.seguros/this.cantidadTipo;
              this.impuestoProntuario = (this.container.impuestoProntuario * (this.c.pContainer.value /100))/this.c.cantidad.value;
        
              this.neumatico.montoTotal = this.neumatico.costoComision + this.neumatico.costoInterior + this.neumatico.costoMaritimo + this.neumatico.seguros + this.neumatico.impuestoProntuario + this.neumatico.costoNeumatico;
              this.neumatico.valorUnitario = this.neumatico.montoTotal / this.c.cantidad.value;
              this.neumatico.pGanancia = this.neumatico.valorUnitario + (this.neumatico.valorUnitario * (this.c.pGanancia.value/100));
              this.montoTotalNeumatico = this.neumatico.costoComision + this.neumatico.costoInterior + this.neumatico.costoMaritimo + this.neumatico.seguros + this.neumatico.impuestoProntuario;

              

              this.listaNeumatico.push(this.neumatico);
              this.neumatico = new EgresosNeumaticoImportadora();
              this.dataSource = new MatTableDataSource(this.listaNeumatico);

              //Validadores
              this.montoTotal = this.montoTotal - this.montoTotalNeumatico;
              this.porcentajeConteiner = this.porcentajeConteiner - this.c.pContainer.value;
              this.cantidadNeumaticos = this.cantidadNeumaticos - 1;

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
    //Si no se muestra el error
    else {
      alert('monto no coincide con saldo pendiente');
    }
  }

  //Metodo que permite guardar el contrato
  guardarConteiner(){
   
    if(/*this.montoTotal == 0 && */this.listaNeumatico.length > 0 && this.porcentajeConteiner <= 1 && this.cantidadNeumaticos == 0){
        this.importadoraService
        .guardarNeumaticos(this.listaNeumatico)
        .pipe()
        .subscribe((x:any) => {
          this.snackBar.open('Conteiner guardado con exito', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          this.addressFormConteiner.reset();
          this.addressFormNeumatico.reset();
          this.existeConteiner = false;
          this.listaNeumatico = [];
        });
   }else{
        this.snackBar.open('Aun queda monto por asignar o no se ha ingresado ningún neumático', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
   }
  }

  obtenerEmpresa(id: number): any {
    this.empresaService
      .getByIdWithSucursales(id)
      .pipe(first())
      .subscribe((x) => {
        x.Sucursals = Object.values(x.Sucursals);
        this.empresa = x;
      });
  }

}
