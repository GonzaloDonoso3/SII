import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFirmaHomeComponent } from './agro-firma-home.component';

describe('AgroFirmaHomeComponent', () => {
  let component: AgroFirmaHomeComponent;
  let fixture: ComponentFixture<AgroFirmaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFirmaHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFirmaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
