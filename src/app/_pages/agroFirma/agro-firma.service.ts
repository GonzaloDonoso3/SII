import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ProyectoAgrofirma } from '@app/_models/agroFirma/proyectoAgroFirma';
import { EgresoAgroFirma } from '@app/_models/agroFirma/egresoAgroFirma';
import { BehaviorSubject, Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { IngresoAgroFirma } from '@app/_models/agroFirma/ingresoAgroFirma';
import { AgroFirmaEgresosCuotasComponent } from './agro-firma-egresos/agro-firma-egresos-list/agro-firma-egresos-cuotas/agro-firma-egresos-cuotas.component';
import { AgroFirmaEgresosCuotaDialogComponent } from './agro-firma-egresos/agro-firma-egresos-list/agro-firma-egresos-cuotas/agro-firma-egresos-cuota-dialog/agro-firma-egresos-cuota-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EgresoAgroFirmaCuota } from '@app/_models/agroFirma/egresoAgroFirmaCuota';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class AgroFirmaService {


  private proyecto = 'obtenerProyecto';

  //egresos values
  public tiposEgresosList: Observable<string[]>;
  
  //egresos values
  private tiposEgresosListSubject: BehaviorSubject<string[]>;
  //proyectos values
  private proyectosListSubject: BehaviorSubject<ProyectoAgrofirma[]>;

  public proyectosList: Observable<ProyectoAgrofirma[]>;
  
  private tiposEgresos = ['Gastos', 'Costos', 'Remuneraciones', 'Impuestos', 'Bancarios', 'Prestamos Bancarios', 'Prestamos Automotriz'];
  private empresa = 'agroFirma';

  constructor( 
    private http: HttpClient,
    public dialog:MatDialog, 
    private snackBar: MatSnackBar ) {
    //egresos;
    this.tiposEgresosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tiposEgresos')!)
    );

    this.proyectosListSubject = new BehaviorSubject<ProyectoAgrofirma[]>(
      JSON.parse(localStorage.getItem('proyectos')!)
    );

    //egresos;
    this.tiposEgresosList = this.tiposEgresosListSubject.asObservable();
    this.proyectosList = this.proyectosListSubject.asObservable();
    localStorage.setItem('tiposEgresos', JSON.stringify(this.tiposEgresos));
  }
  
  //egresos values get methods:
  public get tiposEgresosListValue(): string[] {
  return this.tiposEgresosListSubject.value;
  }

  //proyectos values methods:
  public get proyectosListValue(): ProyectoAgrofirma[] {
    return this.proyectosListSubject.value;
  } 

  // METODO PARA EXPORTAR EXCEL
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + 'export' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  //----------Metodos Egresos------------

  egresoGetAll(): any {    
    return this.http.get<[]>(`${environment.apiUrl}/obtenerEgresos/:idProyecto`);
  }

  egresoRegistrar(egreso: EgresoAgroFirma): any {    
    return this.http.post(      
      `${environment.apiUrl}/egreso${this.empresa}/registrarEgreso`,
      egreso      
    );
  }

  
  getIncomeByProject(projectId: number): any {
    return this.http.get(`${environment.apiUrl}/egresoAgrofirma/obtenerEgresos/${projectId}`)
  }

  getById(id: string): any {    
    return this.http.get<any>(
      `${environment.apiUrl}/egreso${this.proyecto}/${id}`
    );
  }

  getAll(id: any): any {
    return this.http.get<[]>(
      `${environment.apiUrl}/egresoAgrofirma/obtenerEgresos/${id}`
    );
  }

  buscarImagen(url: string) {    
    const extencion = url.split('.');
    const extend = extencion[1];    
    return this.http
    .get(`${environment.apiUrl}/egresoAgrofirma/download/${url}`, {
        responseType: 'blob',
      })      
  }

  //-----------Metodos Ingresos---------------//

  registrarIngreso(ingreso: IngresoAgroFirma): any {
    return this.http.post(`${environment.apiUrl}/ingresoAgrofirma/registrarIngreso`, ingreso);
  }

  obtenerIngresos(): any {
    return this.http.get(`${environment.apiUrl}/ingresoAgrofirma/obtenerIngresos`);
  }

  obtenerIngresosPorProyecto(idProyecto: number): any {
    return this.http.get(`${environment.apiUrl}/ingresoAgrofirma/obtenerIngresosByProyecto/${idProyecto}`)
  }

  //----------Metodos Proyectos--------------//

  GetAllProyectos(): any {                  
    return this.http.get<[]>(`${environment.apiUrl}/proyectoAgrofirma/obtenerProyectos`);    
  }

  createProject(project: any): any {
    return this.http.post<[]>(`${environment.apiUrl}/proyectoAgrofirma/registrarProyecto`, project)
  }

  updateProject(projectId: any, project: any): any {
    return this.http.put<[]>(`${environment.apiUrl}/proyectoAgrofirma/actualizarProyecto/${projectId}`, project)
  }

  //----------Metodos Cuentas Bancarias-----------//

  getBankAccountsById(id: any): any {
    return this.http.get<[]>(`${environment.apiUrl}/banco/obtenerCuentasByEntity/${id}`)
  }

  createBankAccount(account: any): any {
    return this.http.post<[]>(`${environment.apiUrl}/banco/registrarCuentasBancarias`, account)
  }

  getBanks(): any {
    return this.http.get<[]>(`${environment.apiUrl}/banco/obtenerBancos`)
  }
  //****** EGRESOS POR CUOTAS ******//
  /* Egresos Por cuotas */
  getCuotas(id: any) {    
    return this.http.get<AgroFirmaEgresosCuotasComponent>(
      `${environment.apiUrl}/egresoAgroFirmaCuota/${id}`
    );
  }

  buscarImagenCuota(url: string) {    
    const extencion = url.split('.');
    const extend = extencion[1];    
    return this.http
    .get(`${environment.apiUrl}/egresoAgroFirmaCuota/download/${url}`, {
        responseType: 'blob',
      })      
  }
  
  agregarRespaldos(arrayRespaldos: any): any {
    return this.http.post(
      `${environment.apiUrl}/egresoAgroFirmaCuota/agregarRespaldos/`,
      arrayRespaldos
    );
  }
  buscarImagenC(id: any): any {
    return this.http.get<AgroFirmaEgresosCuotasComponent>(
      `${environment.apiUrl}/respaldoEgresoAgroFirmaCuota/${id}`
    );
  }

  // Metodo que permite abrir un Dialog (Modal)
  openDialogCuota():void{
    const dialogRef = this.dialog.open(AgroFirmaEgresosCuotaDialogComponent, {})
    dialogRef.afterClosed().subscribe((res) => {})
  }

  updateMonto(id: any, body: any[]) {    
    return this.http.put(`${environment.apiUrl}/egresoAgroFirmaCuota/${id}`, body);                
  }

  // Metodo que permite abrir un Dialog (Modal)
  openDialogRegistrarPago(idEgreso: any):void{
    //Si el cliente selecciono un contrato se habre el modal    
    if(idEgreso != null){
      const dialogRef = this.dialog.open(AgroFirmaEgresosCuotasComponent,{});
      dialogRef.afterClosed().subscribe(res =>{
        console.log(res);
      });
    }else{
      //Si no, se muestra un error
      this.snackBar.open('Por favor seleccione un egreso con cuotas sin pagar', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } 
  }

  closeDialogModal(){
    this.dialog.closeAll();
    localStorage.removeItem("idEgresoPago");
  }

  //Calendario 
  buscarCuotas(): any {
    return this.http.get<EgresoAgroFirmaCuota>(
      `${environment.apiUrl}/egresoAgroFirmaCuota/`
    );
  }
}
