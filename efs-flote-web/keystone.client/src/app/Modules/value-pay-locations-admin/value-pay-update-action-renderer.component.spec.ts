import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValuePayUpdateActionRendererComponent } from './value-pay-update-action-renderer.component';

describe('ValuePayUpdateActionRendererComponent', () => {
  let component: ValuePayUpdateActionRendererComponent;
  let fixture: ComponentFixture<ValuePayUpdateActionRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValuePayUpdateActionRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValuePayUpdateActionRendererComponent);
    component = fixture.componentInstance;
    component.agInit({ data: { req_location: 'LOC1' }, onUpdate: () => { } });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invoke onUpdate callback with row data', () => {
    const spy = jasmine.createSpy('onUpdate');
    component.agInit({ data: { req_location: 'LOC1' }, onUpdate: spy });
    component.onUpdate();
    expect(spy).toHaveBeenCalledWith({ req_location: 'LOC1' });
  });
});
