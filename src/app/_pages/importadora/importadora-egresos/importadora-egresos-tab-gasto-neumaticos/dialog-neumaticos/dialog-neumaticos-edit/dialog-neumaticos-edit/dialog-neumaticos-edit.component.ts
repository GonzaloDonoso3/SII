import { Component, OnInit, EventEmitter } from '@angular/core';
import { EgresosContainerImportadora } from '@app/_models/importadora/egresoContainerImportadora';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { ImportadoraService } from '@app/_pages/importadora/importadora.service';
import { Empresa } from '@app/_models/shared/empresa';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EgresosFijoImportadora } from '@app/_models/importadora/egresoFijoImportadora';

@Component({
  selector: 'app-dialog-neumaticos-edit',
  templateUrl: './dialog-neumaticos-edit.component.html',
  styleUrls: ['./dialog-neumaticos-edit.component.scss']
})
export class DialogNeumaticosEditComponent implements OnInit {
  
  formularioListo = new EventEmitter<string>();
  container: EgresosContainerImportadora = JSON.parse(localStorage.getItem('container') + '');
  dataSource: MatTableDataSource<EgresosContainerImportadora> = new MatTableDataSource();   
  
  dataContainer: any;    
  idConteiner = 0;  
  NombreNeumaticos: any;
  empresa = new Empresa();  
  idContainerEdit : any;
  unitarioChinoEdit: any;
  totalTipoNeumaticoEdit: any;
  neumaticoEdit : any;
  cantidadEdit : any;
  conteinerEdit : any;
  costoNeumaticoEdit : any;
  comisionEdit : any;
  //comisionEdit2 : any;
  interiorEdit : any;
  maritimoEdit : any;
  portuarioEdit : any;
  segurosEdit : any;
  unitarioEdit : any;
  totalEdit : any;
  totalVentaEdit : any;
  gananciaEdit : any;
  utilidadEdit : any;
  text = 0; //initialised the text variable 
  
  

  // ? Configuración de formulario
  addressForm = this.fb.group({    
    tipoNeumatico: ['', Validators.required],
    unitarioChino: ['', Validators.required],
    totalTipoNeumatico: ['', Validators.required],
    cantidad: ['', Validators.required],
    pContainer: ['', Validators.required],
    costoNeumatico: ['', Validators.required],    
    costoComision: ['', Validators.required],
    costoInterior: ['', Validators.required],
    costoMaritimo: ['', Validators.required],
    impuestoProntuario: ['', Validators.required],
    seguros: ['', Validators.required],
    valorUnitario: ['', Validators.required],
    montoTotal: ['', Validators.required],
    totalVenta: ['', Validators.required],
    pGanancia: ['', Validators.required],
    utilidad: ['', Validators.required],
  });


  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private importadoraService: ImportadoraService,
    private empresaService: EmpresaSharedService,    
  ) { }

  ngOnInit(): void {
    this.idContainerEdit = localStorage.getItem("idContainerEdit");
    this.neumaticoEdit = localStorage.getItem("neumaticoEdit");
    this.unitarioChinoEdit = localStorage.getItem("unitarioChinoEdit");
    this.totalTipoNeumaticoEdit = localStorage.getItem("totalTipoNeumaticoEdit");    
    this.cantidadEdit = localStorage.getItem("cantidadEdit");
    this.conteinerEdit = localStorage.getItem("conteinerEdit");
    this.costoNeumaticoEdit = localStorage.getItem("costoNeumaticoEdit");    
    this.comisionEdit = localStorage.getItem("comisionEdit");
    //this.comisionEdit = localStorage.getItem("comisionEdit2");    
    this.interiorEdit = localStorage.getItem("interiorEdit");
    this.maritimoEdit = localStorage.getItem("maritimoEdit");
    this.portuarioEdit = localStorage.getItem("portuarioEdit");
    this.segurosEdit = localStorage.getItem("segurosEdit");
    this.unitarioEdit = localStorage.getItem("unitarioEdit");
    this.totalEdit = localStorage.getItem("totalEdit");
    this.totalVentaEdit = localStorage.getItem("totalVentaEdit");
    this.gananciaEdit = localStorage.getItem("gananciaEdit");    
    this.utilidadEdit = localStorage.getItem("utilidadEdit");

    this.getConteiner();
  }
   
  onKeyUp(x: any) { // appending the updated value to the variable            
    //this.f.valorUnitario.value = "";
    this.totalEdit = localStorage.getItem("totalEdit");
    console.log("calculo", this.totalEdit)
    this.text = x.target.value * this.unitarioEdit;
  }

  getConteiner(){    
        this.f.tipoNeumatico.setValue(this.neumaticoEdit);
        this.f.unitarioChino.setValue(this.unitarioChinoEdit);
        this.f.totalTipoNeumatico.setValue(this.totalTipoNeumaticoEdit);
        this.f.cantidad.setValue(this.cantidadEdit);
        this.f.pContainer.setValue(this.conteinerEdit);
        this.f.costoNeumatico.setValue(this.costoNeumaticoEdit);
        this.f.costoComision.setValue(this.comisionEdit);
        this.f.costoInterior.setValue(this.interiorEdit);
        this.f.costoMaritimo.setValue(this.maritimoEdit);
        this.f.impuestoProntuario.setValue(this.portuarioEdit);
        this.f.seguros.setValue(this.segurosEdit);
        this.f.valorUnitario.setValue(this.unitarioEdit);
        this.f.montoTotal.setValue(this.totalEdit);
        this.f.totalVenta.setValue(this.totalVentaEdit);
        this.f.pGanancia.setValue(this.gananciaEdit);
        this.f.utilidad.setValue(this.utilidadEdit);
        //localStorage.clear();
  }

  get f() {
    return this.addressForm.controls;
  }
 
  // Metodo editar neumaticos
  onSubmit(){
    switch (this.addressForm.status) {
      //Si el formulario esta correcto
      case 'VALID':
        this.importadoraService
      .updateNeumaticos(this.idContainerEdit ,this.addressForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.snackBar.open('Neumaticos editados con exito', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          this.addressForm.reset();
          this.importadoraService.closeDialogModal();
          
        },
        (error) => {
          //this.snackBar.open('Neumaticos editados con exito', 'cerrar', {
          this.snackBar.open('No se pudo editar los neumaticos, contacte con informatica', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      );
        break;
      
      //Si el formulario es erroneo 
      case 'INVALID':
        this.snackBar.open('EL formulario debe ser Completado', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
        break;
      
      default:
        break;
    }
  }

}
