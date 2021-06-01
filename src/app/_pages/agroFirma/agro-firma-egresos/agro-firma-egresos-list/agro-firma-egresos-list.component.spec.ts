import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFirmaEgresosListComponent } from './agro-firma-egresos-list.component';

describe('AgroFirmaEgresosListComponent', () => {
  let component: AgroFirmaEgresosListComponent;
  let fixture: ComponentFixture<AgroFirmaEgresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFirmaEgresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFirmaEgresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
