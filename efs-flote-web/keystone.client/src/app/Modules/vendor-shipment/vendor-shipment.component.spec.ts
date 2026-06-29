import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorShipmentComponent } from './vendor-shipment.component';

describe('VendorShipmentComponent', () => {
  let component: VendorShipmentComponent;
  let fixture: ComponentFixture<VendorShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorShipmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
