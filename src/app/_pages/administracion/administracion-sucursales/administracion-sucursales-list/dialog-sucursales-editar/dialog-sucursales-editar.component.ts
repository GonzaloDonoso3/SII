import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { first } from 'rxjs/operators';
import { AdministracionService } from '../../../administracion.service';

@Component({
  selector: 'app-dialog-sucursales-editar',
  templateUrl: './dialog-sucursales-editar.component.html',
  styleUrls: ['./dialog-sucursales-editar.component.scss']
})
export class DialogSucursalesEditarComponent implements OnInit {

  formularioListo = new EventEmitter<string>();
  sucursal : any;
  empresas: any;
  idSucursal : any;
  dataSucursal: any;
  razonSocial!: any;

  // ? Configuración de formulario
  addressForm = this.fb.group({
    idEmpresa: ['', Validators.required],
    razonSocial: ['', Validators.required],
    rut: ['', Validators.required],
    giro: ['', Validators.required],
    actividad: ['', Validators.required],
    direccion: ['', Validators.required],
    descripcion: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
    private administracionService: AdministracionService
  ) { }

  

  ngOnInit(): void {
    this.idSucursal = localStorage.getItem("idSucursalEdit");
    this.razonSocial = localStorage.getItem("razonSocialSucursalEdit");
    this.getEmpresas();
    this.getSucursal();
  }

// Obtener empresas
  getEmpresas(){
    this.empresaService
    .getAll()
    .pipe(first())
    .subscribe((empresas) => {
      this.empresas = empresas;
    });
  }

  get f() {
    return this.addressForm.controls;
  }

  // Obtener la sucursal que se quiere editar
  getSucursal() {
    //Carga Tabla 
    this.sucursalService.getAll().pipe(first()).subscribe((result: Sucursal[]) => {
      this.dataSucursal = result.map(Sucursal => {
        //Sucursal.empresa = Sucursal.Empresa.razonSocial;
        return Sucursal;
      });
      // Obtener la sucursal que se quiere editar y asignar sus valores al formulario
      this.dataSucursal.forEach((x:any) => {
        if(x.id == this.idSucursal){
          this.f.razonSocial.setValue(x.razonSocial);
          this.f.rut.setValue(x.rut);
          this.f.descripcion.setValue(x.descripcion);
          this.f.giro.setValue(x.giro);
          this.f.actividad.setValue(x.actividad);
          this.f.direccion.setValue(x.direccion);
          this.f.idEmpresa.setValue(x.idEmpresa);
        }
      });
    });
  }

  // Metodo editar sucursal
  onSubmit(){
    this.sucursalService
    .update(this.idSucursal, this.addressForm.value)
    .pipe(first())
    .subscribe(
      (data) => {
        this.snackBar.open('Sucursal actualizada con exito', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
        this.administracionService.closeDialogModal();
      },
      (error) => {
        this.snackBar.open(error, 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    );
  }

  //Cerrar Modal
  closeDialog(){
    this.administracionService.closeDialogModal();
  }
}
