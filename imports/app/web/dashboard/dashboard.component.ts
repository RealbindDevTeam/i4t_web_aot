import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { UserLanguageService } from '../../shared/services/user-language.service';
import { Restaurant, RestaurantImage, RestaurantImageThumb } from '../../../both/models/restaurant/restaurant.model';
import { Restaurants, RestaurantImages, RestaurantImageThumbs } from '../../../both/collections/restaurant/restaurant.collection';
import { UserDetails } from '../../../both/collections/auth/user-detail.collection';
import { Tables } from '../../../both/collections/restaurant/table.collection';
import { Items } from '../../../both/collections/administration/item.collection';
import { Payment } from '../../../both/models/restaurant/payment.model';
import { Payments } from '../../../both/collections/restaurant/payment.collection';
import { Order, OrderItem, OrderAddition } from '../../../both/models/restaurant/order.model';
import { Orders } from '../../../both/collections/restaurant/order.collection';
import { Currency } from '../../../both/models/general/currency.model';
import { Currencies } from '../../../both/collections/general/currency.collection';

@Component({
  selector : 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  private _user = Meteor.userId();

  private _restaurants            : Observable<Restaurant[]>;
  private _restaurantImages       : Observable<RestaurantImage[]>;

  private _restaurantsSub         : Subscription;
  private _restaurantImgThumbSub  : Subscription;
  private _userDetailsSub         : Subscription;
  private _tablesSub              : Subscription;
  private _itemsSub               : Subscription;
  private _paymentsSub            : Subscription;
  private _ordersSub              : Subscription;
  private _currenciesSub          : Subscription;
  private _restaurantImagesSub    : Subscription;

  private _currentDate            : Date = new Date();
  private _currentDay             : number = this._currentDate.getDate();
  private _currentMonth           : number = this._currentDate.getMonth();
  private _currentYear            : number = this._currentDate.getFullYear();
  private _thereAreRestaurants    : boolean = true;

  /**
   * DashboardComponent Constructor
   * @param {TranslateService} _translate 
   * @param {NgZone} _ngZone 
   * @param {Router} _router
   * @param {UserLanguageService} _userLanguageService
   */
  constructor( private _translate: TranslateService, 
               private _ngZone: NgZone,
               private _router: Router,
               private _userLanguageService: UserLanguageService ){
                 _translate.use( this._userLanguageService.getLanguage( Meteor.user() ) );
                 _translate.setDefaultLang( 'en' );
  }

  /**
   * ngOnInit Implementation
   */
  ngOnInit(){
    this.removeSubscriptions();
    let _lRestaurantsId:string[] = [];
    this._restaurantsSub = MeteorObservable.subscribe( 'getActiveRestaurants', this._user ).subscribe( () => {
      this._ngZone.run( () => {
        this._restaurants = Restaurants.find( { } ).zone();
        this.countResturants();
        this._restaurants.subscribe( () => { this.countResturants(); } );
        Restaurants.collection.find( { } ).fetch().forEach( ( restaurant:Restaurant ) => {
          _lRestaurantsId.push( restaurant._id );
        });
        this._restaurantImgThumbSub = MeteorObservable.subscribe( 'restaurantImageThumbs', this._user ).subscribe();
        this._userDetailsSub = MeteorObservable.subscribe( 'getUsersByRestaurantsId', _lRestaurantsId ).subscribe();
        this._itemsSub = MeteorObservable.subscribe( 'getItemsByRestaurantIds', _lRestaurantsId ).subscribe();
        this._paymentsSub = MeteorObservable.subscribe( 'getPaymentsByRestaurantIds', _lRestaurantsId ).subscribe();
        this._ordersSub = MeteorObservable.subscribe( 'getOrdersByRestaurantIds', _lRestaurantsId, [ 'ORDER_STATUS.CLOSED' ] ).subscribe();
        this._currenciesSub = MeteorObservable.subscribe( 'getCurrenciesByRestaurantsId', _lRestaurantsId ).subscribe();
      });
    });
    this._tablesSub = MeteorObservable.subscribe( 'tables', this._user ).subscribe();
    this._restaurantImagesSub = MeteorObservable.subscribe('restaurantImages', this._user).subscribe( () => {
      this._ngZone.run( () => {
          this._restaurantImages = RestaurantImages.find({}).zone();
      });
    });
  }

  /**
   * Validate if restaurants exists
   */
  countResturants():void{
    Restaurants.collection.find( { } ).count() > 0 ? this._thereAreRestaurants = true : this._thereAreRestaurants = false;
  }

  /**
   * Remove all subscriptions
   */
  removeSubscriptions():void{
    if( this._restaurantsSub ){ this._restaurantsSub.unsubscribe(); }
    if( this._restaurantImgThumbSub ){ this._restaurantImgThumbSub.unsubscribe(); }
    if( this._userDetailsSub ){ this._userDetailsSub.unsubscribe(); }
    if( this._tablesSub ){ this._tablesSub.unsubscribe(); }
    if( this._itemsSub ){ this._itemsSub.unsubscribe(); }
    if( this._paymentsSub ){ this._paymentsSub.unsubscribe(); }
    if( this._ordersSub ){ this._ordersSub.unsubscribe(); }
    if( this._currenciesSub ){ this._currenciesSub.unsubscribe(); }
    if( this._restaurantImagesSub ){ this._restaurantImagesSub.unsubscribe(); }
  }

  /**
   * Get restaurant Image
   * @param {string} _pRestaurantId
   */
  getRestaurantId( _pRestaurantId:string ):string{
    let _lRestaurantImage: RestaurantImageThumb = RestaurantImageThumbs.findOne( { restaurantId: _pRestaurantId } );
    if( _lRestaurantImage ){
      return _lRestaurantImage.url;
    } else {
      return '/images/default-restaurant.png';
    }
  }

  /**
   * Get Users in restaurant
   * @param {string} _pRestaurantId
   */
  getRestaurantUsers( _pRestaurantId:string ):number{
    return UserDetails.collection.find( { current_restaurant: _pRestaurantId } ).count();
  }

  /**
   * Get Tables with Free Status
   * @param {string} _pRestaurantId 
   */
  getTablesWithFreeStatus( _pRestaurantId: string ):number{
    return Tables.collection.find( { restaurantId: _pRestaurantId, status: 'FREE' } ).count();
  }

  /**
   * Get Tables With Busy Status
   * @param {string} _pRestaurantId 
   */
  getTablesWithBusyStatus( _pRestaurantId: string ):number{
    return Tables.collection.find( { restaurantId: _pRestaurantId, status: 'BUSY' } ).count();
  }

  /**
   * Get available items
   * @param {string} _pRestaurantId 
   */
  getAvailableItems( _pRestaurantId: string ):number{
    return Items.collection.find( { 'restaurants.restaurantId': _pRestaurantId, 'restaurants.isAvailable': true } ).count();
  }

  /**
   * Get not available items
   * @param {string} _pRestaurantId
   */
  getNotAvailableItems( _pRestaurantId: string ):number{
    return Items.collection.find( { 'restaurants.restaurantId': _pRestaurantId, 'restaurants.isAvailable': false } ).count();
  }

  /**
   * Get daily sales
   * @param {string} _pRestaurantId
   */
  getDailySales( _pRestaurantId: string ):number{
    let _lTotalSale: number = 0;
    Payments.collection.find( { restaurantId: _pRestaurantId, creation_date: { $gte: new Date( this._currentYear, this._currentMonth, this._currentDay ) } } ).forEach( ( pay:Payment ) => {
      _lTotalSale += pay.totalToPayment;
    });
    return _lTotalSale;
  }

  /**
   * Get Items Sold
   * @param {string} _pRestaurantId
   */
  getItemsSold( _pRestaurantId: string ):number{
    let _lItemCount: number = 0;
    Payments.collection.find( { restaurantId: _pRestaurantId, creation_date: { $gte: new Date( this._currentYear, this._currentMonth, this._currentDay ) } } ).forEach( ( pay:Payment ) => {
      pay.orders.forEach( ( orderId ) => {
        let _lOrder:Order = Orders.findOne( { _id: orderId } );
        if( _lOrder ){
          _lOrder.items.forEach( ( orderItem:OrderItem ) => {
            _lItemCount += orderItem.quantity;
          });
        }
      });
    });
    return _lItemCount;
  }

  /**
   * Get GarnishFood Sold
   * @param {string} _pRestaurantId
   */
  getGarnishFoodSold( _pRestaurantId: string ):number{
    let _lGarnishFoodCount: number = 0;
    Payments.collection.find( { restaurantId: _pRestaurantId, creation_date: { $gte: new Date( this._currentYear, this._currentMonth, this._currentDay ) } } ).forEach( ( pay:Payment ) => {
      pay.orders.forEach( ( orderId ) => {
        let _lOrder:Order = Orders.findOne( { _id: orderId } );
        if( _lOrder ){
          _lOrder.items.forEach( ( orderItem:OrderItem ) => {
            _lGarnishFoodCount += ( orderItem.quantity * orderItem.garnishFood.length );
          });
        }
      });
    });
    return _lGarnishFoodCount;
  }

  /**
   * Get Additions Sold
   * @param {string} _pRestaurantId
   */
  getAdditionsSold( _pRestaurantId: string ):number{
    let _lAdditions: number = 0;
    Payments.collection.find( { restaurantId: _pRestaurantId, creation_date: { $gte: new Date( this._currentYear, this._currentMonth, this._currentDay ) } } ).forEach( ( pay:Payment ) => {
      pay.orders.forEach( ( orderId ) => {
        let _lOrder:Order = Orders.findOne( { _id: orderId } );
        if( _lOrder ){
          _lOrder.items.forEach( ( orderItem:OrderItem ) => {
            _lAdditions += ( orderItem.quantity * orderItem.additions.length );
          });
          _lOrder.additions.forEach( ( orderAddition: OrderAddition ) => {
            _lAdditions += orderAddition.quantity;
          });
        }
      });
    });
    return _lAdditions;
  }

  /**
     * Get Restaurant Image
     * @param {string} _pRestaurantId
     */
    getRestaurantImage(_pRestaurantId: string): string {
      let _lRestaurantImage: RestaurantImage = RestaurantImages.findOne({ restaurantId: _pRestaurantId });
      if (_lRestaurantImage) {
          return _lRestaurantImage.url
      } else {
          return '/images/default-restaurant.png';
      }
  }

  /**
   * Get Restaurant Currency
   * @param {string} _pCurrencyId 
   */
  getRestaurantCurrency( _pCurrencyId: string ):string{
    let _lCurrency:Currency = Currencies.collection.findOne( { _id: _pCurrencyId } );
    if( _lCurrency ){
      return _lCurrency.code;
    }
  }

  /**
   * Go to add new Restaurant
   */
  goToAddRestaurant(){
      this._router.navigate(['/app/restaurant-register']);
  }

  /**
   * ngOnDestroy Implementation
   */
  ngOnDestroy(){
      this.removeSubscriptions();
  }
}
