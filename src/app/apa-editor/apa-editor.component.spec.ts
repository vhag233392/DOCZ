import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApaEditorComponent } from './apa-editor.component';

describe('ApaEditorComponent', () => {
  let component: ApaEditorComponent;
  let fixture: ComponentFixture<ApaEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApaEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
