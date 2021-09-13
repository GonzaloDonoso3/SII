import { Component, OnInit } from '@angular/core';
import esLocale from '@fullcalendar/core/locales/es';
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { CalendarOptions, EventApi } from '@fullcalendar/angular';
import { RegistroEgresoFirma } from '@app/_models/abogados/egresosFirma';
import { AbogadosService } from '@app/_pages/abogados/abogados.service';
import { MatTableDataSource } from '@angular/material/table';
import tippy from "tippy.js";
import { MatDialog } from '@angular/material/dialog';
import { EgresoFirmaCuota } from '@app/_models/abogados/egresoFirmaCuota';
import { AlertHelper } from '@app/_helpers/alert.helper';

@Component({
  selector: 'app-abogados-home',
  templateUrl: './abogados-home.component.html',
  styleUrls: ['./abogados-home.component.scss'],
  providers: [DatePipe]
})
export class AbogadosHomeComponent implements OnInit {

  //Creación de variables y asignación de datos
  dataSource: MatTableDataSource<EgresoFirmaCuota> = new MatTableDataSource();
  dataEgresos: EgresoFirmaCuota[] = [];

  eventsCalendar : any = [];
  calendarOptions!: CalendarOptions; 


  constructor(
    private abogadosService: AbogadosService,
    private miDatePipe: DatePipe,
    public dialog: MatDialog,
    private alert: AlertHelper
  ) { }

  ngOnInit(): void {
    this.getEgresos();
  }

  getEgresos() {           
    this.abogadosService.buscarCuotas().subscribe((egresos: EgresoFirmaCuota[]) => {            
      this.dataEgresos = egresos.map(Egresos => {        
        return Egresos;
      });
      this.dataEgresos.forEach(data => {                       
          let hoy = new Date();                                            
          let devolucion = new Date();
          devolucion.setDate(hoy.getDate() + 3);
          let fechaInicio =this.miDatePipe.transform(hoy, 'yyyy-MM-dd');
          let fechaTermino =this.miDatePipe.transform(devolucion, 'yyyy-MM-dd');                            
          let fechaFormateada = this.miDatePipe.transform(data.fecha, "YYYY-MM-dd");                         
          var time1 = moment(fechaInicio).format('YYYY-MM-DD');
          var time2 = moment(fechaTermino).format('YYYY-MM-DD');
          var time3 = moment(fechaFormateada).format('YYYY-MM-DD');
          if(data.tipoEgreso == "Prestamos Bancarios" || data.tipoEgreso == "Prestamos Automotriz"){
            if(time3 >= time1 && data.estadoCuota == "Pendiente")
            // if(time3 >= time1 && time3 <= time2 && data.estadoCuota == "Pendiente")
            {                                
            this.eventsCalendar.push(
              {                      
                //Verde
                title: 'Descripcion:  ' + data.descripcion,
                start: fechaFormateada,  
                color: '#0da62e',
                description: data.idEgreso,              
              });
            } 
            if(data.estadoCuota == "Pendiente" && time3 < time1){
              this.alert.reminderAlert(`La cuota ${data.descripcion} esta vencida`);                  
              this.eventsCalendar.push(
                {    
                  //Rojo                  
                  title: 'Descripcion:  ' + data.descripcion,
                  start: fechaFormateada,  
                  color: '#ba1206',
                  description: data.idEgreso,                
                });
            }
            if(data.estadoCuota == "Pagado"){
            this.eventsCalendar.push(
              {    
                //Azul                  
                title: 'Descripcion:  ' + data.descripcion,
                start: fechaFormateada,  
                color: '#2e4fd1',
                description: data.idEgreso,                            
              });
            }
          }
          });        
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          dateClick: this.handleDateClick.bind(this),
          events: this.eventsCalendar,          
          locale: esLocale,
          eventClick: this.mostrar.bind(this), 
          eventDidMount: (info) => {
            tippy(info.el, {
             content: info.event.title,                                       
             })
           }                    
        };
    });
  }

  
  mostrar(arg: any){
    let idCuota = arg.event._def.extendedProps.description;
    localStorage.setItem("idEgresoPago", idCuota);    
    this.abogadosService.openDialogRegistrarPagoCuota(idCuota);    
  }
  
  ActualizarCalendario(){
    window.location.reload();    
  }

  handleDateClick(arg: any) {    
    this.abogadosService.buscarCuotas().subscribe((egresos: EgresoFirmaCuota[]) => {            
      this.dataEgresos = egresos.map(Egresos => {        
        return Egresos;
      });
      this.dataEgresos.forEach(data => {                       
          let hoy = new Date();                    
          let devolucion = new Date();
          devolucion.setDate(hoy.getDate() + 3);
          let fechaInicio =this.miDatePipe.transform(hoy, 'yyyy-MM-dd');
          let fechaTermino =this.miDatePipe.transform(devolucion, 'yyyy-MM-dd');                            
          let fechaFormateada = this.miDatePipe.transform(data.fecha, "YYYY-MM-dd");                         
          var time1 = moment(fechaInicio).format('YYYY-MM-DD');
          var time2 = moment(fechaTermino).format('YYYY-MM-DD');
          var time3 = moment(fechaFormateada).format('YYYY-MM-DD');
          if(time3 >= time1 && time3 <= time2)
          {
          //Si la cuota esta por vencerse
          console.log("si esta por vencer");
          } else{            
            console.log("si aun falta por vencerse");
          }
        });              
    });
  }

}
