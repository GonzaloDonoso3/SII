import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBankAccountFormComponent } from './create-bank-account-form.component';

describe('CreateBankAccountFormComponent', () => {
  let component: CreateBankAccountFormComponent;
  let fixture: ComponentFixture<CreateBankAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBankAccountFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBankAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
