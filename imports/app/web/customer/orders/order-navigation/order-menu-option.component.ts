import { Component, AfterViewInit, OnDestroy, Input, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { OrderMenu } from './order-menu';
import { OrderNavigationService } from './order-navigation.service';
import { Subscription } from 'rxjs';
import { StringUtils } from '../../../../shared/utils/string-utils';

@Component({
  selector : 'order-menu-option',
  template : `
    <a *ngIf="!hasChildren && !hasQuery" (toggle)="true" (click)="clicked($event)" class="mat-list-item">
        <div class="mat-list-item-content">
            <div class="mat-list-text">
                <span class="title">{{ orderMenu.title }}</span>
            </div>
        </div>
    </a>
    <a *ngIf="!hasChildren && hasQuery" (toggle)="true">{{ orderMenu.title }}</a>
    <a class="nav-dropdown mat-list-item" *ngIf="hasChildren" (click)="toggleDropdown(!active)" [ngClass]="{ 'active' : active }" (click)="clicked($event)">
        <div class="mat-list-item-content">
            <div class="mat-list-text"></div>
            {{ orderMenu?.title }}
            <span class="app-flex-filler"></span>
            <i class="material-icons"></i>
        </div>    
    </a>
    <mat-nav-list *ngIf="hasChildren" class="nav-children {{levelClass}}" [ngClass]="{ 'active' : active }" [ngStyle]="{'height.px': auto}">
      <order-menu-option *ngFor="let orderMenuChild of orderMenu.children" (idToEvaluate)="evaluateId($event)" [orderMenu]="orderMenuChild" [level]="level + 1" [parent]="_this"></order-menu-option>
    </mat-nav-list>
  `,
  styleUrls: [ './order-menu-option.component.scss' ]
})
export class OrderMenuOptionComponent implements AfterViewInit, OnDestroy{
    @ViewChildren(OrderMenuOptionComponent) children: QueryList<OrderMenuOptionComponent>;
    @Input() orderMenu: OrderMenu;
    @Input() level: number = 1;
    @Input() active: boolean = false;
    @Input() parent: OrderMenuOptionComponent;
    @Output() idToEvaluate = new EventEmitter();

    private _this: OrderMenuOptionComponent = this;
    private _subscription: Subscription;

    constructor( private _navigation: OrderNavigationService ){

    }

    ngAfterViewInit() {
        this.toggle(false);
    }

    toggleDropdown( active: boolean ){
        this.active = active;
        if( this.children ){
            this.children.forEach( childMenu => {
                childMenu.toggle( false, undefined, true );
            });
        }
        if( this.parent && active ) {
            this.parent.toggle( active, this );
        }
    }

    toggle( active: boolean, child?: OrderMenuOptionComponent, noParent: boolean = false ): void {
        this.active = active;

        if( this.children ) {
            this.children.forEach( childComponent => {
                if( child !== undefined ){
                    if(child !== childComponent ) {
                        childComponent.toggle( false, undefined, true );
                    }
                } else {
                    childComponent.toggle( active, undefined, true );
                }
            });
        }

        if( this.parent !== undefined && !noParent ) {
            this.parent.toggle( active, this );
        }
    }

    clicked(event: MouseEvent) {
        this.evaluateId();
        if( this.orderMenu.clickHandler !== null ) {
            this.orderMenu.clickHandler(event, this._navigation, this );
        }
    }

    evaluateId(_event?:any):void{
        if( _event ){
            this.idToEvaluate.emit(_event);
        } else {
            this.idToEvaluate.emit(this.orderMenu.iurestId); 
        }
    }

    get levelClass(): string {
        if(this.level < 4) {
            return `level${this.level}`;
        }
        return 'level5';
    }

    get hasIurestId(): boolean {
        if( !this.orderMenu ) {
            return false;
        }
        return Object.keys( this.orderMenu.iurestId ).length === 0;
    }

    get hasChildren(): boolean {
        if( !this.orderMenu){
            return false;
        }
        return this.orderMenu.children.length > 0;
    }

    get hasQuery(): boolean {
        if( !this.orderMenu ) {
            return false;
        }
        return !this.orderMenu.queryParams ? false : Object.getOwnPropertyNames( this.orderMenu.queryParams ).length !== 0;
    }

    ngOnDestroy() {
        if( this._subscription ) {
            this._subscription.unsubscribe();
        }
    }
}