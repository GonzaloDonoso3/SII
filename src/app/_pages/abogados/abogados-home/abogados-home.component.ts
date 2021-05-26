import { Component, OnInit } from '@angular/core';
import esLocale from '@fullcalendar/core/locales/es';
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { CalendarOptions, EventApi } from '@fullcalendar/angular';
import { RegistroEgresoFirma } from '@app/_models/abogados/egresosFirma';
import { AbogadosService } from '@app/_pages/abogados/abogados.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-abogados-home',
  templateUrl: './abogados-home.component.html',
  styleUrls: ['./abogados-home.component.scss'],
  providers: [DatePipe]
})
export class AbogadosHomeComponent implements OnInit {

  //Creación de variables y asignación de datos
  dataSource: MatTableDataSource<RegistroEgresoFirma> = new MatTableDataSource();
  dataEgresos: RegistroEgresoFirma[] = [];

  eventsCalendar : any = [];
  calendarOptions!: CalendarOptions; 


  constructor(
    private abogadosService: AbogadosService,
    private miDatePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getEgresos();
  }

  getEgresos() {           
    this.abogadosService.egresoGetAll().subscribe((egresos: RegistroEgresoFirma[]) => {            
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
          this.eventsCalendar.push(
            {        
              title: 'Egreso:  ' + data.tipoEgreso,
              start: fechaFormateada,  
              color: 'red',        
            });
          } else{
          this.eventsCalendar.push(
            {        
              title: 'Egreso:  ' + data.tipoEgreso,
              start: fechaFormateada,  
              color: 'blue',        
            });
          }
        });        
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          dateClick: this.handleDateClick.bind(this),
          events: this.eventsCalendar,          
          locale: esLocale,          
        };
    });
  }

  
  handleDateClick(arg: any) {    
    this.abogadosService.egresoGetAll().subscribe((egresos: RegistroEgresoFirma[]) => {            
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
