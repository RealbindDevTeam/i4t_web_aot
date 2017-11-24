import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Meteor } from 'meteor/meteor';
import { UserLanguageService } from '../../../../shared/services/user-language.service';
import { Item, ItemImageThumb, ItemPrice } from '../../../../../both/models/administration/item.model';
import { Items, ItemImagesThumbs } from '../../../../../both/collections/administration/item.collection';
import { EnableConfirmComponent } from './enable-confirm/enable-confirm.component';

@Component({
    selector: 'item-enable',
    templateUrl: './items-enable.component.html',
    styleUrls: [ '../item.component.scss' ]
})
export class ItemEnableComponent implements OnInit, OnDestroy {

    private _user = Meteor.userId();
    private _itemsSub           : Subscription;
    private _itemImagesThumbSub : Subscription;

    private _items              : Observable<Item[]>;
    private _mdDialogRef        : MatDialogRef<any>;
    private _thereAreItems      : boolean = true;

    /**
     * ItemEnableComponent Constructor
     * @param {TranslateService} _translate
     * @param {NgZone} _ngZone
     * @param {UserLanguageService} _userLanguageService
     */
    constructor(private _translate: TranslateService,
        private _ngZone: NgZone,
        private _userLanguageService: UserLanguageService,
        public _mdDialog: MatDialog) {
        _translate.use(this._userLanguageService.getLanguage(Meteor.user()));
        _translate.setDefaultLang('en');
    }

    /**
     * ngOnInit implementation
     */
    ngOnInit() {
        this.removeSubscriptions();
        this._itemsSub = MeteorObservable.subscribe( 'items', this._user ).subscribe( () => {
            this._ngZone.run(() => {
                this._items = Items.find({}).zone();
                this.countItems();
                this._items.subscribe( () => { this.countItems(); } );
            });
        });
        this._itemImagesThumbSub = MeteorObservable.subscribe( 'itemImageThumbs', this._user ).subscribe();
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
     * Opens dialog to enable/disable item in restaurants
     */
    openDialog(_item: Item) {
        this._mdDialogRef = this._mdDialog.open(EnableConfirmComponent, {
            disableClose: true,
            data: {
                one: _item
            },
            width: '50%'
        });
    }

    /**
     * ngOnDestroy implementation
     */
    ngOnDestroy() {
        this.removeSubscriptions();   
    }
}