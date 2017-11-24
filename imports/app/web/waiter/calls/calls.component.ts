import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { MeteorObservable } from "meteor-rxjs";
import { Subscription } from "rxjs";
import { UserLanguageService } from '../../../shared/services/user-language.service';
import { RestaurantImageThumb } from '../../../../both/models/restaurant/restaurant.model';
import { Restaurants, RestaurantImageThumbs } from "../../../../both/collections/restaurant/restaurant.collection";
import { Tables } from '../../../../both/collections/restaurant/table.collection';
import { WaiterCallDetail } from '../../../../both/models/restaurant/waiter-call-detail.model';
import { WaiterCallDetails } from '../../../../both/collections/restaurant/waiter-call-detail.collection';
import { User } from '../../../../both/models/auth/user.model';
import { Users } from '../../../../both/collections/auth/user.collection';
import { UserDetail } from '../../../../both/models/auth/user-detail.model';
import { UserDetails } from '../../../../both/collections/auth/user-detail.collection';
import { CallCloseConfirmComponent } from './call-close-confirm/call-close-confirm.component';
import { PaymentConfirmComponent } from './payment-confirm/payment-confirm.component';
import { SendOrderConfirmComponent } from './send-order-confirm/send-order-confirm.component';
import { RestaurantExitConfirmComponent } from './restaurant-exit-confirm/restaurant-exit-confirm.component';

@Component({
    selector: 'calls',
    templateUrl: './calls.component.html',
    styleUrls: [ './calls.component.scss' ]
})
export class CallsComponent implements OnInit, OnDestroy {

    private _user = Meteor.userId();
    
    private _userDetailSubscription     : Subscription;
    private _userRestaurantSubscription : Subscription;
    private _callsDetailsSubscription   : Subscription;
    private _tableSubscription          : Subscription;
    private _imgRestaurantSubscription  : Subscription;

    private _mdDialogRef                : MatDialogRef<any>;

    private _userDetail                 : UserDetail;
    private _restaurants                : any;
    private _waiterCallDetail           : any;
    private _imgRestaurant              : any;

    private _loading  : boolean;
    private _thereAreCalls : boolean = true;

    /**
     * CallsComponent Constructor
     * @param {TranslateService} _translate 
     * @param {MatDialog} _mdDialog 
     * @param {UserLanguageService} _userLanguageService 
     * @param {NgZone} _ngZone
     */
    constructor( public _translate: TranslateService,
                 public _mdDialog: MatDialog,
                 private _userLanguageService: UserLanguageService,
                 private _ngZone: NgZone ){
        _translate.use( this._userLanguageService.getLanguage( Meteor.user() ) );
        _translate.setDefaultLang( 'en' );
    }

    /**
     * ngOnInit Implementation
     */
    ngOnInit(){
        this.removeSubscriptions();
        this._userDetailSubscription = MeteorObservable.subscribe('getUserDetailsByUser', Meteor.userId()).subscribe(()=>{
            this._userDetail = UserDetails.findOne({ user_id: Meteor.userId() });
            if (this._userDetail){
                this._userRestaurantSubscription = MeteorObservable.subscribe('getRestaurantById', this._userDetail.restaurant_work).subscribe(() => {
                    this._restaurants = Restaurants.find({_id : this._userDetail.restaurant_work});
                });
            }
        });
        
        this._imgRestaurantSubscription = MeteorObservable.subscribe( 'getRestaurantImageThumbByRestaurantWork', this._user ).subscribe();
        
        this._callsDetailsSubscription = MeteorObservable.subscribe('waiterCallDetailByWaiterId', this._user ).subscribe(() => {
            this._ngZone.run( () => {
                this._waiterCallDetail = WaiterCallDetails.find({}).zone();
                this.countCalls();
                this._waiterCallDetail.subscribe( () => { this.countCalls(); });
            });
        });

        this._tableSubscription = MeteorObservable.subscribe( 'getTablesByRestaurantWork', this._user ).subscribe();
    }

    /**
     * Remove all subscriptions
     */
    removeSubscriptions():void{
        if( this._userDetailSubscription ){ this._userDetailSubscription.unsubscribe(); }
        if( this._userRestaurantSubscription ){ this._userRestaurantSubscription.unsubscribe(); }
        if( this._callsDetailsSubscription ){ this._callsDetailsSubscription.unsubscribe(); }
        if( this._tableSubscription ){ this._tableSubscription.unsubscribe(); }
        if( this._imgRestaurantSubscription ){ this._imgRestaurantSubscription.unsubscribe(); }
    }

    /**
     * Count calls
     */
    countCalls():void{
        let _lCalls: number = WaiterCallDetails.collection.find( { } ).count();
        _lCalls > 0 ? this._thereAreCalls = true : this._thereAreCalls = false;
    }

    /**
     * Get Restaurant Image
     * @param {string} _pRestaurantId
     */
    getRestaurantImage(_pRestaurantId: string): string {
        let _lRestaurantImageThumb: RestaurantImageThumb = RestaurantImageThumbs.findOne({ restaurantId: _pRestaurantId });
        if (_lRestaurantImageThumb) {
            return _lRestaurantImageThumb.url
        } else {
            return '/images/default-restaurant.png';
        }
    }

    /**
     * This function show a modal dialog to confirm the operation
     * @param {any} _call
     */
    showConfirm( _call : WaiterCallDetail ) {
        this._mdDialogRef = this._mdDialog.open(CallCloseConfirmComponent, {
            disableClose : true 
        });
        this._mdDialogRef.afterClosed().subscribe(result => {
            this._mdDialogRef = result;
            if(result.success){
                this._loading = true;
                setTimeout(() => {
                    MeteorObservable.call('closeCall', _call, Meteor.userId()).subscribe(() => {
                        this._loading = false;
                    });
                }, 1500);
            }
        });
    }

    /**
     * This function show modal dialog with payment information
     * @param {WaiterCallDetail} _call 
     */
    showPayment( _call: WaiterCallDetail ){
        this._mdDialogRef = this._mdDialog.open( PaymentConfirmComponent, {
            disableClose : true,
        });
        this._mdDialogRef.componentInstance.call = _call;
        this._mdDialogRef.afterClosed().subscribe( result => {
            this._mdDialogRef = null;
        });
    }

    /**
     * This function show modal dialog with order information
     * @param {WaiterCallDetail} _call 
     */
    showSendOrder( _call:WaiterCallDetail ):void{
        this._mdDialogRef = this._mdDialog.open( SendOrderConfirmComponent, {
            disableClose : true,
        });
        this._mdDialogRef.componentInstance.call = _call;
        this._mdDialogRef.afterClosed().subscribe( result => {
            this._mdDialogRef = null;
        });
    }

    /**
     * This function show modal dialog with exit user information
     */
    showUserExitTable( _call:WaiterCallDetail ): void{
        this._mdDialogRef = this._mdDialog.open( RestaurantExitConfirmComponent, {
            disableClose : true,
            width: '50%',
            height: '90%'
        });
        this._mdDialogRef.componentInstance.call = _call;
        this._mdDialogRef.afterClosed().subscribe( result => {
            this._mdDialogRef = null;
        });
    }

    getTableNumber( _idTable : string) : number{
        let lTable = Tables.findOne({ _id : _idTable });
        if(lTable){
            return lTable._number;
        } else {
            return 0;
        }
    }

    /**
     * NgOnDestroy Implementation
     */
    ngOnDestroy(){
        this.removeSubscriptions();
    }
}