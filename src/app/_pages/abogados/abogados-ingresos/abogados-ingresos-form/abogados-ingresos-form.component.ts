import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef,} from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbogadosService } from '../../abogados.service';
import { AbogadosTabsService } from '../../abogados-tabs.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { Cliente } from '../../../../_models/abogados/cliente';
import { User } from '../../../../_models/abogados/user';
import { first } from 'rxjs/operators';



@Component({
  selector: 'app-abogados-ingresos-form',
  templateUrl: './abogados-ingresos-form.component.html',
  styleUrls: ['./abogados-ingresos-form.component.scss']
})
export class AbogadosIngresosFormComponent implements OnInit {

  miFactory!: ComponentFactory<any>;
  //componentRef: ComponentRef<ContratosListComponent> = null;
  @ViewChild('componenteDinamico', { read: ViewContainerRef })
  compDynamicContainer!: ViewContainerRef;

  qMostrar = true;

  idUsuario = null;
  submitted = false;
  rut = '';
  idCliente = '';
  causasCliente = null;
  idEmpresa = null;

  // !este valor se debe definir con el cliente creado o actualizado
  elPadreDice!: any;

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');

  addressForm = this.fb.group({
    rutCliente: ['', Validators.required],
    nombreCliente: ['', Validators.required],
    email: ['', Validators.required],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
  });

  sucursales: Sucursal[];
  cliente!: Cliente;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
    private alert: AlertHelper,
    private abogadosService: AbogadosService,
    private abogadosTabsService: AbogadosTabsService,
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
  }

  ngOnInit(): void {
  }

  // Metodo crear Cliente
  crearCliente(){
    this.cliente = new Cliente();
    this.cliente.nombre = this.f.nombreCliente.value;
    this.cliente.idUsuario = this.usuario.id.toString();
    this.cliente.email = this.f.email.value;
    this.cliente.fono = this.f.telefono.value;
    this.cliente.direccion = this.f.direccion.value;
    this.cliente.rut = this.f.rutCliente.value;
    this.abogadosTabsService
      .guardarCliente(this.cliente.rut, this.cliente)
      .pipe(first())
      .subscribe((x:any) => {
        this.idCliente = this.elPadreDice.cliente.id;

        this.snackBar.open('Cliente Registrado', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
      });
  }
  get f(): any {
    return this.addressForm.controls;
  }

  // ************* Inicio Metodo Buscar Usuario *************
  buscarExistencia(): void {
    // this.rutFormat = this.formateaRut();
    this.cliente = new Cliente();
    this.f.rutCliente == this.formateaRut();
    // TODO agregar metodo de servicio
    this.cliente.nombre = this.f.nombreCliente.value;
    this.cliente.email = this.f.email.value;
    this.cliente.direccion = this.f.direccion.value;
    this.cliente.fono = this.f.telefono.value;
    this.cliente.idUsuario = this.usuario.id.toString();
    this.cliente.rut = this.f.rutCliente.value;
    this.abogadosTabsService
      .crearSinoExiste(this.cliente.rut, this.cliente)
      .pipe(first())
      .subscribe((x: any) => {
        this.elPadreDice = x;
        this.idCliente = this.elPadreDice.cliente.id;
        // Crear un localStorage que almacene datos del cliente para usarlos mas adelante
        localStorage.setItem("idCliente", this.idCliente);
        localStorage.setItem("nombreCliente", this.elPadreDice.cliente.nombre);

        this.abogadosTabsService
          .obtenerContratosCliente(this.idCliente)
          .subscribe((contratos: null) => {
            this.causasCliente = contratos;
          });
        if (!this.elPadreDice.created) {
          this.f.nombreCliente.setValue(this.elPadreDice.cliente.nombre);
          this.f.email.setValue(this.elPadreDice.cliente.email);
          this.f.telefono.setValue(this.elPadreDice.cliente.fono);
          this.f.direccion.setValue(this.elPadreDice.cliente.direccion);
          this.snackBar.open('El Usuario ya existe, confirme la informacion o actualice los datos', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
        } else {
          this.snackBar.open('El Usuario no existe, complete la informacion y actualice los datos', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      });
  }

  formateaRut(): any {
    let value = this.addressForm.value.rutCliente.replace(/\./g, '').replace('-', '');
    if (value.match(/^(\d{2})(\d{3}){2}(\w{1})$/)) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\w{1})$/, '$1.$2.$3-$4');
    } else if (value.match(/^(\d)(\d{3}){2}(\w{0,1})$/)) {
      value = value.replace(/^(\d)(\d{3})(\d{3})(\w{0,1})$/, '$1.$2.$3-$4');
    } else if (value.match(/^(\d)(\d{3})(\d{0,2})$/)) {
      value = value.replace(/^(\d)(\d{3})(\d{0,2})$/, '$1.$2.$3');
    } else if (value.match(/^(\d)(\d{0,2})$/)) {
      value = value.replace(/^(\d)(\d{0,2})$/, '$1.$2');
    }

    return value;
  }
  // ************* Fin Metodo Buscar Usuario *************

}
