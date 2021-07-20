import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFirmaIngresosListComponent } from './agro-firma-ingresos-list.component';

describe('AgroFirmaIngresosListComponent', () => {
  let component: AgroFirmaIngresosListComponent;
  let fixture: ComponentFixture<AgroFirmaIngresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFirmaIngresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFirmaIngresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
