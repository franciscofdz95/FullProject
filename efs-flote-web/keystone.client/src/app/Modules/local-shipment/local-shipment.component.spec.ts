import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalShipmentComponent } from './local-shipment.component';

describe('LocalShipmentComponent', () => {
  let component: LocalShipmentComponent;
  let fixture: ComponentFixture<LocalShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocalShipmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
