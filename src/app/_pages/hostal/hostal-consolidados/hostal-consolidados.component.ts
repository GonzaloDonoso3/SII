import {Component, OnInit, EventEmitter, ViewChildren, ViewChild, QueryList, ElementRef} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { HostalService } from '@app/_pages/hostal/hostal.service'
import { ConsolidadosHostal } from '@app/_models/hostal/consolidadosHostal'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AlertHelper } from '@app/_helpers/alert.helper'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { SelectionModel } from '@angular/cdk/collections'
import { FormControl, FormGroup } from '@angular/forms'
import Chart from 'chart.js/auto'
import { ChangeDetectorRef } from '@angular/core'
import * as ExcelProper from "exceljs";
import * as Excel from "exceljs";
import * as FileSaver from 'file-saver';
import { link } from 'fs'
import { timeout } from 'rxjs/operators'
//import { jsPDF } from 'jspdf'
//import html2canvas from 'html2canvas'

@Component({
  selector: 'app-hostal-consolidados',
  templateUrl: './hostal-consolidados.component.html',
  styleUrls: ['./hostal-consolidados.component.scss']
})
export class HostalConsolidadosComponent implements OnInit {
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>()
  @ViewChild(MatSort) sort = null

  @ViewChildren(MatPaginator) paginatorEgresos = new QueryList<MatPaginator>()
  @ViewChild(MatSort) sortEgresos = null

  @ViewChild('barChart', { static: false }) private chartRef!: ElementRef
  @ViewChild('htmlData') htmlData!: ElementRef
  //dataSourceEgresos: MatTableDataSource<ConsolidadosHostal> = new MatTableDataSource();
  //@ViewChild('TableTwoPaginator', {static: true}) tableTwoPaginator: MatPaginator;
  //@ViewChild('TableTwoSort', {static: true}) tableTwoSort: MatSort;

  workbook: ExcelProper.Workbook = new Excel.Workbook();
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';


  formularioListo = new EventEmitter<string>()

  displayedColumns: string[] = ['select', 'id', 'fecha', 'monto']

  displayedColumnsTwo: string[] = ['select', 'id', 'fecha', 'monto']

  dataSource: MatTableDataSource<ConsolidadosHostal> = new MatTableDataSource()
  dataSourceEgresos: MatTableDataSource<ConsolidadosHostal> = new MatTableDataSource()
  dataIngresosTable: ConsolidadosHostal[] = []
  dataEgresosTable: ConsolidadosHostal[] = []

  // ? construccion del formulario,
  consolidadosForm = this.fb.group({
    //agregar el detalle del formulario;
    consolidados: [null, Validators.required],
    sucursales: [null, Validators.required],
    //egresos: [null, Validators.required],
    tramos: [null, Validators.required],
    trimestre: [null],
    semestre: [null],
    month: [null, Validators.required],
    year: [null],
    fechaI: [null],
    fechaF: [null]
  })

  //filtros
  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl()
  })

  consolidado: ConsolidadosHostal = new ConsolidadosHostal()
  selection = new SelectionModel<ConsolidadosHostal>(true, [])
  dataConsolidados: any
  selectedRows!: any[]
  dataIngresos: any[] = []
  dataEgresos: any[] = []
  totalIngreso: number = 0
  totalEgreso: number = 0
  sumIngresos: number = 0
  sumIngresosG: number = 0
  sumEgresosG: number = 0
  sumG: number = 0
  sumEgresos: number = 0
  totalConsolidado: number = 0
  resultadoIE: number = 0
  ingresoPorDia: string = ''
  egresoPorDia: string = ''
  base64I: any
  


  mostrarFechaIF: boolean = true
  mostrarTrimestre: boolean = true
  mostrarSemestre: boolean = true
  mostrarMes: boolean = true
  mostrarAnno: boolean = true

  //VARIABLES PARA EL GRAFICO
  chart: any
  montoIngreso: any[] = []
  montoEgreso: any[] = []
  totalIngresoG: any[] = []
  totalEgresoG: any[] = []
  totalIngresoC: any[] = []
  totalEgresoC: any[] = []
  totalG: any[] = []
  fechaG: any[] = []
  resultado: any[] = []

  uniqueArr: any[] = []
  uniqueArr2: any[] = []
  fechaUnica: any[] = []
  

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private alert: AlertHelper,
    private hostalService: HostalService,
    private elementRef: ElementRef,
    private _cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {}

  //Metodo para mostrar numero de cuotas
  activarFechaIF(): void {
    this.mostrarFechaIF = false
    this.consolidadosForm.controls['fechaI'].setValidators(Validators.required)
    this.consolidadosForm.controls['fechaF'].setValidators(Validators.required)
    this.consolidadosForm.controls['fechaI'].updateValueAndValidity()
    this.consolidadosForm.controls['fechaF'].updateValueAndValidity()

    this.mostrarMes = true
    this.consolidadosForm.controls['month'].clearValidators()
    this.consolidadosForm.controls['month'].updateValueAndValidity()

    this.mostrarTrimestre = true
    this.consolidadosForm.controls['trimestre'].clearValidators()
    this.consolidadosForm.controls['trimestre'].updateValueAndValidity()

    this.mostrarAnno = true
    this.consolidadosForm.controls['year'].clearValidators()
    this.consolidadosForm.controls['year'].updateValueAndValidity()

    this.mostrarSemestre = true
    this.consolidadosForm.controls['semestre'].clearValidators()
    this.consolidadosForm.controls['semestre'].updateValueAndValidity()
  }
  //Metodo para ocultar los numeros de cuotas
  activarAnno(): void {
    this.mostrarAnno = false
    this.consolidadosForm.controls['year'].setValidators(Validators.required)
    this.consolidadosForm.controls['year'].updateValueAndValidity()
    
    this.mostrarFechaIF = true
    this.consolidadosForm.controls['fechaI'].clearValidators()
    this.consolidadosForm.controls['fechaF'].clearValidators()
    this.consolidadosForm.controls['fechaI'].updateValueAndValidity()
    this.consolidadosForm.controls['fechaF'].updateValueAndValidity()

    this.mostrarTrimestre = true
    this.consolidadosForm.controls['trimestre'].clearValidators()
    this.consolidadosForm.controls['trimestre'].updateValueAndValidity()

    this.mostrarMes = true
    this.consolidadosForm.controls['month'].clearValidators()
    this.consolidadosForm.controls['month'].updateValueAndValidity()

    this.mostrarSemestre = true
    this.consolidadosForm.controls['semestre'].clearValidators()
    this.consolidadosForm.controls['semestre'].updateValueAndValidity()
  }

  //Metodo para mostrar el numero de trimestre
  activarTrimestre(): void {
    this.mostrarTrimestre = false
    this.consolidadosForm.controls['trimestre'].setValidators(Validators.required)
    this.consolidadosForm.controls['trimestre'].updateValueAndValidity()

    this.mostrarAnno = false
    this.consolidadosForm.controls['year'].setValidators(Validators.required)
    this.consolidadosForm.controls['year'].updateValueAndValidity()

    this.mostrarFechaIF = true
    this.consolidadosForm.controls['fechaI'].clearValidators()
    this.consolidadosForm.controls['fechaF'].clearValidators()
    this.consolidadosForm.controls['fechaI'].updateValueAndValidity()
    this.consolidadosForm.controls['fechaF'].updateValueAndValidity()

    this.mostrarMes = true
    this.consolidadosForm.controls['month'].clearValidators()
    this.consolidadosForm.controls['month'].updateValueAndValidity()

    this.mostrarSemestre = true
    this.consolidadosForm.controls['semestre'].clearValidators()
    this.consolidadosForm.controls['semestre'].updateValueAndValidity()
  }

  //Metodo para mostrar el numero de semestre
  activarSemestre(): void {
    this.mostrarSemestre = false
    this.consolidadosForm.controls['semestre'].setValidators(Validators.required)
    this.consolidadosForm.controls['semestre'].updateValueAndValidity()

    this.mostrarAnno = false
    this.consolidadosForm.controls['year'].setValidators(Validators.required)
    this.consolidadosForm.controls['year'].updateValueAndValidity()

    this.mostrarFechaIF = true
    this.consolidadosForm.controls['fechaI'].clearValidators()
    this.consolidadosForm.controls['fechaF'].clearValidators()
    this.consolidadosForm.controls['fechaI'].updateValueAndValidity()
    this.consolidadosForm.controls['fechaF'].updateValueAndValidity()

    this.mostrarMes = true
    this.consolidadosForm.controls['month'].clearValidators()
    this.consolidadosForm.controls['month'].updateValueAndValidity()
  }

  //Metodo para mostrar el numero de mes
  activarMes(): void {
    this.mostrarMes = false
    this.consolidadosForm.controls['month'].setValidators(Validators.required)
    this.consolidadosForm.controls['month'].updateValueAndValidity()

    this.mostrarAnno = false
    this.consolidadosForm.controls['year'].setValidators(Validators.required)
    this.consolidadosForm.controls['year'].updateValueAndValidity()

    this.mostrarFechaIF = true
    this.consolidadosForm.controls['fechaI'].clearValidators()
    this.consolidadosForm.controls['fechaF'].clearValidators()
    this.consolidadosForm.controls['fechaI'].updateValueAndValidity()
    this.consolidadosForm.controls['fechaF'].updateValueAndValidity()

    this.mostrarTrimestre = true
    this.consolidadosForm.controls['trimestre'].clearValidators()
    this.consolidadosForm.controls['trimestre'].updateValueAndValidity()

    this.mostrarSemestre = true
    this.consolidadosForm.controls['semestre'].clearValidators()
    this.consolidadosForm.controls['semestre'].updateValueAndValidity()
  }

  onSubmit() {
    switch (this.consolidadosForm.status) {
      case 'VALID':
        this.consolidado.consolidados = this.consolidadosForm.value.consolidados
        this.consolidado.sucursales = this.consolidadosForm.value.sucursales
        //this.consolidado.egresos = this.consolidadosForm.value.egresos
        this.consolidado.tramos = this.consolidadosForm.value.tramos
        this.consolidado.trimestre = this.consolidadosForm.value.trimestre
        this.consolidado.semestre = this.consolidadosForm.value.semestre
        this.consolidado.month = this.consolidadosForm.value.month
        this.consolidado.year = this.consolidadosForm.value.year
        this.consolidado.fechaI = this.consolidadosForm.value.fechaI
        this.consolidado.fechaF = this.consolidadosForm.value.fechaF

        if (this.consolidado.consolidados.length > 0) {
          this.hostalService
            .buscarConsolidado(this.consolidado)
            .pipe()
            .subscribe(
              (data: any) => {
                this.dataConsolidados = data.payload                
                //*************OPCION 2 ************/
                if (this.dataConsolidados.valor == 2) {
                  this.dataIngresos = this.dataConsolidados.valor1
                  this.formularioListo.emit('true')
                  this.consolidadosForm.reset()

                  //llenando la tabla Ingresos
                  this.dataIngresosTable = this.dataIngresos.map((ingreso) => {
                    return ingreso
                  })
                  this.dataSource = new MatTableDataSource(
                    this.dataIngresosTable
                  )
                  this.dataSource.paginator = this.paginator.toArray()[0]
                  this.dataSource.sort = this.sort

                  for (var i = 0; i < this.dataIngresos.length; i++) {
                    this.totalIngreso = this.dataIngresos[i]['monto']
                    // this.ingresoPorDia = this.dataIngresos[i]['fecha'].substring(10,8);
                    this.ingresoPorDia = this.dataIngresos[i]['fecha']
                    this.montoIngreso.push(this.totalIngreso)
                    this.sumIngresos = this.sumIngresos + this.totalIngreso

                    // Guardando en el array para recorrer
                    this.totalIngresoG.push({
                      fecha: this.ingresoPorDia,
                      monto: this.totalIngreso
                    })
                  }
                  //this.totalConsolidado = this.sumIngresos - this.sumEgresos;
                  this.mostrarGraficoI()
                  //this.chart.destroy();
                }

                //*************OPCION 3 ************/
                if (this.dataConsolidados.valor == 3) {
                  this.dataEgresos = this.dataConsolidados.valor2
                  this.formularioListo.emit('true')
                  this.consolidadosForm.reset()

                  //llenando la tabla Ingresos
                  this.dataEgresosTable = this.dataEgresos.map((egreso) => {
                    return egreso
                  })
                  this.dataSource = new MatTableDataSource(
                    this.dataEgresosTable
                  )
                  this.dataSource.paginator = this.paginator.toArray()[0]
                  this.dataSource.sort = this.sort

                  for (var i = 0; i < this.dataEgresos.length; i++) {
                    this.totalEgreso = this.dataEgresos[i]['monto']
                    // this.egresoPorDia = this.dataEgresos[i]['fecha'].substring(10,8);
                    this.egresoPorDia = this.dataEgresos[i]['fecha']
                    this.montoEgreso.push(this.totalEgreso)
                    this.sumEgresos = this.sumEgresos + this.totalEgreso

                    // Guardando en el array para recorrer
                    this.totalEgresoG.push({
                      fecha: this.egresoPorDia,
                      monto: this.totalIngreso
                    })
                  }
                  //this.totalConsolidado = this.sumIngresos - this.sumEgresos;
                  this.mostrarGraficoE()
                  //this.chart.destroy();
                }

                //*************OPCION 4 ************/
                if (this.dataConsolidados.valor == 4) {
                  this.dataIngresos = this.dataConsolidados.valor1
                  this.dataEgresos = this.dataConsolidados.valor2
                  this.formularioListo.emit('true')
                  this.consolidadosForm.reset()

                  //llenando la tabla Ingresos
                  this.dataIngresosTable = this.dataIngresos.map((ingreso) => {
                    return ingreso
                  })
                  this.dataSource = new MatTableDataSource(this.dataIngresosTable)
                  this.dataSource.paginator = this.paginator.toArray()[0]
                  this.dataSource.sort = this.sort

                  //llenando la tabla Egresos
                  this.dataEgresosTable = this.dataEgresos.map((egreso) => {
                    return egreso
                  })
                  this.dataSourceEgresos = new MatTableDataSource(
                    this.dataEgresosTable
                  )
                  this.dataSourceEgresos.paginator = this.paginator.toArray()[0]
                  this.dataSourceEgresos.sort = this.sort
                                  
                  
                  //*********************INGRESOS********************* 
                  // Obteniendo fecha unica en los ingresos                                   
                  for (var i = 0; i < this.dataIngresos.length; i++) {
                    this.uniqueArr.push(this.dataIngresos[i]['fecha']) 
                  }
                  this.fechaUnica = [...new Set(this.uniqueArr)]
                  this.fechaUnica.sort()
                  let sum = 0;
                  this.fechaUnica.map((num) => {
                    sum = 0;
                    this.dataIngresos.filter((num2) => {
                      if(num2.fecha == num){
                        sum = sum + num2.monto;
                      }                      
                    })                                        
                    this.totalIngresoG.push(sum)
                  })                                                    
                  this.totalIngresoG.map((monto)=>{
                    this.sumIngresos = this.sumIngresos + monto;
                  })
                  //*********************EGRESOS*********************
                  for (var i = 0; i < this.dataEgresos.length; i++) {
                    if (this.totalEgresoG.length > 0) {
                      for (var f = 0; f < this.totalEgresoG.length; f++) {
                        if (
                          this.dataEgresos[i]['fecha'] ==
                          this.totalEgresoG[f]['fecha']
                        ) {
                          this.sumEgresosG =
                            this.dataEgresos[i]['monto'] +
                            this.totalEgresoG[f]['monto']
                          this.totalEgresoC.push({
                            fecha: this.dataEgresos[i]['fecha'],
                            monto: this.sumEgresosG
                          })
                        }
                      }
                    }

                    this.totalEgreso = this.dataEgresos[i]['monto']
                    // this.egresoPorDia = this.dataEgresos[i]['fecha'].substring(10,8);
                    this.egresoPorDia = this.dataEgresos[i]['fecha']
                    this.montoEgreso.push(this.totalEgreso)
                    this.sumEgresos = this.sumEgresos + this.totalEgreso

                    // Guardando en el array para recorrer
                    this.totalEgresoG.push({
                      fecha: this.egresoPorDia,
                      monto: this.totalEgreso
                    })
                  }

                  //****************** INGRESOS - EGRESOS********************
                  for (var i = 0; i < this.totalIngresoC.length; i++) {
                    for (var k = 0; k < this.totalEgresoC.length; k++) {
                      this.resultadoIE = this.totalIngresoC[i]['monto'] + this.totalEgresoC[k]['monto'];
                      this.resultado.push(this.resultadoIE);
                      if (this.totalIngresoC[i]['fecha'] == this.totalEgresoC[k]['fecha']) 
                      {
                        this.sumG = this.totalIngresoC[i]['monto'] + this.totalEgresoC[k]['monto']                        
                        this.totalG.push(this.totalEgresoC[k]['monto'])
                        this.fechaG.push(this.totalEgresoC[k]['fecha'])
                      }
                    }
                  }
                  this.totalConsolidado = this.sumIngresos - this.sumEgresos
                  this.mostrarGraficoIE();                  
                  //this.chart.destroy();
                }

                //*************OPCION 1 ************/
                if (this.dataConsolidados.valor == 1) {
                  this.dataIngresos = this.dataConsolidados.valor1
                  this.dataEgresos = this.dataConsolidados.valor2
                  this.formularioListo.emit('true')
                  this.consolidadosForm.reset()

                  //llenando la tabla Ingresos
                  this.dataIngresosTable = this.dataIngresos.map((ingreso) => {
                    return ingreso
                  })
                  this.dataSource = new MatTableDataSource(
                    this.dataIngresosTable
                  )
                  this.dataSource.paginator = this.paginator.toArray()[0]
                  this.dataSource.sort = this.sort

                  //llenando la tabla Egresos
                  this.dataEgresosTable = this.dataEgresos.map((egreso) => {
                    return egreso
                  })
                  this.dataSourceEgresos = new MatTableDataSource(
                    this.dataEgresosTable
                  )
                  this.dataSourceEgresos.paginator = this.paginator.toArray()[0]
                  this.dataSourceEgresos.sort = this.sort

                  //*********************INGRESOS*********************
                  for (var i = 0; i < this.dataIngresos.length; i++) {
                    if (this.totalIngresoG.length > 0) {
                      for (var f = 0; f < this.totalIngresoG.length; f++) {
                        if (
                          this.dataIngresos[i]['fecha'] ==
                          this.totalIngresoG[f]['fecha']
                        ) {
                          this.sumIngresosG =
                            this.dataIngresos[i]['monto'] +
                            this.totalIngresoG[f]['monto']
                          this.totalIngresoC.push({
                            fecha: this.totalIngresoG[f]['fecha'],
                            monto: this.sumIngresosG
                          })
                        }
                      }
                    }
                    this.totalIngreso = this.dataIngresos[i]['monto']
                    // this.ingresoPorDia = this.dataIngresos[i]['fecha'].substring(10,8);
                    this.ingresoPorDia = this.dataIngresos[i]['fecha']
                    this.montoIngreso.push(this.totalIngreso)
                    this.sumIngresos = this.sumIngresos + this.totalIngreso

                    // Guardando en el array para recorrer
                    this.totalIngresoG.push({
                      fecha: this.ingresoPorDia,
                      monto: this.totalIngreso
                    })
                  }
                  //*********************EGRESOS*********************
                  for (var i = 0; i < this.dataEgresos.length; i++) {
                    if (this.totalEgresoG.length > 0) {
                      for (var f = 0; f < this.totalEgresoG.length; f++) {
                        if (
                          this.dataEgresos[i]['fecha'] ==
                          this.totalEgresoG[f]['fecha']
                        ) {
                          this.sumEgresosG =
                            this.dataEgresos[i]['monto'] +
                            this.totalEgresoG[f]['monto']
                          this.totalEgresoC.push({
                            fecha: this.dataEgresos[i]['fecha'],
                            monto: this.sumEgresosG
                          })
                        }
                      }
                    }

                    this.totalEgreso = this.dataEgresos[i]['monto']
                    // this.egresoPorDia = this.dataEgresos[i]['fecha'].substring(10,8);
                    this.egresoPorDia = this.dataEgresos[i]['fecha']
                    this.montoEgreso.push(this.totalEgreso)
                    this.sumEgresos = this.sumEgresos + this.totalEgreso

                    // Guardando en el array para recorrer
                    this.totalEgresoG.push({
                      fecha: this.egresoPorDia,
                      monto: this.totalEgreso
                    })
                  }

                  //****************** INGRESOS - EGRESOS********************
                  for (var i = 0; i < this.totalIngresoC.length; i++) {
                    for (var k = 0; k < this.totalEgresoC.length; k++) {
                      this.resultadoIE = this.totalIngresoC[i]['monto'] + this.totalEgresoC[k]['monto'];
                      this.resultado.push(this.resultadoIE);
                      if (
                        this.totalIngresoC[i]['fecha'] ==
                        this.totalEgresoC[k]['fecha']
                      ) {
                        this.sumG =
                          this.totalIngresoC[i]['monto'] +
                          this.totalEgresoC[k]['monto']
                        //this.totalG.push({"fecha": this.totalEgresoC[k]['fecha'], "monto": this.sumG});
                        this.totalG.push(this.totalEgresoC[k]['monto'])
                        this.fechaG.push(this.totalEgresoC[k]['fecha'])
                      }
                    }
                  }
                  this.totalConsolidado = this.sumIngresos - this.sumEgresos
                  this.mostrarGrafico()
                  //this.chart.destroy();
                }

              },
              (error: any) => {
                this.snackBar.open(
                  'No existe fechas asociadas al consolidado',
                  'cerrar',
                  {
                    duration: 2000,
                    verticalPosition: 'top'
                  }
                )
                console.log(error)
              }
            )
        }

        break
      case 'INVALID':
        this.snackBar.open('Debe completar el Formulario', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top'
        })
        break
      default:
        break
    }
  }

  // ? selection rows
  // *  INFO this.selection.selected : return array with all selected objects(rows) into table
  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  openPDF(selector: any, visible: any) {
    var elemento = document.querySelector(selector);    
    if (elemento != null) {
    elemento.style.display = visible?'block':'none';
    }
    window.print()
    elemento.style.display = visible?'none':'block';
  }

  //Metodo exportar excel
  // exportAsXLSX(): void {
  //   this.selectedRows = [];
  //   this.selection.selected.forEach((x) => this.selectedRows.push(x));
  //   this.hostalService.exportAsExcelFile(this.selectedRows, 'Consolidados-Hostal');
  // }

  exportAsXLSX(): void {
    let worksheet = this.workbook.addWorksheet('My Sheet', {
      properties: {
        defaultRowHeight: 100,
      }
    });

    worksheet.columns = [      
      { header: 'Imagen', key: 'imagen', width: 150 },
    ];
    
    var myBase64Image = this.base64I;    
    var imageId2 = this.workbook.addImage({
      base64: myBase64Image,
      extension: 'png'
    });

    worksheet.addImage(imageId2, 'A2:A2');    
    var row = worksheet.getRow(2);
    row.height = 300;

    this.workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: this.blobType });      
      FileSaver.saveAs(blob, 'Consolidado-Hostal' + '.xlsx');
    });
  }

  masterToggle() {    
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach((row) => {
          this.selection.select(row)
        })
  }

  //************* Funcion PDF ****************

  // public openPDF():void {
  //   let ll = document.getElementById('htmlData') as HTMLImageElement;

  //   html2canvas(ll).then(canvas => {

  //       let fileWidth = 208;
  //       let fileHeight = canvas.height * fileWidth / canvas.width;

  //       const FILEURI = canvas.toDataURL('image/png')
  //       let PDF = new jsPDF('p', 'mm', 'a4');
  //       let position = 0;
  //       PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

  //       PDF.save('angular-demo.pdf');
  //   });
  //   }

  // ************************ GRAFICOS ************************
  mostrarGraficoI() {
    this._cdref.detectChanges()
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          '2021-01-02',
          '2021-01-03',
          '2021-01-04',
          '2021-01-05',
          '2021-01-06',
          '2021-01-09',
          '2021-01-10',
          '2021-01-11',
          '2021-01-12',
          '2021-01-13',
          '2021-01-14',
          '2021-01-15'
        ],
        //labels: this.fechaG,
        datasets: [
          {
            label: 'Ingresos',
            backgroundColor: ['#f2829b'],
            //data: [2478,5267,734,784,433]
            data: this.montoIngreso
            //data: this.totalG
          }
        ]
      }
    })
  }

  mostrarGraficoE() {
    this._cdref.detectChanges()
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          '2021-01-02',
          '2021-01-03',
          '2021-01-04',
          '2021-01-05',
          '2021-01-06',
          '2021-01-09',
          '2021-01-10',
          '2021-01-11',
          '2021-01-12',
          '2021-01-13',
          '2021-01-14',
          '2021-01-15'
        ],
        //labels: this.fechaG,
        datasets: [
          {
            label: 'Egresos',
            backgroundColor: ['#ffe510'],
            //data: [2478,5267,734,784,433]
            data: this.montoEgreso
            //data: this.totalG
          }
        ]
      }
    })
  }

  mostrarGraficoIE() {     
      this._cdref.detectChanges()
      this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        // labels: [
        //   '2021-01-02',
        //   '2021-01-03',
        //   '2021-01-04',
        //   '2021-01-05',
        //   '2021-02-06',
        //   '2021-02-09',
        //   '2021-02-10',
        //   '2021-02-11',
        //   '2021-03-12',
        //   '2021-03-13',
        //   '2021-03-14',
        //   '2021-03-15'
        // ],
        labels: this.fechaUnica,
        datasets: [
          {
            label: 'Ingresos',
            //data: [65, 59, 80, 81, 56, 55, 40],
            data: this.totalIngresoG,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Egresos',
            //data: [65, 59, 80, 81, 56, 55, 40],
            data: this.montoEgreso,
            fill: false,
            borderColor: '#64c04b',
            tension: 0.1
          },
          {
            label: 'Resultado',
            //data: [65, 59, 80, 81, 56, 55, 40],
            data: this.resultado,
            fill: false,
            borderColor: '#a74bc0',
            tension: 0.1
          },
        ]
      },
      options: {
        //responsive: false,                
        animation : {
           onComplete : () => {
            this.base64I = this.chart.toBase64Image();
           }
        }      
     }
    })           
  } 
  
  mostrarGrafico() { 
    this._cdref.detectChanges()
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: [
          'Enero',
          'Febrero',
          'Marzo',          
        ],
        //labels: this.fechaG,
        datasets: [
          {
            label: 'Ingresos',
            data: [3883365, 7377359, 5383380],
            //data: this.montoIngreso,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Egresos',
            data: [3243365, 4434359, 3434380],
            //data: this.montoEgreso,
            fill: false,
            borderColor: '#64c04b',
            tension: 0.1
          },
          {
            label: 'Resultado',
            data: [5332365, 6434359, 8434380],
            //data: this.resultado,
            fill: false,
            borderColor: '#a74bc0',
            tension: 0.1
          },
        ]
      }
    })    
  } 

}
