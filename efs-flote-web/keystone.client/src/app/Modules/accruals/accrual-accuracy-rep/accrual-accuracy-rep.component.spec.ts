import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccrualAccuracyRepComponent } from './accrual-accuracy-rep.component';

describe('AccrualAccuracyRepComponent', () => {
  let component: AccrualAccuracyRepComponent;
  let fixture: ComponentFixture<AccrualAccuracyRepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccrualAccuracyRepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccrualAccuracyRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
