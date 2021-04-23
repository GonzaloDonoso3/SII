import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { Empresa } from '@app/_models/shared/empresa';
import { first } from 'rxjs/operators';
import { AdministracionService } from '../../../administracion.service';


@Component({
  selector: 'app-dialog-empresas-editar',
  templateUrl: './dialog-empresas-editar.component.html',
  styleUrls: ['./dialog-empresas-editar.component.scss']
})
export class DialogEmpresasEditarComponent implements OnInit {

  formularioListo = new EventEmitter<string>();
  sucursal : any;
  empresas: any;
  idEmpresa : any;
  dataEmpresa: any;
  razonSocial!: any;

  // ? Configuración de formulario
  addressForm = this.fb.group({
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
    this.idEmpresa = localStorage.getItem("idEmpresaEdit");
    this.razonSocial = localStorage.getItem("razonSocialEmpresaEdit");
    this.getEmpresas();
    this.getSucursal();
  }



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

  getSucursal() {
    //Carga Tabla 
    this.empresaService.getAll().pipe(first()).subscribe((result: Empresa[]) => {
      this.dataEmpresa = result.map(Empresa => {
        return Empresa;
      });
      this.dataEmpresa.forEach((x:any) => {
        if(x.id == this.idEmpresa){
          this.f.razonSocial.setValue(x.razonSocial);
          this.f.rut.setValue(x.rut);
          this.f.descripcion.setValue(x.descripcion);
          this.f.giro.setValue(x.giro);
          this.f.actividad.setValue(x.actividad);
          this.f.direccion.setValue(x.direccion);
        }
      });
    });
  }

  onSubmit(){
    this.empresaService
    .update(this.idEmpresa, this.addressForm.value)
    .pipe(first())
    .subscribe(
      (data) => {
        this.snackBar.open('Empresa actualizada con exito', 'cerrar', {
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

  closeDialog(){
    this.administracionService.closeDialogModal();
  }

}
