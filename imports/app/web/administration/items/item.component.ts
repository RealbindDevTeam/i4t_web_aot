import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MeteorObservable } from 'meteor-rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Meteor } from 'meteor/meteor';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserLanguageService } from '../../../shared/services/user-language.service';
import { Item, ItemImageThumb, ItemPrice } from '../../../../both/models/administration/item.model';
import { Items, ItemImagesThumbs } from '../../../../both/collections/administration/item.collection';
import { ItemEditionComponent } from './items-edition/item-edition.component';
import { Currency } from '../../../../both/models/general/currency.model';
import { Currencies } from '../../../../both/collections/general/currency.collection';
import { Restaurant } from '../../../../both/models/restaurant/restaurant.model';
import { Restaurants } from '../../../../both/collections/restaurant/restaurant.collection';
import { AlertConfirmComponent } from '../../../web/general/alert-confirm/alert-confirm.component';
import { UserDetails } from '../../../../both/collections/auth/user-detail.collection';
import { UserDetail } from '../../../../both/models/auth/user-detail.model';

@Component({
    selector: 'item',
    templateUrl: './item.component.html',
    styleUrls: [ './item.component.scss' ]
})
export class ItemComponent implements OnInit, OnDestroy {

    private _user = Meteor.userId();
    private _itemsSub: Subscription;
    private _itemImagesThumbSub: Subscription;
    private _currenciesSub: Subscription;
    private _restaurantSub: Subscription;
    private _userDetailsSub: Subscription;

    private _items: Observable<Item[]>;
    private _restaurants: Observable<Restaurant[]>;
    private _userDetails: Observable<UserDetail[]>;

    public _dialogRef: MatDialogRef<any>;
    private titleMsg: string;
    private btnAcceptLbl: string;
    private _thereAreRestaurants: boolean = true;
    private _thereAreItems: boolean = true;

    private _thereAreUsers: boolean = false;
    private _usersCount: number;

    /**
     * ItemComponent contructor
     * @param {Router} _router
     * @param {FormBuilder} _formBuilder
     * @param {TranslateService} _translate
     * @param {NgZone} _ngZone
     * @param {MatDialog} _dialog
     * @param {UserLanguageService} _userLanguageService
     */
    constructor(private _router: Router,
        private _formBuilder: FormBuilder,
        private _translate: TranslateService,
        private _ngZone: NgZone,
        public _dialog: MatDialog,
        private _userLanguageService: UserLanguageService) {
        _translate.use(this._userLanguageService.getLanguage(Meteor.user()));
        _translate.setDefaultLang('en');
        this.titleMsg = 'SIGNUP.SYSTEM_MSG';
        this.btnAcceptLbl = 'SIGNUP.ACCEPT';
    }

    /**
     * Implements ngOnInit function
     */
    ngOnInit() {
        let _lRestaurantsId: string[] = [];
        this.removeSubscriptions();
        this._itemsSub = MeteorObservable.subscribe( 'items',this._user ).subscribe( () => {
            this._ngZone.run( () => {
                this._items = Items.find( { } ).zone();
                this.countItems();
                this._items.subscribe( () => { this.countItems(); } );
            });
        });
        this._itemImagesThumbSub = MeteorObservable.subscribe('itemImageThumbs', this._user).subscribe();
        this._currenciesSub = MeteorObservable.subscribe('currencies').subscribe();
        this._restaurantSub = MeteorObservable.subscribe('restaurants', this._user).subscribe(() => {
            this._ngZone.run(() => {
                this._restaurants = Restaurants.find({}).zone();
                Restaurants.collection.find({}).fetch().forEach((restaurant: Restaurant) => {
                    _lRestaurantsId.push(restaurant._id);
                });
                this._userDetailsSub = MeteorObservable.subscribe('getUsersByRestaurantsId', _lRestaurantsId).subscribe(() => {
                    this._userDetails = UserDetails.find({}).zone();
                    this.countRestaurantsUsers();
                    this._userDetails.subscribe(() => { this.countRestaurantsUsers(); });
                });
                this.countRestaurants();
                this._restaurants.subscribe(() => { this.countRestaurants(); });
            });
        });
    }

    /**
     * Validate if restaurants exists
     */
    countRestaurants(): void {
        Restaurants.collection.find({}).count() > 0 ? this._thereAreRestaurants = true : this._thereAreRestaurants = false;
    }

    /**
    * Validate if restaurants exists
    */
    countRestaurantsUsers(): void {
        let auxUserCount: number;
        auxUserCount = UserDetails.collection.find({}).count();

        if (auxUserCount > 0) {
            this._thereAreUsers = true
            this._usersCount = auxUserCount;
        } else {
            this._thereAreUsers = false;
            this._usersCount = 0;
        }
    }

    /**
     * Validate if items exists
     */
    countItems(): void {
        Items.collection.find({}).count() > 0 ? this._thereAreItems = true : this._thereAreItems = false;
    }

    /**
     * Remove all subscriptions
     */
    removeSubscriptions(): void {
        if (this._itemsSub) { this._itemsSub.unsubscribe(); }
        if (this._itemImagesThumbSub) { this._itemImagesThumbSub.unsubscribe(); }
        if (this._currenciesSub) { this._currenciesSub.unsubscribe(); }
        if (this._restaurantSub) { this._restaurantSub.unsubscribe(); }
        if (this._userDetailsSub) { this._userDetailsSub.unsubscribe(); }
    }

    /**
     * This function open item creation wizard
     */
    openItemCreation(): void {
        this._router.navigate(['app/items-creation']);
    }

    /**
     * When user wants edit item, this function open dialog with Item information
     * @param {Item} _item
     */
    open(_item: Item) {
        this._dialogRef = this._dialog.open(ItemEditionComponent, {
            disableClose: true,
            width: '75%'
        });
        this._dialogRef.componentInstance._itemToEdit = _item;
        this._dialogRef.afterClosed().subscribe(result => {
            this._dialogRef = null;
        });
    }

    /**
     * Function to update Item updateStatus
     * @param {Item} _item
     */
    updateStatus(_item: Item): void {
        if (!Meteor.userId()) {
            var error: string = 'LOGIN_SYSTEM_OPERATIONS_MSG';
            this.openDialog(this.titleMsg, '', error, '', this.btnAcceptLbl, false);
            return;
        }

        Items.update(_item._id, {
            $set: {
                is_active: !_item.is_active,
                modification_date: new Date(),
                modification_user: Meteor.userId()
            }
        });
    }

    /**
     * Function to show Item Prices
     * @param {ItemPrice} _pItemPrices
     */
    showItemPrices(_pItemPrices: ItemPrice[]): string {
        let _lPrices: string = '';
        _pItemPrices.forEach((ip) => {
            let _lCurrency: Currency = Currencies.findOne({ _id: ip.currencyId });
            if (_lCurrency) {
                let price: string = ip.price + ' ' + _lCurrency.code + ' / '
                _lPrices += price;
            }
        });
        return _lPrices;
    }

    /**
     * Function to show Item Taxes
     * @param {ItemPrice[]} _pItemPrices
     */
    showItemTaxes(_pItemPrices: ItemPrice[]): string {
        let _lTaxes: string = '';
        _pItemPrices.forEach((ip) => {
            if (ip.itemTax) {
                let _lCurrency: Currency = Currencies.findOne({ _id: ip.currencyId });
                if (_lCurrency) {
                    let tax: string = ip.itemTax + ' ' + _lCurrency.code + ' / '
                    _lTaxes += tax;
                }
            }
        });
        return _lTaxes;
    }

    /**
     * Go to add new Restaurant
     */
    goToAddRestaurant() {
        this._router.navigate(['/app/restaurant-register']);
    }

    /**
     * Return item image
     * @param {string} _itemId
     */
    getItemImage(_itemId: string): string {
        let _lItemImageThumb: ItemImageThumb = ItemImagesThumbs.findOne({ itemId: _itemId });
        if (_lItemImageThumb) {
            return _lItemImageThumb.url;
        } else {
            return '/images/default-plate.png';
        }
    }

    /**
    * This function open de error dialog according to parameters 
    * @param {string} title
    * @param {string} subtitle
    * @param {string} content
    * @param {string} btnCancelLbl
    * @param {string} btnAcceptLbl
    * @param {boolean} showBtnCancel
    */
    openDialog(title: string, subtitle: string, content: string, btnCancelLbl: string, btnAcceptLbl: string, showBtnCancel: boolean) {

        this._dialogRef = this._dialog.open(AlertConfirmComponent, {
            disableClose: true,
            data: {
                title: title,
                subtitle: subtitle,
                content: content,
                buttonCancel: btnCancelLbl,
                buttonAccept: btnAcceptLbl,
                showBtnCancel: showBtnCancel
            }
        });
        this._dialogRef.afterClosed().subscribe(result => {
            this._dialog = result;
            if (result.success) {

            }
        });
    }

    /**
     * Implements ngOnDestroy function
     */
    ngOnDestroy() {
        this.removeSubscriptions();
    }
}