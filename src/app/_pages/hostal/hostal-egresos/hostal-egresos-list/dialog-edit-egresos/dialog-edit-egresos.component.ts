import { Component, EventEmitter, OnInit, Input } from '@angular/core';
import { AdministracionService } from '@app/_pages/administracion/administracion.service';
import { HostalService } from '@app/_pages/hostal/hostal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';

@Component({
  selector: 'app-dialog-edit-egresos',
  templateUrl: './dialog-edit-egresos.component.html',
  styleUrls: ['./dialog-edit-egresos.component.scss']
})
export class DialogEditEgresosComponent implements OnInit {
  
  //hostal: Hostal = JSON.parse(localStorage.getItem('hostal')+ '');  
  idHostal: any;
  fecha: any;
  monto: any;
  responsable: any;  
  tipoEgreso: any;  

/**  Configuración de formulario  */
  addressForm = this.fb.group({
    fecha: ['', Validators.required],
    monto: ['', Validators.required],
    responsable: ['', Validators.required],    
    tipoEgreso: ['', Validators.required],
    tipoPago: ['', Validators.required],    
  }); 
  sucursales: Sucursal[];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private hostalService: HostalService,
    private administracionService: AdministracionService,
    private sucursalService: SucursalSharedService,
  ) {
      this.sucursales = this.sucursalService.sucursalListValue;
  }

  ngOnInit(): void {    
    this.idHostal = localStorage.getItem('idEgresoHostal');        
    this.getIngresoHostal();    
  }

  getIngresoHostal(){
    this.hostalService
    .getById(this.idHostal).pipe(first()).subscribe((x: any) => {      
      if(x[0].id == this.idHostal){
        this.f.fecha.setValue(x[0].fecha);
        this.f.monto.setValue(x[0].monto);
        this.f.responsable.setValue(x[0].responsable);        
        this.f.tipoEgreso.setValue(x[0].tipoEgreso);                
        this.f.tipoPago.setValue(x[0].tipoPago);
      }
    });
  }

  get f(){
    return this.addressForm.controls;
  }

  /** metodo editar hostal service */
  onSubmit(){ 
    switch (this.addressForm.status){ 
      case 'VALID':
        this.hostalService
      .updateHostalIngreso(this.idHostal, this.addressForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.snackBar.open('Hostal editada con éxito.','Cerrar',{
            duration: 2000,
            verticalPosition: 'top',
          });

          this.addressForm.reset();
          this.hostalService.closeDialogModal(); 
        },
        (error) => {
          this.snackBar.open('No se pudo editar la hostal, favor contactar a informática.', 'Cerrar',{
          duration:2000,
          verticalPosition: 'top',
          });
        }
      );
        break;

      case 'INVALID':
        this.snackBar.open('El formulario debe ser completado.', 'Cerrar',{
          duration: 2000,
          verticalPosition: 'top',
        });
        break;

      default:
        break;
    }
  }

  //Cerrar Modal
  closeDialog(){
    this.administracionService.closeDialogModal();
  }

}
