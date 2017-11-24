import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from "@angular/router";
import { MeteorObservable } from 'meteor-rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Meteor } from 'meteor/meteor';
import { UserLanguageService } from '../../../shared/services/user-language.service';
import { Restaurant, RestaurantImage } from '../../../../both/models/restaurant/restaurant.model';
import { Restaurants, RestaurantImages } from '../../../../both/collections/restaurant/restaurant.collection';
import { Country } from '../../../../both/models/settings/country.model';
import { Countries } from '../../../../both/collections/settings/country.collection';
import { City } from '../../../../both/models/settings/city.model';
import { Cities } from '../../../../both/collections/settings/city.collection';

@Component({
    selector: 'restaurant',
    templateUrl: './restaurant.component.html',
    styleUrls: [ './restaurant.component.scss' ]
})
export class RestaurantComponent implements OnInit, OnDestroy {

    private _user = Meteor.userId();
    private restaurants             : Observable<Restaurant[]>;
    private _restaurantImages       : Observable<RestaurantImage[]>;

    private restaurantSub           : Subscription;
    private countriesSub            : Subscription;
    private citiesSub               : Subscription;
    private _restaurantImagesSub    : Subscription;

    public _dialogRef               : MatDialogRef<any>;
    private _thereAreRestaurants    : boolean = true;

    /**
     * RestaurantComponent Constructor
     * @param {Router} router 
     * @param {FormBuilder} _formBuilder 
     * @param {TranslateService} translate 
     * @param {MatDialog} _dialog
     * @param {NgZone} _ngZone
     * @param {UserLanguageService} _userLanguageService
     */
    constructor( private router: Router, 
                 private _formBuilder: FormBuilder, 
                 private translate: TranslateService, 
                 public _dialog: MatDialog,
                 private _ngZone: NgZone,
                 private _userLanguageService: UserLanguageService ) {
        translate.use( this._userLanguageService.getLanguage( Meteor.user() ) );
        translate.setDefaultLang( 'en' );
    }

    /**
     * ngOnInit implementation
     */
    ngOnInit() {
        this.removeSubscriptions();
        this.restaurantSub = MeteorObservable.subscribe('restaurants', this._user).subscribe( () => {
            this._ngZone.run( () => {
                this.restaurants = Restaurants.find({ creation_user: this._user}).zone();
                this.countRestaurants();
                this.restaurants.subscribe( () => { this.countRestaurants(); });
            });
        });
        this.countriesSub = MeteorObservable.subscribe('countries').subscribe();
        this.citiesSub = MeteorObservable.subscribe('cities').subscribe();
        this._restaurantImagesSub = MeteorObservable.subscribe('restaurantImages', this._user).subscribe( () => {
            this._ngZone.run( () => {
                this._restaurantImages = RestaurantImages.find({}).zone();
            });
        });
    }

    /**
     * Validate if restaurants exists
     */
    countRestaurants():void{
        Restaurants.collection.find({ creation_user: this._user}).count() > 0 ? this._thereAreRestaurants = true : this._thereAreRestaurants = false;
    }

    /**
     * Remove all subscriptions
     */
    removeSubscriptions():void{
        if( this.restaurantSub ){ this.restaurantSub.unsubscribe(); }
        if( this.countriesSub ){ this.countriesSub.unsubscribe(); }
        if( this.citiesSub ){ this.citiesSub.unsubscribe(); }
        if( this._restaurantImagesSub ){ this._restaurantImagesSub.unsubscribe(); }
    }

    /**
     * Function to open RestaurantRegisterComponent
     */
    openRestaurantRegister() {
        this.router.navigate(['app/restaurant-register']);
    }

    /**
     * Function to open RestaurantEditionComponent
     * @param {Restaurant} _restaurant 
     */
    openRestaurantEdition(_restaurant: Restaurant) {
        this.router.navigate( [ 'app/restaurant-edition', JSON.stringify(_restaurant) ], { skipLocationChange: true } );
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
     * Get Restaurant Country
     * @param {string} _pCountryId
     */
    getRestaurantCountry(_pCountryId: string): string {
        let _lCountry: Country = Countries.findOne({ _id: _pCountryId });
        if (_lCountry) {
            return _lCountry.name;
        }
    }

    /**
     * Get Restaurant City
     * @param {string} _pCityId 
     * @param {string} _pOtherCity
     */
    getRestaurantCity(_pCityId: string, _pOtherCity:string): string {
        let _lCity: City = Cities.findOne({ _id: _pCityId });
        if (_lCity) {
            return _lCity.name;
        } else {
            return _pOtherCity;
        }
    }

    /**
     * ngOnDestroy implementation
     */
    ngOnDestroy() {
        this.removeSubscriptions();   
    }
}