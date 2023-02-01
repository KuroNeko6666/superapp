import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSettingComponent } from './quick-setting.component';

describe('QuickSettingComponent', () => {
  let component: QuickSettingComponent;
  let fixture: ComponentFixture<QuickSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
