import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false
})
export class AppComponent {
  public title = 'Products';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['pt', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  public changeLang(lang: string): void {
    this.translate.use(lang);
  }

  public isLanguageActive(lang: string): boolean {
    return lang === this.translate.currentLang;
  }
}
