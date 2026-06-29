import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationOceanmblComponent } from './location-oceanmbl.component';

describe('LocationOceanmblComponent', () => {
  let component: LocationOceanmblComponent;
  let fixture: ComponentFixture<LocationOceanmblComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationOceanmblComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationOceanmblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
