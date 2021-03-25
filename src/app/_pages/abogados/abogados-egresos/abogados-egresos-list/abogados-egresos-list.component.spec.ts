import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosEgresosListComponent } from './abogados-egresos-list.component';

describe('AbogadosEgresosListComponent', () => {
  let component: AbogadosEgresosListComponent;
  let fixture: ComponentFixture<AbogadosEgresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosEgresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosEgresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
