import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsMasterComponent } from './news-master.component';

describe('NewsMasterComponent', () => {
  let component: NewsMasterComponent;
  let fixture: ComponentFixture<NewsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
