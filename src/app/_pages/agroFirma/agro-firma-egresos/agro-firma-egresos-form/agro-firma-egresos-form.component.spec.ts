import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFirmaEgresosFormComponent } from './agro-firma-egresos-form.component';

describe('AgroFirmaEgresosFormComponent', () => {
  let component: AgroFirmaEgresosFormComponent;
  let fixture: ComponentFixture<AgroFirmaEgresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFirmaEgresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFirmaEgresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
