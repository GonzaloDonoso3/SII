import { Component, OnInit } from '@angular/core';
import { ModalService } from '@app/_components/_modal';
import { ProyectoAgrofirma } from '@app/_models/agroFirma/proyectoAgroFirma';
import { Observable } from 'rxjs';
import { AgroFirmaService } from '../agro-firma.service';

@Component({
  selector: 'app-agro-firma-proyectos',
  templateUrl: './agro-firma-proyectos.component.html',
  styleUrls: ['./agro-firma-proyectos.component.scss']
})
export class AgroFirmaProyectosComponent implements OnInit {

  proyectos: ProyectoAgrofirma[] = []
  projectId!: Observable<number>
  project!: ProyectoAgrofirma
  flag: boolean = false
  

  constructor(
    private agroFirmaService: AgroFirmaService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.agroFirmaService.GetAllProyectos()
    .subscribe((proyectos: any) => {
      this.proyectos = proyectos
    })
  }

  openCreateProject() {
    this.flag = this.flag ? false : true
    this.modalService.open('apendice')
  }

  openProject(project: any) {
    this.project = project
    this.projectId = project.id
    this.modalService.open('apendice')
  }

  formulario(idModal: any, idProyecto: any): void {
    this.modalService.open(idModal);
  }

  closeModal() {
    this.modalService.close('apendice')
  }

  updateProjects() {
    this.agroFirmaService.GetAllProyectos()
    .subscribe((proyectos: any) => {
      this.proyectos = proyectos
    })
  }

  formReady(datetime: number) {
    this.updateProjects()
  }


}
