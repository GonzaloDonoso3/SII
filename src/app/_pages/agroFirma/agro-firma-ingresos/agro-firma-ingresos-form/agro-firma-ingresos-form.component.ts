import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe } from "@angular/common";
import { Usuario } from '@app/_models/shared/usuario';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EgresoAgroFirma } from '@app/_models/agroFirma/egresoAgroFirma';
import { Sucursal } from '@app/_models/shared/sucursal';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRespaldosComponent } from '@app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { AgroFirmaService } from '@app/_pages/agroFirma/agro-firma.service';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Router } from '@angular/router';
import { empty } from 'rxjs';
import { IngresoAgroFirma } from '@app/_models/agroFirma/ingresoAgroFirma';

@Component({
  selector: 'app-agro-firma-ingresos-form',
  templateUrl: './agro-firma-ingresos-form.component.html',
  styleUrls: ['./agro-firma-ingresos-form.component.scss'],
  providers: [DatePipe]
})
export class AgroFirmaIngresosFormComponent implements OnInit {
  @Output()
  formularioListo = new EventEmitter<string>();

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  // ? set checkbox
  
  cuentasRegistradas: any[] = [];
  idProyecto = null;
  isAddMode!: boolean;
  respaldoEgresos: any[] = [];
  
  //Variables que usan para los egresos de Prestamos bancarios y automotriz
  mostrarDatos : boolean = true;
  datoCuota = 'N/A';
  montoTotal = '1000';  
  proyecto : any = '0';
  selected: any;
  
  ingresosForm!: FormGroup;
  ingreso: IngresoAgroFirma = new IngresoAgroFirma();

  nameRespaldo: string[] = [];

  sucursales: Sucursal[];
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    //private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
    private alert: AlertHelper,
    private miDatePipe: DatePipe,
    private agroFirmaService: AgroFirmaService,
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
  }

  ngOnInit(): void {

    this.proyecto = localStorage.getItem("proyectoID");
    // construccion del formulario,
    this.ingresosForm = this.fb.group({
      fecha: [null, Validators.required],
      monto: [null, Validators.required],
      nDocumento: [null, Validators.required],
      descripcionIngreso: [null, Validators.required],
      tipoIngreso: [null, Validators.required],
      estadoPago: [null, Validators.required],
      nAutorizacion: [null, Validators.required]
    });

    this.cuentasService.obtenerCuentas().subscribe(data => {
      this.cuentasRegistradas = data;
    }); 
    
  }

  



  onSubmit() {
    switch (this.ingresosForm.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {
          data: { url: 'ingresoAgrofirma/upload' }
        });


        dialogRef.afterClosed().subscribe(result => {
          this.ingreso = this.ingresosForm.getRawValue();
          this.agroFirmaService.registrarIngreso(this.ingreso)
          .pipe()
          .subscribe((data: any) => {
            this.alert.createAlert("Registro Creado con exito!");                                      
            this.formularioListo.emit('true');
            this.ingresosForm.reset();
          },
          (error: any) => {
            this.snackBar.open('Tenemos Problemas para realizar el registro, porfavor contactar al equipo de desarrollo', 'cerrar', {
              duration: 2000,
              verticalPosition: 'top',
            });
            console.log(error);
          });
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

}
