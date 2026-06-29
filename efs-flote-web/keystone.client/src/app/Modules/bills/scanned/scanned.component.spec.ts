import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannedComponent } from './scanned.component';

describe('ScannedComponent', () => {
  let component: ScannedComponent;
  let fixture: ComponentFixture<ScannedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScannedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScannedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
