import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { TranslateService } from '@ngx-translate/core';
import { UserLanguageService } from '../../shared/services/user-language.service';

/**
 * RoutingClass parent
 */
export class RoutingClass {

  /**
   * RoutingClass Contructor
   * @param {Router} router 
   */
  constructor(protected _router: Router) { }

  /**
   * This method allow the redictection to components
   * @param {string} _route 
   */
  goToRoute(_route: string) {
    this._router.navigate([_route]);
  }
}

/**
 * CustomerMenuComponent chield
 */
@Component({
  selector: 'c-customer-menu',
  template: `  <button mat-icon-button id="menu-toggler" matTooltip="{{'TOPNAV.ORDERS' | translate}}" (click)="goToRoute('/app/orders','TOPNAV.ORDERS')">
                    <mat-icon>restaurant_menu</mat-icon>
                </button>
                <button mat-icon-button id="menu-toggler" matTooltip="{{'TOPNAV.PAYMENTS' | translate}}" (click)="goToRoute('/app/payments','TOPNAV.PAYMENTS')">
                    <mat-icon>local_atm</mat-icon>
                </button>
                <button mat-icon-button id="menu-toggler" matTooltip="{{'TOPNAV.WAITER' | translate}}" (click)="goToRoute('/app/waiter-call','TOPNAV.WAITER')">
                    <mat-icon>record_voice_over</mat-icon>
                </button>
                <button mat-icon-button id="menu-toggler" matTooltip="{{'TOPNAV.TABLES' | translate}}" (click)="goToRoute('/app/table-change','TOPNAV.TABLES')">
                    <mat-icon>compare_arrows</mat-icon>
                </button>
                <button mat-icon-button id="menu-toggler" matTooltip="{{'TOPNAV.RESTAURANT_EXIT' | translate}}" (click)="goToRoute('/app/restaurant-exit','TOPNAV.RESTAURANT_EXIT')">
                    <mat-icon>exit_to_app</mat-icon>
                </button>`
})
export class CustomerMenuComponent {

  @Output()
  menuname: EventEmitter<string> = new EventEmitter<string>();
  /**
   * CustomerMenuComponent Contructor
   * @param {Router} router 
   */
  constructor(protected _router: Router,
    private _translate: TranslateService,
    private _userLanguageService: UserLanguageService) {
    //super(_router);
    _translate.use(this._userLanguageService.getLanguage(Meteor.user()));
    _translate.setDefaultLang('en');
  }

  /**
   * This method allow the redictection to components
   * @param {string} _route 
   */
  goToRoute(_route: string, _menuName: string) {
    this._router.navigate([_route]);
    this.menuname.emit(_menuName);
  }
}

/**
 * WaiterMenuComponent chield
 */
@Component({
  selector: 'c-waiter-menu',
  template: `  <button mat-icon-button id="menu-toggler" matTooltip="{{'TOPNAV.CALLS' | translate}}" (click)="goToRoute('/app/calls','TOPNAV.CALLS')">
                    <mat-icon>restaurant_menu</mat-icon>
                </button>
                <button mat-icon-button id="menu-toggler" matTooltip="{{'TOPNAV.MENU' | translate}}" (click)="goToRoute('/app/menu-list','TOPNAV.MENU')">
                    <mat-icon>view_list</mat-icon>
                </button>`
})
export class WaiterMenuComponent {

  @Output()
  menuname: EventEmitter<string> = new EventEmitter<string>();

  /**
   * WaiterMenuComponent Contructor
   * @param {Router} router 
   */
  constructor(protected _router: Router,
    private _translate: TranslateService,
    private _userLanguageService: UserLanguageService) {
    _translate.use(this._userLanguageService.getLanguage(Meteor.user()));
    _translate.setDefaultLang('en');
  }

  /**
   * This method allow the redictection to components
   * @param {string} _route 
   */
  goToRoute(_route: string, _menuName: string) {
    this._router.navigate([_route]);
    this.menuname.emit(_menuName);
  }
}

/**
 * ChefMenuComponent chield
 */
@Component({
  selector: 'c-chef-menu',
  template: `  <button mat-icon-button id="menu-toggler" matTooltip="{{'TOPNAV.ORDERS' | translate}}" (click)="goToRoute('/app/chef-orders','TOPNAV.ORDERS')">
                    <mat-icon>restaurant_menu</mat-icon>
                </button>
                <button mat-icon-button id="menu-toggler" matTooltip="{{'TOPNAV.MENU' | translate}}" (click)="goToRoute('/app/menu-list','TOPNAV.MENU')">
                    <mat-icon>view_list</mat-icon>
                </button>`
})
export class ChefMenuComponent {

  @Output()
  menuname: EventEmitter<string> = new EventEmitter<string>();

  /**
   * ChefMenuComponent Contructor
   * @param {Router} router 
   */
  constructor(protected _router: Router,
    private _translate: TranslateService,
    private _userLanguageService: UserLanguageService) {

    _translate.use(this._userLanguageService.getLanguage(Meteor.user()));
    _translate.setDefaultLang('en');
  }

  /**
   * This method allow the redictection to components
   * @param {string} _route 
   */
  goToRoute(_route: string, _menuName: string) {
    this._router.navigate([_route]);
    this.menuname.emit(_menuName);
  }
}
