import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpecialComponent } from './create-special.component';

describe('CreateSpecialComponent', () => {
  let component: CreateSpecialComponent;
  let fixture: ComponentFixture<CreateSpecialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSpecialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
