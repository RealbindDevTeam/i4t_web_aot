import {NgModule, ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import { HttpModule, Http } from '@angular/http';
import { MatSidenavModule, MatListModule, MatMenuModule, MatToolbarModule, MatProgressBarModule, MatIconModule, MatTooltipModule, MatButtonModule } from '@angular/material';
import {SidenavComponent} from './sidenav/sidenav.component';
import {TopnavComponent} from './topnav/topnav.component';
import {NavigationService} from './navigation.service';
import {SidenavItemComponent} from './sidenav/sidenav-item/sidenav-item.component';
import {FooterComponent} from './footer/footer.component';
import {LayoutComponent} from './layout/layout.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {CustomerMenuComponent, WaiterMenuComponent, ChefMenuComponent} from './menu-partials';
import { UserLanguageService } from '../../shared/services/user-language.service';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, '/i18n/', '.json');
}

@NgModule({
  imports : [
    CommonModule,
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
    ],
  declarations : [SidenavComponent, 
                  TopnavComponent, 
                  SidenavItemComponent, 
                  FooterComponent, 
                  LayoutComponent,
                  CustomerMenuComponent,
                  WaiterMenuComponent,
                  ChefMenuComponent],
  exports : [SidenavComponent, 
             TopnavComponent, 
             FooterComponent, 
             LayoutComponent,
             CustomerMenuComponent,
             WaiterMenuComponent,
             ChefMenuComponent]
})
export class NavigationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule : NavigationModule,
      providers : [NavigationService,UserLanguageService]
    };
  }
}

