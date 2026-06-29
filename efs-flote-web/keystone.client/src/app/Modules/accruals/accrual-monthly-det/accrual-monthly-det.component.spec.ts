import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccrualMonthlyDetComponent } from './accrual-monthly-det.component';

describe('AccrualMonthlyDetComponent', () => {
  let component: AccrualMonthlyDetComponent;
  let fixture: ComponentFixture<AccrualMonthlyDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccrualMonthlyDetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccrualMonthlyDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
