import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { ProyectoAgrofirma } from '@app/_models/agroFirma/proyectoAgroFirma';
import { Usuario } from '@app/_models/shared/usuario';
import { Observable } from 'rxjs';
import { AgroFirmaService } from '../../agro-firma.service';

@Component({
  selector: 'app-agro-firma-proyectos-form',
  templateUrl: './agro-firma-proyectos-form.component.html',
  styleUrls: ['./agro-firma-proyectos-form.component.scss']
})
export class AgroFirmaProyectosFormComponent implements OnInit {

  @Input() idProyecto!: Observable<number>
  @Input() project: ProyectoAgrofirma = new ProyectoAgrofirma()
  @Input() flag!: boolean

  projectForm!: FormGroup
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '')

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private agroFirmaService: AgroFirmaService,
    private alert: AlertHelper
  ) { }

  ngOnInit(): void {

    this.projectForm = this.fb.group({
      nombre: [null, Validators.required],
      ubicacion: [null, Validators.required],
      geoLocalizacion: [null, Validators.required],
      capitalInicial: [null, Validators.required],
      totalInversion: [null, Validators.required],
      fechaInicio: [null, Validators.required],
      estado: [null, Validators.required]
    })

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.project !== undefined) {
      if(!changes.project.firstChange){
        this.projectForm.setValue({
          nombre: this.project.nombre,
          ubicacion: this.project.ubicacion,
          geoLocalizacion: this.project.geoLocalizacion,
          capitalInicial: this.project.capitalInicial,
          totalInversion: this.project.totalInversion,
          fechaInicio: this.project.fechaInicio,
          estado: this.project.estado
        })
      }
    }
    if(changes.flag !== undefined) {
      if(!changes.flag.firstChange) {
        this.clearForm()
      }
    }


  }

  clearForm() {
    if(this.projectForm !== undefined) {
      this.projectForm.reset()
      Object.keys(this.projectForm.controls).forEach(key => {
        this.projectForm.get(key)?.clearValidators()
        this.projectForm.get(key)?.updateValueAndValidity()
      })
    }
  }

  onSubmit() {

    this.projectForm.patchValue({idUsuario: this.usuario.id})
    switch (this.projectForm.status) {
      case 'VALID':
        this.project = this.projectForm.getRawValue()
        this.agroFirmaService.createProject(this.project)
        .pipe()
        .subscribe((data: any) => {
          this.alert.createAlert("¡Proyecto registrado!")
          this.projectForm.reset()
          Object.keys(this.projectForm.controls).forEach(key => {
            this.projectForm.get(key)?.clearValidators()
            this.projectForm.get(key)?.updateValueAndValidity()
          })
        })
        break
      case 'INVALID':
        this.snackBar.open('Debe completar el Formulario', 'Cerrar', {
          duration: 2000,
          verticalPosition: 'top'
        })
        break
      default:
        break
      }
        
  }

}
