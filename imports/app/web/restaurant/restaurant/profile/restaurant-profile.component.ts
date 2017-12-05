import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from "@angular/router";
import { MeteorObservable } from 'meteor-rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MouseEvent } from "@agm/core";
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { Meteor } from 'meteor/meteor';
import { UserLanguageService } from '../../../../shared/services/user-language.service';
import { Restaurant, RestaurantProfile, RestaurantImage, RestaurantSchedule, RestaurantLocation, RestaurantSocialNetwork, RestaurantProfileImageThumb } from '../../../../../both/models/restaurant/restaurant.model';
import { Restaurants, RestaurantsProfile, RestaurantProfileImages, RestaurantProfileImageThumbs } from '../../../../../both/collections/restaurant/restaurant.collection';
import { uploadRestaurantProfileImages } from '../../../../../both/methods/restaurant/restaurant.methods';
import { AlertConfirmComponent } from '../../../general/alert-confirm/alert-confirm.component';

@Component({
    selector: 'restaurant-profile',
    templateUrl: './restaurant-profile.component.html',
    styleUrls: [ './restaurant-profile.component.scss' ]
})
export class RestaurantProfileComponent implements OnInit, OnDestroy {

    private _user = Meteor.userId();
    private _profileForm            : FormGroup;
    private _restaurants            : Observable<Restaurant[]>;
    private _restaurantProfileThumbs: Observable<RestaurantProfileImageThumb[]>;
    
    private _restaurantsSub         : Subscription;
    private _restaurantProfileSub   : Subscription;
    private _restaurantProImgSub    : Subscription;
    private _restaurantProImgThumSub: Subscription;
    
    private _restaurantProfile      : RestaurantProfile;
    private _schedule               : RestaurantSchedule;
    private _scheduleToEdit         : RestaurantSchedule;
    
    private _thereAreRestaurants    : boolean = true;
    private _anyRestaurantIsSelected: boolean = false;
    private _scheduleInEditMode     : boolean = false;
    private _newImagesToInsert      : boolean = false;
    private _mapRender              : boolean = false;

    private _restaurantName         : string = '';
    private _restaurantId           : string = '';
    private _titleMsg               : string;
    private _btnAcceptLbl           : string;
    private _selectedIndex          : number = 0;

    private _filesToUpload          : Array<File> = [];
    private _mdDialogRef            : MatDialogRef<any>;

    private _lat: number = 4.5981;
    private _lng: number = -74.0758;
    
    /**
     * RestaurantProfileComponent Constructor
     * @param {Router} _router 
     * @param {FormBuilder} _formBuilder 
     * @param {TranslateService} _translate 
     * @param {NgZone} _ngZone 
     * @param {UserLanguageService} _userLanguageService
     * @param {MatSnackBar} _snackBar
     * @param {MatDialog} _mdDialog
     */
    constructor( private _router: Router, 
                 private _formBuilder: FormBuilder, 
                 private _translate: TranslateService, 
                 private _ngZone: NgZone,
                 private _userLanguageService: UserLanguageService,
                 private _snackBar: MatSnackBar,
                 private _mdDialog: MatDialog ) {
        _translate.use( this._userLanguageService.getLanguage( Meteor.user() ) );
        _translate.setDefaultLang( 'en' );
        this._titleMsg = 'SIGNUP.SYSTEM_MSG';
        this._btnAcceptLbl = 'SIGNUP.ACCEPT';
    }

    /**
     * ngOnInit Implementation
     */
    ngOnInit(){
        this.removeSubscriptions();
        this._restaurantsSub = MeteorObservable.subscribe('restaurants', this._user ).subscribe( () => {
            this._ngZone.run( () => {
                this._restaurants = Restaurants.find({}).zone();
                this.countRestaurants();
                this._restaurants.subscribe( () => { this.countRestaurants(); } );
            });
        });
        this._schedule = {
            monday: {
                isActive: false,
                opening_time: '',
                closing_time: ''
            },
            tuesday: {
                isActive: false,
                opening_time: '',
                closing_time: ''
            },
            wednesday: {
                isActive: false,
                opening_time: '',
                closing_time: ''
            },
            thursday: {
                isActive: false,
                opening_time: '',
                closing_time: ''
            },
            friday: {
                isActive: false,
                opening_time: '',
                closing_time: ''
            },
            saturday: {
                isActive: false,
                opening_time: '',
                closing_time: ''
            },
            sunday: {
                isActive: false,
                opening_time: '',
                closing_time: ''
            },
            holiday: {
                isActive: false,
                opening_time: '',
                closing_time: ''
            }
        };
    }

    /**
     * Remove all subscriptions
     */
    removeSubscriptions():void{
        if( this._restaurantsSub ){ this._restaurantsSub.unsubscribe(); }
        if( this._restaurantProfileSub ){ this._restaurantProfileSub.unsubscribe(); }
        if( this._restaurantProImgSub ){ this._restaurantProImgSub.unsubscribe(); }
        if( this._restaurantProImgThumSub ){ this._restaurantProImgThumSub.unsubscribe(); }
    }

    /**
     * Validate if restaurants exists
     */
    countRestaurants():void{
        Restaurants.collection.find( { } ).count() > 0 ? this._thereAreRestaurants = true : this._thereAreRestaurants = false;
    }

    /**
     * Function to receive restaurant selected
     * @param {string} _pRestaurantId
     * @param {string} _pRestaurantName
     */
    changeRestaurant( _pRestaurantId: string, _pRestaurantName: string ):void{
        this._restaurantId = _pRestaurantId;
        this._restaurantName = _pRestaurantName;
        this._anyRestaurantIsSelected = true;
        this._selectedIndex = 0;
        this._profileForm = new FormGroup({
            restaurant_description: new FormControl( '', [ Validators.required ] ),
            web_page: new FormControl( ),
            phone: new FormControl( ),
            email: new FormControl( ),
            facebookLink: new FormControl( ),
            instagramLink: new FormControl( ),
            twitterLink: new FormControl( )
        });
        this._restaurantProfileSub = MeteorObservable.subscribe( 'getRestaurantProfile', _pRestaurantId ).subscribe( () => {
            this._ngZone.run( () => {
                this._restaurantProfile = RestaurantsProfile.findOne( { restaurant_id: _pRestaurantId } );
                if( this._restaurantProfile ){
                    this._profileForm.controls['restaurant_description'].setValue( this._restaurantProfile.restaurant_description );
                    this._profileForm.controls['web_page'].setValue( this._restaurantProfile.web_page === undefined || this._restaurantProfile.web_page === null ? '' : this._restaurantProfile.web_page );
                    this._profileForm.controls['phone'].setValue( this._restaurantProfile.phone === undefined || this._restaurantProfile.phone === null ? '' : this._restaurantProfile.phone );
                    this._profileForm.controls['email'].setValue( this._restaurantProfile.email === undefined || this._restaurantProfile.email === null ? '' : this._restaurantProfile.email );
                    if( this._restaurantProfile.social_networks ){
                        this._profileForm.controls['facebookLink'].setValue( this._restaurantProfile.social_networks.facebook === undefined || this._restaurantProfile.social_networks.facebook === null ? '' : this._restaurantProfile.social_networks.facebook );
                        this._profileForm.controls['instagramLink'].setValue( this._restaurantProfile.social_networks.instagram === undefined || this._restaurantProfile.social_networks.instagram === null ? '' : this._restaurantProfile.social_networks.instagram );
                        this._profileForm.controls['twitterLink'].setValue( this._restaurantProfile.social_networks.twitter === undefined || this._restaurantProfile.social_networks.twitter === null ? '' : this._restaurantProfile.social_networks.twitter );
                    }
                    this._scheduleInEditMode = true;
                    this._scheduleToEdit = this._restaurantProfile.schedule;
                    this._lat = this._restaurantProfile.location.lat;
                    this._lng = this._restaurantProfile.location.lng;
                    this._restaurantProImgSub = MeteorObservable.subscribe( 'getRestaurantProfileImages', this._user ).subscribe();
                    this._restaurantProImgThumSub = MeteorObservable.subscribe( 'getRestaurantProfileImageThumbs', this._user ).subscribe( () => {
                        this._ngZone.run( () => {
                            this._restaurantProfileThumbs = RestaurantProfileImageThumbs.find( { restaurantId: _pRestaurantId } ).zone();
                        });
                    });
                } else {
                    this._profileForm.reset();
                    this._scheduleInEditMode = false;
                    this._scheduleToEdit = {};
                    this._lat = 4.5981;
                    this._lng = -74.0758;
                    if( this._restaurantProImgSub ){ this._restaurantProImgSub.unsubscribe(); }
                    if( this._restaurantProImgThumSub ){ this._restaurantProImgThumSub.unsubscribe(); }
                }
            });
        });
    }

    /**
     * Function to receive schedule from schedule component
     * @param {any} _event 
     */
    receiveSchedule(_event: any): void {
        this._schedule = _event;
    }

    /**
     * Set restaurant position
     * @param {MouseEvent} $event
     */
    mapClicked( $event: MouseEvent ) {
        this._lat = $event.coords.lat;
        this._lng = $event.coords.lng;
    }

    /**
     * Set marker in the map
     * @param {MouseEvent} event 
     */
    markerDragEnd( $event: MouseEvent ) {
        this._lat = $event.coords.lat;
        this._lng = $event.coords.lng;
    }

    /**
     * When user change Image, this function allow insert in the store
     * @param {any} _fileInput
     */
    onChangeImage(_fileInput: any): void {
        let _lImages: Array<File> = [];
        _lImages = <Array<File>>_fileInput.target.files;
        for( let img of _lImages ){
            this._filesToUpload.push( img );
        }
        this._newImagesToInsert = true;
    }

    /**
     * Remove image from files to upload
     * @param {number} _pIndex
     */
    removeImageList( _pIndex: number ):void{
        this._filesToUpload.splice( _pIndex, 1 );
        if( this._filesToUpload.length <= 0 ){ this._newImagesToInsert = false; }
    }

    /**
     * Set restaurant profile information
     */
    setRestaurantProfile():void{
        let _lRestaurantLocation:RestaurantLocation = { lat: this._lat, lng: this._lng };
        let _lRestaurantSocialNetwork:RestaurantSocialNetwork = {};
        
        let _lRestaurantProfile:RestaurantProfile = {
            restaurant_id: this._restaurantId,
            restaurant_description: this._profileForm.value.restaurant_description,
            schedule: this._schedule,
            location: _lRestaurantLocation
        };
        
        if( this._profileForm.value.facebookLink !== '' && this._profileForm.value.facebookLink !== null ){ _lRestaurantSocialNetwork.facebook = this._profileForm.value.facebookLink; }
        if( this._profileForm.value.instagramLink !== '' && this._profileForm.value.instagramLink !== null ){ _lRestaurantSocialNetwork.instagram = this._profileForm.value.instagramLink;}
        if( this._profileForm.value.twitterLink !== '' && this._profileForm.value.twitterLink !== null ){ _lRestaurantSocialNetwork.twitter = this._profileForm.value.twitterLink; }

        if( this._restaurantProfile ){
            _lRestaurantProfile.modification_date = new Date();
            _lRestaurantProfile.modification_user = this._user;
            RestaurantsProfile.update( { _id: this._restaurantProfile._id }, {
                $set: {
                    restaurant_description: _lRestaurantProfile.restaurant_description,
                    schedule: _lRestaurantProfile.schedule,
                    location: _lRestaurantProfile.location,
                }
            });

            if( this._profileForm.controls['web_page'].value !== '' && this._profileForm.controls['web_page'].value !== null ){
                RestaurantsProfile.update( { _id: this._restaurantProfile._id }, { $set: { web_page: this._profileForm.controls['web_page'].value } } );
            } else if( ( this._profileForm.controls['web_page'].value === '' || this._profileForm.controls['web_page'].value === null ) && ( this._restaurantProfile.web_page !== undefined && this._restaurantProfile.web_page !== null ) ) {
                RestaurantsProfile.update( { _id: this._restaurantProfile._id }, { $unset: { web_page: true } } );
            }
    
            if( this._profileForm.controls['phone'].value !== '' && this._profileForm.controls['phone'].value !== null ){
                RestaurantsProfile.update( { _id: this._restaurantProfile._id }, { $set: { phone: this._profileForm.controls['phone'].value } } );
            } else if( ( this._profileForm.controls['phone'].value === '' || this._profileForm.controls['phone'].value === null ) && ( this._restaurantProfile.phone !== undefined && this._restaurantProfile.phone !== null ) ) {
                RestaurantsProfile.update( { _id: this._restaurantProfile._id }, { $unset: { phone: true } } );
            }
    
            if( this._profileForm.controls['email'].value !== '' && this._profileForm.controls['email'].value !== null ){
                RestaurantsProfile.update( { _id: this._restaurantProfile._id }, { $set: { email: this._profileForm.controls['email'].value } } );
            } else if( ( this._profileForm.controls['email'].value === '' || this._profileForm.controls['email'].value === null ) && ( this._restaurantProfile.email !== undefined && this._restaurantProfile.email !== null ) ) {
                RestaurantsProfile.update( { _id: this._restaurantProfile._id }, { $unset: { email: true } } );
            }

            if( Object.keys( _lRestaurantSocialNetwork ).length !== 0 ){ 
                RestaurantsProfile.update( { _id: this._restaurantProfile._id }, { $set: { social_networks: _lRestaurantSocialNetwork } } ); 
            } else if( Object.keys( _lRestaurantSocialNetwork ).length === 0 && ( this._restaurantProfile.social_networks !== undefined && this._restaurantProfile.social_networks !== null ) ){
                RestaurantsProfile.update( { _id: this._restaurantProfile._id }, { $unset: { social_networks: true } } );
            }

            if( this._newImagesToInsert ){
                uploadRestaurantProfileImages( this._filesToUpload, this._user, this._restaurantId ).then( ( result ) => {
                    this._filesToUpload = [];
                    this._newImagesToInsert = false;
                    let _lMessage: string = this.itemNameTraduction( 'RESTAURANT_PROFILE.PROFILE_UPDATED' );
                    this._snackBar.open( _lMessage, '', { duration: 2500 } );
                }).catch( ( err ) => {
                    var error: string = this.itemNameTraduction('UPLOAD_IMG_ERROR');
                    this.openDialog(this._titleMsg, '', error, '', this._btnAcceptLbl, false);
                });
            } else {
                let _lMessage: string = this.itemNameTraduction( 'RESTAURANT_PROFILE.PROFILE_UPDATED' );
                this._snackBar.open( _lMessage, '', { duration: 2500 } );
            }
        } else {
            if( this._profileForm.valid ){
                _lRestaurantProfile.creation_user = this._user;
                _lRestaurantProfile.creation_date = new Date();
                _lRestaurantProfile.modification_user = '-';
                _lRestaurantProfile.modification_date = new Date();

                if( this._profileForm.controls['web_page'].value !== '' && this._profileForm.controls['web_page'].value !== null ){ _lRestaurantProfile.web_page = this._profileForm.value.web_page; }
                if( this._profileForm.controls['phone'].value !== '' && this._profileForm.controls['phone'].value !== null ){ _lRestaurantProfile.phone = this._profileForm.value.phone; }
                if( this._profileForm.controls['email'].value !== '' && this._profileForm.controls['email'].value !== null ){ _lRestaurantProfile.email = this._profileForm.value.email; }

                if( Object.keys( _lRestaurantSocialNetwork ).length !== 0 ){ _lRestaurantProfile.social_networks = _lRestaurantSocialNetwork; }

                let _newProfileId:string = RestaurantsProfile.collection.insert( _lRestaurantProfile );
                this._restaurantProfile = RestaurantsProfile.findOne( { _id: _newProfileId } );

                if( this._newImagesToInsert ){
                    uploadRestaurantProfileImages( this._filesToUpload, this._user, this._restaurantId ).then( ( result ) => {
                        this._filesToUpload = [];
                        this._newImagesToInsert = false;
                        let _lMessage: string = this.itemNameTraduction( 'RESTAURANT_PROFILE.PROFILE_CREATED' );
                        this._snackBar.open( _lMessage, '', { duration: 2500 } );
                    }).catch( ( err ) => {
                        var error: string = this.itemNameTraduction('UPLOAD_IMG_ERROR');
                        this.openDialog(this._titleMsg, '', error, '', this._btnAcceptLbl, false);
                    });
                } else {
                    let _lMessage: string = this.itemNameTraduction( 'RESTAURANT_PROFILE.PROFILE_CREATED' );
                    this._snackBar.open( _lMessage, '', { duration: 2500 } );
                }
            }
        }
    }

    /**
     * Remove restaurant image profile
     * @param {string} _pImageProfileId 
     */
    removeImageProfile( _pImageProfileId:string ){
        this._mdDialogRef = this._mdDialog.open( AlertConfirmComponent, {
            disableClose: true,
            data: {
                title: this.itemNameTraduction( 'RESTAURANT_PROFILE.REMOVE_IMAGE' ),
                subtitle: '',
                content: this.itemNameTraduction( 'RESTAURANT_PROFILE.REMOVE_IMAGE_CONFIRM' ),
                buttonCancel: this.itemNameTraduction( 'NO' ),
                buttonAccept: this.itemNameTraduction( 'YES' ),
                showCancel: true
            }
        });
        this._mdDialogRef.afterClosed().subscribe( result => {
            this._mdDialogRef = result;
            if ( result.success ){
                let _lImageId:string = RestaurantProfileImageThumbs.findOne( { _id: _pImageProfileId } ).originalId;
                RestaurantProfileImages.remove( { _id: _lImageId } );
                RestaurantProfileImageThumbs.remove( { _id: _pImageProfileId } );
                let _lMessage: string = this.itemNameTraduction( 'RESTAURANT_PROFILE.IMAGE_REMOVED' );
                this._snackBar.open( _lMessage, '', { duration: 2500 } );
            }
        });
    }

    /**
     * Go to add new Restaurant
     */
    goToAddRestaurant():void{
        this._router.navigate(['/app/restaurant-register']);
    }

    /**
     * Evaluate tabs changes
     * @param {any} _tab 
     */
    tabChanged( _tab: any ):void{
        this._mapRender = _tab.index === 3 ? true : false;
    }

    /**
     * Return traduction
     * @param {string} itemName 
     */
    itemNameTraduction(itemName: string): string {
        var wordTraduced: string;
        this._translate.get(itemName).subscribe((res: string) => {
            wordTraduced = res;
        });
        return wordTraduced;
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
        
        this._mdDialogRef = this._mdDialog.open(AlertConfirmComponent, {
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
        this._mdDialogRef.afterClosed().subscribe(result => {
            this._mdDialogRef = result;
            if (result.success) {

            }
        });
    }

    /**
     * ngOnDestroy Implementation
     */
    ngOnDestroy(){
        this.removeSubscriptions();
    }
}