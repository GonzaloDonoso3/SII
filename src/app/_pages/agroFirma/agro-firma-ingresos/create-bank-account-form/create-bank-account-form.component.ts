import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-bank-account-form',
  templateUrl: './create-bank-account-form.component.html',
  styleUrls: ['./create-bank-account-form.component.scss']
})
export class CreateBankAccountFormComponent implements OnInit {

  bankAccountForm!: FormGroup
  projectId!: number
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.bankAccountForm = this.fb.group({
      idBanco: [null, Validators.required],
      numeroCuenta: [null, Validators.required],
      tipoCuenta: [null, Validators.required]
    })
  }

  onSubmit() {

  }

}
