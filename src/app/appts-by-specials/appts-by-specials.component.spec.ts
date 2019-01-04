import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptsBySpecialsComponent } from './appts-by-specials.component';

describe('ApptsBySpecialsComponent', () => {
  let component: ApptsBySpecialsComponent;
  let fixture: ComponentFixture<ApptsBySpecialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApptsBySpecialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptsBySpecialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
