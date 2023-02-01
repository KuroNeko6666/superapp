import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorMasterComponent } from './operator-master.component';

describe('OperatorMasterComponent', () => {
  let component: OperatorMasterComponent;
  let fixture: ComponentFixture<OperatorMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
