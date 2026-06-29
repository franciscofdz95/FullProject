import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInputMoneyComponent } from './custom-input-money.component';

describe('CustomInputMoneyComponent', () => {
  let component: CustomInputMoneyComponent;
  let fixture: ComponentFixture<CustomInputMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomInputMoneyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomInputMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
