import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatCardModule, MatIconModule } from '@angular/material';
import {WidgetComponent} from './layout/widget/widget.component';
import {ColorService} from './services/color.service';
import {CodeHighlighterDirective} from './layout/code-highlighter/code-highlighter.directive';
import {SearchService} from './services/search.service';
import {NavigationModule} from '../web/navigation/navigation.module';
import {NavigationService} from '../web/navigation/navigation.service';

@NgModule({
  declarations : [
    WidgetComponent, 
    CodeHighlighterDirective
  ],
  exports : [ FormsModule, 
              HttpModule, 
              CommonModule, 
              FlexLayoutModule, 
              NavigationModule, 
              WidgetComponent, 
              CodeHighlighterDirective],
  imports : [ FormsModule, 
              HttpModule, 
              CommonModule, 
              FlexLayoutModule, 
              NavigationModule,
              MatCardModule, 
              MatIconModule ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule : SharedModule,
      providers : [NavigationService, ColorService, SearchService]
    };
  }
}
