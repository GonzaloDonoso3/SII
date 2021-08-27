import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { Banco } from '@app/_models/agroFirma/Banco';
import { CuentaRegistrada } from '@app/_models/agroFirma/cuentaRegistrada';

import { Observable } from 'rxjs';
import { AgroFirmaService } from '../../agro-firma.service';

@Component({
  selector: 'app-create-bank-account-form',
  templateUrl: './create-bank-account-form.component.html',
  styleUrls: ['./create-bank-account-form.component.scss']
})
export class CreateBankAccountFormComponent implements OnInit {

  @Output() formReady = new EventEmitter<number>()

  bankAccountForm!: FormGroup
  bankAccount!: CuentaRegistrada
  @Input() projectId!: Observable<number>
  banks: Banco[] = []
  
  
  constructor(private fb: FormBuilder,
    private agroFirmaService: AgroFirmaService,
    private alert: AlertHelper,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.bankAccountForm = this.fb.group({
      idBanco: [null, Validators.required],
      numeroCuenta: [null, Validators.required],
      tipoCuenta: [null, Validators.required],
      idProyecto: null
    })
    this.renderBanks()
  }

  onSubmit() {
    this.bankAccountForm.patchValue({ idProyecto: this.projectId })
    switch ( this.bankAccountForm.status ) {
      case 'VALID':
        this.bankAccount = this.bankAccountForm.getRawValue()
        this.agroFirmaService.createBankAccount(this.bankAccount)
        .pipe()
        .subscribe((data: any) => {
          this.alert.createAlert("Registro creado con éxito!")
          this.formReady.emit(new Date().getTime())
          this.bankAccountForm.reset()
        },
        (error: any) => {
          this.snackBar.open('Error al realizar el registro!', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top'
          })
        })
        break
      case 'INVALID':
        this.snackBar.open('Debe completar el Formulario', 'Cerrar', {
          duration: 2000,
          verticalPosition: 'top'
        })
        break
      
    }
  }

  renderBanks() {
    this.agroFirmaService.getBanks().subscribe( (data: any) => {
      this.banks = data
    })
  }

}
