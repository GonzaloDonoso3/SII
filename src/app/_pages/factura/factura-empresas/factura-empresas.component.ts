import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturaService } from '@app/_pages/factura/factura.service';
import { PrestamosService } from '@app/_pages/prestamos/prestamos.service';
import { Factura } from '@app/_models/factura/factura';


@Component({
  selector: 'app-factura-empresas',
  templateUrl: './factura-empresas.component.html',
  styleUrls: ['./factura-empresas.component.scss']
})
export class FacturaEmpresasComponent implements OnInit {


  arraylist: any = [];
  factura = new Factura();
  arrayEmpresa: any = [];

  addressForm = this.fb.group({
    empresa: [null, Validators.required],    
    rutReceptor: [null, Validators.required],
    razonSocialR: [null, Validators.required],    
    //comuna: [null, Validators.required],
    giro: [null, Validators.required],
    direccion: [null, Validators.required],    
    ciudad: [null, Validators.required],        
  })

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private facturaService: FacturaService,
    private prestamosService: PrestamosService,
    private alert: AlertHelper
  ) { }

  ngOnInit(): void {
    this.getEmpresa();
  }

  getEmpresa() {
    this.prestamosService.getEmpresas().subscribe((x) => {        
      this.arraylist = x;  
      for (const item of this.arraylist) {          
        this.factura.NombreInstitucion = item.NombreInstitucion;
        this.arrayEmpresa.push(this.factura.NombreInstitucion);
      }      
      this.factura.NombreInstitucion = this.arrayEmpresa;                
    });
  }

  onSubmit() {

  }

}
