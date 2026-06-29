import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectMonthComponent } from './custom-select-month.component';

describe('CustomSelectMonthComponent', () => {
  let component: CustomSelectMonthComponent;
  let fixture: ComponentFixture<CustomSelectMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomSelectMonthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomSelectMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
