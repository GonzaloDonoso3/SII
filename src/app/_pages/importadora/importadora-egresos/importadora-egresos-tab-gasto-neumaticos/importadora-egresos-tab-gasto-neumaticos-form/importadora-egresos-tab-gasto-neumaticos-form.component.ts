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
import { AbogadosTabsService } from '../../../../abogados/abogados-tabs.service';
import { AbogadosService } from '../../../../abogados/abogados.service';
import { Cuota } from '../../../../../_models/abogados/cuota';
import { EgresosContainerImportadora } from '@app/_models/importadora/egresoContainerImportadora';
import { EgresosNeumaticoImportadora } from '@app/_models/importadora/egresoNeumaticoImportadora';

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
  cantidadTipo !:number;
  
  contrato = new nuevoContrato();
  cuota = new nuevaCuota();

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
    'monto'
  ];

  
  constructor(
    private fb: FormBuilder,
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
    private abogadosTabService: AbogadosTabsService,
    private snackBar: MatSnackBar,
    private abogadosService: AbogadosService,
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
  }

  
  ngOnInit(): void {
    this.obtenerEmpresa(this.idEmpresa);
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
    switch (this.addressFormConteiner.status) {
      case 'VALID':
        this.container.id;
        this.container.fecha = this.f.fecha.value;
        this.container.sucursal = this.f.idSucursal.value;
        this.container.nContainer = this.f.nContainer.value;
        this.container.costoComision = this.f.costoComision.value;
        this.container.costoInterior = this.f.costoInterior.value;
        this.container.costoMaritimo = this.f.costoMaritimo.value;
        this.container.costoNeumatico = this.f.costoNeumatico.value;
        this.container.impuestoProntuario = this.f.impuestoProntuario.value;
        this.container.seguros = this.f.seguros.value;
        this.container.montoTotal = this.container.costoComision + this.container.costoInterior + this.container.costoMaritimo + this.container.costoNeumatico + this.container.impuestoProntuario + this.container.seguros;
        this.container.usuario = this.usuario.id;
        this.montoTotal = this.container.montoTotal;
        this.cantidadTipo = this.f.cantidadTipo.value;
        
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
  agregarCuotas(): any{
    console.log(this.container);
    this.cuota.montoCuota = this.c.montoCuota.value;
    //Si el monto de las cuotas es menor al saldo pendiente 
    if (this.montoTotal > 0) {
      this.neumatico.tipoNeumatico = this.c.tipoNeumatico.value;
      this.neumatico.cantidad = this.c.cantidad.value;
      this.neumatico.pContainer = this.c.pContainer.value;

      
      this.neumatico.costoComision = (this.container.costoComision * (this.c.pContainer.value /100))/this.c.cantidad.value;
      this.neumatico.costoInterior = (this.container.costoInterior * (this.c.pContainer.value /100))/this.c.cantidad.value;
      this.neumatico.costoMaritimo = this.container.costoMaritimo/this.cantidadTipo;
      this.neumatico.seguros = this.container.seguros/this.cantidadTipo;
      this.neumatico.impuestoProntuario = (this.container.impuestoProntuario * (this.c.pContainer.value /100))/this.c.cantidad.value;

      this.neumatico.montoTotal = this.neumatico.costoComision + this.neumatico.costoInterior + this.neumatico.costoMaritimo + this.neumatico.seguros + this.neumatico.impuestoProntuario;
      this.neumatico.valorUnitario = this.neumatico.montoTotal / this.c.cantidad.value;
      this.neumatico.pGanancia = this.neumatico.valorUnitario + (this.c.pGanancia.id * (this.c.pGanancia.value/100));
      this.listaNeumatico.push(this.neumatico);
      
      this.montoTotal = this.montoTotal - this.neumatico.montoTotal;
      this.saldoPendiente = this.saldoPendiente - this.cuota.montoCuota;
      this.neumatico = new EgresosNeumaticoImportadora();
      this.dataSource = new MatTableDataSource(this.listaNeumatico);

      //TODO agregar elementos a la tabla de la vista
      //Probar metodo insertar 
    } 
    //Si no se muestra el error
    else {
      alert('monto no coincide con saldo pendiente');
    }
  }

  //Metodo que permite guardar el contrato
  guardarContrato(){
    this.abogadosTabService
      .guardarCuotas(this.listaCuotas)
      .pipe()
      .subscribe((x:any) => {
        this.abogadosService.closeDialogModal();
        this.listaCuotas = [];
        this.snackBar.open('Contato generado con exito', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
      });
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
