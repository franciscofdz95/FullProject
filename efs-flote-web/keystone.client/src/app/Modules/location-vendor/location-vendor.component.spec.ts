import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationVendorComponent } from './location-vendor.component';

describe('LocationVendorComponent', () => {
  let component: LocationVendorComponent;
  let fixture: ComponentFixture<LocationVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationVendorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
