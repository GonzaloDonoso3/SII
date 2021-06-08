import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFirmaEgresosComponent } from './agro-firma-egresos.component';

describe('AgroFirmaEgresosComponent', () => {
  let component: AgroFirmaEgresosComponent;
  let fixture: ComponentFixture<AgroFirmaEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFirmaEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFirmaEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
