import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { EgresosRentacar } from '@app/_models/rentacar/egresoRentacar';
import { CalendarOptions } from '@fullcalendar/angular';
import { DatePipe } from "@angular/common";


@Component({
  selector: 'app-rentacar-home',
  templateUrl: './rentacar-home.component.html',
  styleUrls: ['./rentacar-home.component.scss'],
  providers: [DatePipe]
})
export class RentacarHomeComponent implements OnInit {
  
  //Creación de variables y asignación de datos
  dataSource: MatTableDataSource<EgresosRentacar> = new MatTableDataSource();
  dataEgresos: EgresosRentacar[] = [];

  fechaPago: any;
  eventsCalendar: any= [];
  //calendarOptions: any;



  constructor(
    private miDatePipe: DatePipe,
  ) { }

  buscarFecha(): void {
    this.dataEgresos.forEach(data => {            
      const fechaFormateada = this.miDatePipe.transform(data.fecha, "yyyy-MM-dd");
      //console.log(fechaFormateada);
      this.eventsCalendar.push(
        {        
          title: 'Tipo de egreso:  ' + data.tipoEgreso,
          date: 'Vencimiento de cuota:  ' + data.fecha,          
        });
      
    });
    
    const colors: any = {
      red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
      },
      yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
      },
    };
    

  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    events: [
      { title: 'event 1', date: '2021-05-14' },
      { title: 'event 2', date: '2021-05-16' }
    ]
    
  };
  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr)
  }

  ngOnInit(): void {
  }

}

