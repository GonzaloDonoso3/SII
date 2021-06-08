import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosIngresosTabsComponent } from './abogados-ingresos-tabs.component';

describe('AbogadosIngresosTabsComponent', () => {
  let component: AbogadosIngresosTabsComponent;
  let fixture: ComponentFixture<AbogadosIngresosTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosIngresosTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosIngresosTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
