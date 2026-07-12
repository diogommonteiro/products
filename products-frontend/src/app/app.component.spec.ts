import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

class MockTranslateService implements Partial<TranslateService> {
  currentLang = 'en';
  addLangs = jasmine.createSpy('addLangs');
  setDefaultLang = jasmine.createSpy('setDefaultLang');
  use = jasmine.createSpy('use');
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let translateService: MockTranslateService;

  beforeEach(async () => {
    translateService = new MockTranslateService();

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [MockTranslatePipe, MatButtonModule, MatIconModule, MatMenuModule],
      providers: [{ provide: TranslateService, useValue: translateService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app and initialize translations', () => {
    expect(component).toBeTruthy();
    expect(translateService.addLangs).toHaveBeenCalledWith(['pt', 'en']);
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('en');
    expect(translateService.use).toHaveBeenCalledWith('en');
  });

  it("should have the 'Products' title", () => {
    expect(component.title).toBe('Products');
  });

  describe('when the user changes the language', () => {
    it('should ask TranslateService to use the selected language', () => {
      component.changeLang('pt');

      expect(translateService.use).toHaveBeenCalledWith('pt');
    });
  });

  describe('language activity state', () => {
    it('should return true for the active language', () => {
      translateService.currentLang = 'pt';
      expect(component.isLanguageActive('pt')).toBeTrue();
    });

    it('should return false for a non-active language', () => {
      translateService.currentLang = 'en';
      expect(component.isLanguageActive('pt')).toBeFalse();
    });
  });
});
