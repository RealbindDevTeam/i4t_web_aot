import {Component, OnChanges, SimpleChanges, HostBinding} from '@angular/core';
import {Input} from '@angular/core';
import {ColorService} from '../../services/color.service';

@Component({
  selector : 'core-widget',
  template : `
   <mat-card class="flex-item widget" [ngStyle]="{'background-color': style, 'color': textStyle}">
   <mat-card-title style="text-align: center;color: white;margin-bottom: 0;" *ngIf="title">{{title}}</mat-card-title>
    <mat-card-content class="layout-stretch-between layout-row">
      <mat-icon style="min-width: 100px;" class="widget-icon" *ngIf="icon">{{icon}}</mat-icon>
      <div class="layout-column">
        <p [ngStyle]="{'background-color': style, 'color': textStyle, 'font-weight': 400}" class="counter">{{count}}</p>
        <p [ngStyle]="{'background-color': style, 'color': textStyle, 'font-weight': 600}" class="description" *ngIf="description">{{description}}</p>
      </div>
    </mat-card-content>
  </mat-card>
  `,
  styles : []
})
export class WidgetComponent implements OnChanges {
  @HostBinding('class') get class() {
    return 'flex-item';
  }

  @Input() icon: string = null;
  @Input() count: number = 0;
  @Input() title: string = null;
  @Input() description: string = null;
  @Input() palette: {palette: string, hue?: string, shade?: string} = null;
  @Input() hexColor: string = null;
  @Input() hexTextColor: string = null;

  private _color = '#fff';
  private _textColor = '#000';

  constructor(private _colorService: ColorService) {}

  get style() {
    return this._color;
  }

  get textStyle() {
    return this._textColor;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if(propName === 'hexColor' || propName === 'palette') {
        this._color = this.hexColor !== null ? this.hexColor : (this.palette !== null ? 'black' : 'white');
      }
      
      this._textColor = this.hexTextColor !== null ? this.hexTextColor : 'white';
    }
  }

}
