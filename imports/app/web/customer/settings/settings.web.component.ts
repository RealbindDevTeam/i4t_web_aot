import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Accounts } from 'meteor/accounts-base';
import { TranslateService } from '@ngx-translate/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Subscription, Subject, Observable } from 'rxjs';
import { UserLanguageService } from '../../../shared/services/user-language.service';
import { Countries } from '../../../../both/collections/settings/country.collection';
import { Country } from '../../../../both/models/settings/country.model';
import { City } from '../../../../both/models/settings/city.model';
import { Cities } from '../../../../both/collections/settings/city.collection';
import { Language } from '../../../../both/models/settings/language.model';
import { Languages } from '../../../../both/collections/settings/language.collection';
import { Users, UserImages } from '../../../../both/collections/auth/user.collection';
import { User } from '../../../../both/models/auth/user.model';
import { UserDetails } from '../../../../both/collections/auth/user-detail.collection';
import { UserDetail } from '../../../../both/models/auth/user-detail.model';
import { ChangeEmailWebComponent } from './modal-dialog/change-email.web.component';
import { ChangePasswordWebComponent } from '../../../web/customer/settings/modal-dialog/change-password.web.component';
import { uploadUserImage } from '../../../../both/methods/auth/user-profile.methods';
import { UserProfileImage } from '../../../../both/models/auth/user-profile.model';
import { AlertConfirmComponent } from '../../../web/general/alert-confirm/alert-confirm.component';

@Component({
    selector: 'settings',
    templateUrl: './settings.web.component.html',
    styleUrls: [ './settings.web.component.scss' ]
})
export class SettingsWebComponent implements OnInit, OnDestroy {

    private _userForm               : FormGroup;

    private _userSubscription       : Subscription;
    private _userDetailSubscription : Subscription;
    private _subscription           : Subscription;
    private _countrySubscription    : Subscription;
    private _citySubscription       : Subscription;

    private _countries              : Observable<Country[]>;
    private _cities                 : Observable<City[]>;
    private _languages              : Observable<Language[]>;

    private _mdDialogRef            : MatDialogRef<any>;
    private _user                   : User;
    private _userDetail             : UserDetail;

    private _userName               : string;
    private _firstName              : string;
    private _lastName               : string;
    private _message                : string;
    private _languageCode           : string;
    private _imageProfile           : string;
    private _lang_code              : string;

    private titleMsg                : string;
    private btnAcceptLbl            : string;
    private _disabled               : boolean = true;
    private _showOtherCity          : boolean = false;
    private _validateChangeEmail    : boolean = true;
    private _validateChangePass     : boolean = true;
    private _createImage            : boolean = false;
    private _loading                : boolean = false;

    private _filesToUpload          : Array<File>;
    private _itemImageToInsert      : File;

    /**
     * SettingsWebComponent Constructor
     * @param {TranslateService} _translate 
     * @param {MatDialog} _mdDialog
     * @param {UserLanguageService} _userLanguageService 
     * @param {NgZone} _ngZone
     */
    constructor ( private _translate: TranslateService, 
                  public _mdDialog: MatDialog,
                  private _userLanguageService: UserLanguageService,
                  private _ngZone: NgZone ){
        let _lUserLanguage = this._userLanguageService.getLanguage( Meteor.user() );
        _translate.use( _lUserLanguage );  
        _translate.setDefaultLang( 'en' ); 
        this._languageCode = _lUserLanguage;
        this._lang_code = _lUserLanguage;
        this.titleMsg = 'SIGNUP.SYSTEM_MSG';
        this.btnAcceptLbl = 'SIGNUP.ACCEPT';
    }
    
    /**
     * ngOnInit implementation
     */
    ngOnInit(){
        this.removeSubscriptions();

        this._userSubscription = MeteorObservable.subscribe('getUserSettings').subscribe();

        this._countrySubscription = MeteorObservable.subscribe('countries').subscribe(() => {
            this._ngZone.run(() => {
                this._countries = Countries.find({}).zone();
            });
        });

        this._citySubscription = MeteorObservable.subscribe('cities').subscribe();
        
        this._subscription = MeteorObservable.subscribe('languages').subscribe(()=>{
            this._ngZone.run(() => {
                this._languages = Languages.find({}).zone();
            });
        });

        this._userDetailSubscription = MeteorObservable.subscribe('getUserDetailsByUser', Meteor.userId()).subscribe(()=>{
            this._ngZone.run( ()=> {
                
                this._user = Users.findOne({_id: Meteor.userId()});;
                this._userDetail = UserDetails.findOne({user_id: Meteor.userId()});

                if(this._user.services.facebook){
                    this._userForm = new FormGroup({
                        username: new FormControl({value: this._user.services.facebook.name, disabled : true}),
                        first_name: new FormControl({value: this._user.services.facebook.first_name, disabled : true}),
                        last_name: new FormControl({value: this._user.services.facebook.last_name, disabled : true}),
                    });
                }
                
                if(this._user.username){
                    this._userForm = new FormGroup({
                        username: new FormControl({value: this._user.username, disabled : true}),
                        first_name: new FormControl({value: this._user.profile.first_name, disabled : false}),
                        last_name: new FormControl({value: this._user.profile.last_name, disabled : false}),
                        language_code: new FormControl({value: this._user.profile.language_code, disabled : false})
                    });
                    this._validateChangePass = false;
                    if(this._userDetail.role_id === '400') {
                        this._validateChangeEmail = false;
                    } else if(this._userDetail.role_id === '100') {
                        this._validateChangeEmail = false;
                        let dniNumber : FormControl =  new FormControl({value: this._userDetail.dni_number, disabled : false}, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]);
                        this._userForm.addControl('dniNumber', dniNumber);
                        
                        let contactPhone : FormControl = new FormControl({value: this._userDetail.contact_phone, disabled : false}, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]);
                        this._userForm.addControl('contactPhone', contactPhone);
                        
                        let shippingAddress : FormControl = new FormControl({value: this._userDetail.address, disabled : false}, [Validators.required, Validators.minLength(1), Validators.maxLength(150)]);
                        this._userForm.addControl('shippingAddress', shippingAddress);
                        
                        let country : FormControl = new FormControl({value: this._userDetail.country_id, disabled : false}, [Validators.required]);
                        this._userForm.addControl('country', country);
                        
                        this.changeCountry(this._userDetail.country_id);
                        
                        let city : FormControl = new FormControl({value: this._userDetail.city_id, disabled : false}, [Validators.required]);
                        this._userForm.addControl('city', city);
                        
                        let otherCity : FormControl =  new FormControl();
                        this._userForm.addControl('otherCity', otherCity);
                        
                        if (this._userDetail.other_city) {
                            this._showOtherCity = true;
                            this._userForm.controls['city'].setValue('0000');
                            this._userForm.controls['otherCity'].setValue(this._userDetail.other_city);
                        }
                    } else {
                        this._userForm.controls['first_name'].disable();
                        this._userForm.controls['last_name'].disable();
                    }
                }
            });
        });
    }

    /**
     * Remove all subscriptions
     */
    removeSubscriptions():void{
        if( this._userSubscription ){ this._userSubscription.unsubscribe(); }
        if( this._userDetailSubscription ){ this._userDetailSubscription.unsubscribe(); }
        if( this._subscription ){ this._subscription.unsubscribe(); }
        if( this._countrySubscription ){ this._countrySubscription.unsubscribe(); }
        if( this._citySubscription ){ this._citySubscription.unsubscribe() }
    }

    /**
    * This function changes de country to select
    *@param {string} _countryId
    */
    changeCountry(_countryId: string) {
        this._cities = Cities.find({ country: _countryId }).zone();
    }

    /**
     * This function changes de city to select other city
     * @param {string} cityId
     */
    changeOtherCity(cityId: string) {
        this._showOtherCity = true;
        this._userForm.controls['otherCity'].setValidators(Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)]));
    }

    /**
     * This function changes de city 
     */
    changeCity() {
        this._showOtherCity = false;
        this._userForm.controls['otherCity'].clearValidators();
    }

    /**
     * Return user image
     */
    getUsetImage():string{
        if(this._user && this._user.services.facebook){
            return "http://graph.facebook.com/" + this._user.services.facebook.id + "/picture/?type=large";
        } else {
            let _lUserImage: UserProfileImage = UserImages.findOne( { userId: Meteor.userId() });
            if( _lUserImage ){
                return _lUserImage.url;
            } 
            else {
                return '/images/user_default_image.png';
            }
        }
    }

    /**
     * User detail edition 
     */
    editUserDetail():void {
        if( !Meteor.userId() ){
            var error : string = 'LOGIN_SYSTEM_OPERATIONS_MSG';
            this.openDialog(this.titleMsg, '', error, '', this.btnAcceptLbl, false);
            return;
        }
        
        if(this._userForm.valid){
            Users.update({_id: Meteor.userId()}, { $set: {
                profile: {  first_name: this._userForm.value.first_name,
                            last_name: this._userForm.value.last_name,
                            language_code: this._userForm.value.language_code }}
            });

            if(this._userDetail.role_id === '100'){
                let citySelected      : string = '';
                let othercitySelected : string = '';
                if(this._userForm.value.city === '0000'){
                    othercitySelected = this._userForm.value.otherCity;
                } else {
                    citySelected = this._userForm.value.city;
                }
                UserDetails.update({_id : this._userDetail._id},{ $set : {
                    contact_phone : this._userForm.value.contactPhone,
                    dni_number : this._userForm.value.dniNumber,
                    address : this._userForm.value.shippingAddress,
                    country_id : this._userForm.value.country,
                    city_id : citySelected,
                    other_city : othercitySelected }
                });
            }
            
            let message : string;
            message = this.itemNameTraduction('SETTINGS.USER_DETAIL_UPDATED');
            this.openDialog(this.titleMsg, '', message, '', this.btnAcceptLbl, false);
        }
    }

    /**
     * ChangeEmailWebComponent show
     */
    open() {
        this._mdDialogRef = this._mdDialog.open(ChangeEmailWebComponent, {
            disableClose : true 
        });
        this._mdDialogRef.afterClosed().subscribe(result => {
            this._mdDialogRef = null;
        });
    }

    /**
     * ChangePasswordWebComponent show
     */
    openModalChangePassword() {
        
        this._mdDialogRef = this._mdDialog.open( ChangePasswordWebComponent, {
            disableClose : true
        });
        this._mdDialogRef.afterClosed().subscribe(result => {
            this._mdDialogRef = null;
        });
    }

    /**
     * Traduction of the strings
     * @param itemName 
     */
    itemNameTraduction(itemName: string): string{
        var wordTraduced: string;
        this._translate.get(itemName).subscribe((res: string) => {
            wordTraduced = res; 
        });
        return wordTraduced;
    }

    /**
     * When user wants add image, this function allow insert the image in the store
     * @param {any} _fileInput
     */
    onChangeImage(_fileInput: any): void {
        this._loading = true;
        setTimeout(() => {
            this._createImage = true;
            this._filesToUpload = <Array<File>>_fileInput.target.files;
            this._itemImageToInsert = this._filesToUpload[0];

            let _lUserImage: UserProfileImage = UserImages.findOne( { userId: Meteor.userId() } );
            if( _lUserImage ){
                UserImages.remove( { _id: _lUserImage._id } );
            }
            uploadUserImage( this._itemImageToInsert, Meteor.userId() ).then((result) => {
                this._createImage = false;
            }).catch((err) => {
                var error : string = this.itemNameTraduction('UPLOAD_IMG_ERROR');
                this.openDialog(this.titleMsg, '', error, '', this.btnAcceptLbl, false);
            });
            this._loading = false;
        }, 3000);
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
     * ngOnDestroy implementation
     */
    ngOnDestroy(){
        this.removeSubscriptions();
    }
}