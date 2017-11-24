import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Meteor } from 'meteor/meteor';
import { UserLanguageService } from '../../../../shared/services/user-language.service';
import { Item, ItemImageThumb, ItemPrice, ItemRestaurant } from '../../../../../both/models/administration/item.model';
import { Items, ItemImagesThumbs } from '../../../../../both/collections/administration/item.collection';
import { UserDetail } from '../../../../../both/models/auth/user-detail.model';
import { UserDetails } from '../../../../../both/collections/auth/user-detail.collection';

@Component({
    selector: 'item-enable-sup',
    templateUrl: './items-enable-sup.component.html',
    styleUrls: [ '../item.component.scss' ]
})
export class ItemEnableSupComponent implements OnInit, OnDestroy {

    private _user = Meteor.userId();
    private _itemsSub               : Subscription;
    private _itemImagesThumbSub     : Subscription;
    private _userDetailSub          : Subscription;

    private _items                  : Observable<Item[]>;
    private _itemsFilter            : Item[] = [];
    private _userDetail             : UserDetail;
    private _thereAreItems          : boolean = true;

    /**
     * ItemEnableSupComponent Constructor
     * @param {TranslateService} _translate 
     * @param {NgZone} _ngZone 
     * @param {UserLanguageService} _userLanguageService 
     * @param {MatSnackBar} snackBar 
     */
    constructor(private _translate: TranslateService,
        private _ngZone: NgZone,
        private _userLanguageService: UserLanguageService,
        public snackBar: MatSnackBar) {
        _translate.use(this._userLanguageService.getLanguage(Meteor.user()));
        _translate.setDefaultLang('en');
    }

    /**
     * ngOnInit implementation
     */
    ngOnInit() {
        this.removeSubscriptions();
        this._itemsSub = MeteorObservable.subscribe( 'getItemsByUserRestaurantWork', this._user ).subscribe(() => {
            this._ngZone.run(() => {
                this._items = Items.find({}).zone();
                this._itemsFilter = Items.collection.find({}).fetch();
                this.countItems();
                this._items.subscribe( () => { this.countItems(); } );
            });
        });

        this._itemImagesThumbSub = MeteorObservable.subscribe( 'getItemImageThumbsByRestaurantWork', this._user ).subscribe();
        this._userDetailSub = MeteorObservable.subscribe('getUserDetailsByUser', this._user ).subscribe(() => {
            this._ngZone.run(() => {
                this._userDetail = UserDetails.collection.findOne({ user_id: this._user });
            });
        });
    }

    /**
     * Validate if items exists
     */
    countItems():void{
        Items.collection.find( { } ).count() > 0 ? this._thereAreItems = true : this._thereAreItems = false;
    }

    /**
     * Remove all subscriptions
     */
    removeSubscriptions():void{
        if( this._itemsSub ){ this._itemsSub.unsubscribe(); }
        if( this._itemImagesThumbSub ){ this._itemImagesThumbSub.unsubscribe(); }
        if( this._userDetailSub ){ this._userDetailSub.unsubscribe(); }
    }

    /**
     * Update item available flag
     * @param {Item} _item 
     */
    updateAvailableFlag(_itemId: string): void {
        let snackMsg: string = this.itemNameTraduction('ENABLE_DISABLED.AVAILABILITY_CHANGED');
        if (this._userDetail) {
            MeteorObservable.call('updateItemAvailable', this._userDetail.restaurant_work, _itemId).subscribe();
            this.snackBar.open(snackMsg, '', {
                duration: 1000,
            });
        }
    }

    /**
     * Get the item available for the supervisor restaurant
     */
    getItemAvailable(_item: Item): boolean {
        let _itemRestaurant
        /**
         * let _userDetail: UserDetail = UserDetails.collection.findOne({ user_id: Meteor.userId() });
         */
        if (this._userDetail) {
            _itemRestaurant = Items.collection.findOne({ _id: _item._id }, { fields: { _id: 0, restaurants: 1 } });
            let aux = _itemRestaurant.restaurants.find(element => element.restaurantId === this._userDetail.restaurant_work);
            return aux.isAvailable;
        } else {
            return;
        }
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
     * This function cleans the tables_number fields form
     * @param {string} itemName
     * @return {string}
     */
    itemNameTraduction(itemName: string): string {
        var wordTraduced: string;
        this._translate.get(itemName).subscribe((res: string) => {
            wordTraduced = res;
        });
        return wordTraduced;
    }

    /**
     * ngOnDestroy Implementation
     */
    ngOnDestroy() {
        this.removeSubscriptions();       
    }
}
