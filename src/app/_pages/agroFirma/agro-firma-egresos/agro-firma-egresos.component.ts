import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, Input } from '@angular/core';
import { AgroFirmaService } from '@app/_pages/agroFirma/agro-firma.service';
import { ProyectoAgrofirma } from '@app/_models/agroFirma/proyectoAgroFirma';
import { MatDialog } from '@angular/material/dialog';
import { AgroFirmaEgresosFormComponent } from '@app/_pages/agroFirma/agro-firma-egresos/agro-firma-egresos-form/agro-firma-egresos-form.component';
import { AgroFirmaEgresosListComponent } from '@app/_pages/agroFirma/agro-firma-egresos/agro-firma-egresos-list/agro-firma-egresos-list.component';
import { first } from 'rxjs/operators';
import { ModalService } from '@app/_components/_modal';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-agro-firma-egresos',
  templateUrl: './agro-firma-egresos.component.html',
  styleUrls: ['./agro-firma-egresos.component.scss']
})
export class AgroFirmaEgresosComponent implements OnInit {

  //Creación de variables y asignación de datos
  dataSource: MatTableDataSource<ProyectoAgrofirma> = new MatTableDataSource();
  proyectos: ProyectoAgrofirma[] = [];
  idProyecto = null; 

  constructor(
    private agroFirmaService:  AgroFirmaService,
    public dialog: MatDialog,
    private modalService: ModalService,
    private router: Router,    
  ) { }

  ngOnInit(): void {
    this.agroFirmaService.GetAllProyectos()
      .pipe(first())
      .subscribe((proyectos: any) => {
        this.proyectos = proyectos;        
      });
  }
         
  formulario(idModal: any, idProyecto: any): void {
    this.modalService.open(idModal);
    this.router.navigate(['agrofirma/egresos/add', idProyecto]);        
    //const dialogRef = this.dialog.open(AgroFirmaEgresosFormComponent, {});          
  }

  listado(idModal: any, idProyecto: any): void {
    this.modalService.open(idModal);
    this.router.navigate(['agrofirma/egresos/list', idProyecto]);
  }

  closeModal(id: any): void {
    this.modalService.close(id);
    this.router.navigate(['agrofirma/egresos']);
  }
      
}
