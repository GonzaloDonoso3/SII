import { Component, OnInit, EventEmitter, ViewChildren, ViewChild, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HostalService } from '@app/_pages/hostal/hostal.service';
import { ConsolidadosHostal } from '@app/_models/hostal/consolidadosHostal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup } from '@angular/forms';
//import { Chart } from 'chart.js';
import Chart from 'chart.js/auto'
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-hostal-consolidados',
  templateUrl: './hostal-consolidados.component.html',
  styleUrls: ['./hostal-consolidados.component.scss']
})
export class HostalConsolidadosComponent implements OnInit {
  
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = null;
  
  @ViewChildren(MatPaginator) paginatorEgresos = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sortEgresos = null;
    
  //dataSourceEgresos: MatTableDataSource<ConsolidadosHostal> = new MatTableDataSource();
  //@ViewChild('TableTwoPaginator', {static: true}) tableTwoPaginator: MatPaginator;
  //@ViewChild('TableTwoSort', {static: true}) tableTwoSort: MatSort;


  formularioListo = new EventEmitter<string>();

  displayedColumns: string[] = [
    'select',
    'id',
    'fecha',
    'monto',    
    //'tipoEgreso',            
  ];

  displayedColumnsTwo: string[] = [
    'select',
    'id',
    'fecha',
    'monto',    
    //'tipoEgreso',            
  ];

  dataSource: MatTableDataSource<ConsolidadosHostal> = new MatTableDataSource();
  dataSourceEgresos: MatTableDataSource<ConsolidadosHostal> = new MatTableDataSource();
  dataIngresosTable: ConsolidadosHostal[] = [];
  dataEgresosTable: ConsolidadosHostal[] = [];

  // ? construccion del formulario,
  consolidadosForm = this.fb.group({
    //agregar el detalle del formulario;
    consolidados: [null, Validators.required],
    tramos: [null, Validators.required],
    month: [null, Validators.required],
    year: [null, Validators.required],
    fecha: [null, Validators.required],
  });

  //filtros
  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    // tipoEgreso: new FormControl(),
    // numeroCuota: new FormControl(),
  })

  consolidado: ConsolidadosHostal = new ConsolidadosHostal();
  //dataIngresosEgresos: ConsolidadosHostal[] = [];
  selection = new SelectionModel<ConsolidadosHostal>(true, []);
  dataConsolidados: any;
  dataIngresos: any[] = [];
  dataEgresos: any[] = [];
  totalIngreso: number = 0;
  totalEgreso: number = 0;
  sumIngresos: number = 0;
  sumEgresos: number = 0;
  totalConsolidado: number = 0;

  //VARIABLES PARA EL GRAFICO
  name = 'ChartJs';
  chart: any;
  data!: [{ x: '2016-12-25', y: 20 }, { x: '2016-12-26', y: 10 }]
  @ViewChild('barChart', { static: false }) private chartRef!: ElementRef;
  montoIngreso: any[] = [];
  montoEgreso: any[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private alert: AlertHelper,
    private hostalService: HostalService,
    private elementRef: ElementRef,
    private _cdref:ChangeDetectorRef
  ) {
    
   }

  ngOnInit(): void {    

  }

  onSubmit() {
    switch (this.consolidadosForm.status) {
      case 'VALID':
        this.consolidado.consolidados = this.consolidadosForm.value.consolidados;
        this.consolidado.tramos = this.consolidadosForm.value.tramos;
        this.consolidado.month = this.consolidadosForm.value.month;
        this.consolidado.year = this.consolidadosForm.value.year;
        this.consolidado.fecha = this.consolidadosForm.value.fecha;

        if (this.consolidado.consolidados.length > 0) {

          this.hostalService
            .buscarConsolidado(this.consolidado)
            .pipe()
            .subscribe(
              (data: any) => {                
                this.dataConsolidados = data.payload;
                this.dataIngresos = this.dataConsolidados.valor1
                this.dataEgresos = this.dataConsolidados.valor2
                this.formularioListo.emit('true');
                this.consolidadosForm.reset();  
                
                //llenando la tabla Ingresos
                this.dataIngresosTable = this.dataIngresos.map(ingreso => {                  
                  return ingreso;
                });
                this.dataSource = new MatTableDataSource(this.dataIngresosTable);
                this.dataSource.paginator = this.paginator.toArray()[0];
                this.dataSource.sort = this.sort;

                //llenando la tabla Egresos
                //this.dataIngresosTable = this.dataEgresos.map(egreso => {                  
                this.dataEgresosTable = this.dataEgresos.map(egreso => {                                    
                  return egreso;
                });
                this.dataSourceEgresos = new MatTableDataSource(this.dataEgresosTable);                
                this.dataSourceEgresos.paginator = this.paginator.toArray()[0];
                this.dataSourceEgresos.sort = this.sort;

                for (var i = 0; i < this.dataIngresos.length; i++) {
                  this.totalIngreso = this.dataIngresos[i]['monto'];
                  this.montoIngreso.push(this.totalIngreso); 
                  //console.log("imprimiendo el arreglo en la var", this.montoIngreso);
                  this.sumIngresos = this.sumIngresos + this.totalIngreso
                }
                for (var i = 0; i < this.dataEgresos.length; i++) {
                  this.totalIngreso = this.dataEgresos[i]['monto'];
                  this.montoEgreso.push(this.totalEgreso); 
                  this.sumEgresos = this.sumEgresos + this.totalIngreso
                }
                this.totalConsolidado = this.sumIngresos - this.sumEgresos;
                //console.log("total:", this.totalConsolidado);
                this.acople();
              },
              (error: any) => {
                this.snackBar.open('No existe fechas asociadas al consolidado', 'cerrar', {
                  duration: 2000,
                  verticalPosition: 'top',
                });
                console.log(error);
              }
            );
        }

        break;
      case 'INVALID':
        this.snackBar.open('Debe completar el Formulario', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
        break;
      default:
        break;
    }
  }
  
  // ? selection rows
  // *  INFO this.selection.selected : return array with all selected objects(rows) into table
  isAllSelected() {  
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {    
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => {
        this.selection.select(row);
      });
  }

  // ************************ GRAFICOS ************************
  
  //ngAfterViewInit() {
  acople() {
    console.log("wlnjwenfñ", this.montoIngreso)
    //console.log(this.chartRef.nativeElement);
    this._cdref.detectChanges();
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
    labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
    datasets: [
      {
        label: "Ingresos",
        backgroundColor: ["#3e95cd", "#3e95cd","#3e95cd","#3e95cd","#3e95cd"],
        //data: [2478,5267,734,784,433]
        data: this.montoIngreso
      },
      {
        label: "Egresos",
        backgroundColor: ["#3cba9f", "#3cba9f","#3cba9f","#3cba9f","#3cba9f"],
        data: [2478,5267,734,784,433]
      }
    ]
  },
  // options: {
  //   legend: { display: false },
  //   title: {
  //     display: true,
  //     text: 'Predicted world population (millions) in 2050'
  //   },
  //   maintainAspectRatio: false
  // }
    })
}
}
