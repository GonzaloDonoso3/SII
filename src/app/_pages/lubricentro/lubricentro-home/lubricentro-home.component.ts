import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit } from '@angular/core';
import { Empresa } from '@app/_models/shared/empresa';
import { Sucursal } from '@app/_models/shared/sucursal';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import esLocale from '@fullcalendar/core/locales/es';
import * as moment from "moment";
import { DatePipe } from "@angular/common";
import { CalendarOptions } from '@fullcalendar/angular';
import { EgresoLubricentro } from '@app/_models/lubricentro/egresoLubricentro';
import { LubricentroService } from '@app/_pages/lubricentro/lubricentro.service';

@Component({
  selector: 'app-lubricentro-home',
  templateUrl: './lubricentro-home.component.html',
  styleUrls: ['./lubricentro-home.component.scss'],
  providers: [DatePipe]
})
export class LubricentroHomeComponent implements OnInit {

//Creación de variables y asignación de datos
dataSource: MatTableDataSource<EgresoLubricentro> = new MatTableDataSource();
dataEgresos: EgresoLubricentro[] = [];

eventsCalendar : any = [];
calendarOptions!: CalendarOptions; 

  sucursales: Sucursal[] = [];
  empresa: Empresa = new Empresa();
  refrescar = '';
  constructor(
    private lubricentroService: LubricentroService,
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
    private miDatePipe: DatePipe,
  ) {
    this.empresaService.getAll().subscribe(data => {
      const empresa = data.filter(data => data.razonSocial.includes('LUBRICENTRO'));

      this.sucursalService.getByEmpresa(empresa[0].id).subscribe(data => {
        const sucursales = data;
        //console.log(data);
      });

    });

  }

  formularioListo(e: string): void {

    this.ngOnInit();
    this.refrescar = e;
  }
  ngOnInit(): void {
    this.getEgresos();
  }

  getEgresos() {           
    this.lubricentroService.egresoGetAll().subscribe((egresos: EgresoLubricentro[]) => {            
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
    this.lubricentroService.egresoGetAll().subscribe((egresos: EgresoLubricentro[]) => {            
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
