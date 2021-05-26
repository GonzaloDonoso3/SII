import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, QueryList, ViewChildren, ViewChild} from '@angular/core';
import { EgresosRentacar } from '@app/_models/rentacar/egresoRentacar';
import { CalendarOptions } from '@fullcalendar/angular';
import { DatePipe } from "@angular/common";
import { RentacarService } from '@app/_pages/rentacar/rentacar.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import esLocale from '@fullcalendar/core/locales/es';
import * as moment from "moment";




@Component({
  selector: 'app-rentacar-home',
  templateUrl: './rentacar-home.component.html',
  styleUrls: ['./rentacar-home.component.scss'],
  providers: [DatePipe]
})
export class RentacarHomeComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = null;
  
  //Creación de variables y asignación de datos
  dataSource: MatTableDataSource<EgresosRentacar> = new MatTableDataSource();
  dataEgresos: EgresosRentacar[] = [];

  eventsCalendar : any = [];
  calendarOptions!: CalendarOptions; 

  constructor(
    private rentacarService: RentacarService,
    private miDatePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.getEgresos();
  }

  getEgresos() {           
    this.rentacarService.getAllEgresos().subscribe((egresos: EgresosRentacar[]) => {            
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
    this.rentacarService.getAllEgresos().subscribe((egresos: EgresosRentacar[]) => {            
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


