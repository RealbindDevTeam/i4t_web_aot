import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MeteorObservable } from 'meteor-rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserLanguageService } from '../../../../shared/services/user-language.service';
import { uploadRestaurantImage } from '../../../../../both/methods/restaurant/restaurant.methods';
import { Restaurants, RestaurantImages, RestaurantImageThumbs, RestaurantsLegality } from '../../../../../both/collections/restaurant/restaurant.collection';
import { Restaurant, RestaurantImage, RestaurantImageThumb, RestaurantLegality } from '../../../../../both/models/restaurant/restaurant.model';
import { Currency } from '../../../../../both/models/general/currency.model';
import { Currencies } from '../../../../../both/collections/general/currency.collection';
import { PaymentMethod } from '../../../../../both/models/general/paymentMethod.model';
import { PaymentMethods } from '../../../../../both/collections/general/paymentMethod.collection';
import { Countries } from '../../../../../both/collections/settings/country.collection';
import { Country } from '../../../../../both/models/settings/country.model';
import { City } from '../../../../../both/models/settings/city.model';
import { Cities } from '../../../../../both/collections/settings/city.collection';
import { Parameter } from '../../../../../both/models/general/parameter.model';
import { Parameters } from '../../../../../both/collections/general/parameter.collection';
import { AlertConfirmComponent } from '../../../../web/general/alert-confirm/alert-confirm.component';

@Component({
    selector: 'restaurant-edition',
    templateUrl: './restaurant-edition.component.html',
    styleUrls: [ './restaurant-edition.component.scss' ]
})
export class RestaurantEditionComponent implements OnInit, OnDestroy {

    private _user = Meteor.userId();
    private _restaurantToEdit               : Restaurant;
    private _restaurantEditionForm          : FormGroup;
    private _paymentsFormGroup              : FormGroup = new FormGroup({});
    private _mdDialogRef                    : MatDialogRef<any>;
    
    private _restaurantSub                  : Subscription;
    private _currencySub                    : Subscription;
    private _countriesSub                   : Subscription;
    private _citiesSub                      : Subscription;
    private _paymentMethodsSub              : Subscription;
    private _restaurantImagesSub            : Subscription;
    private _restaurantImageThumbsSub       : Subscription;
    private _parameterSub                   : Subscription;

    private _countries                      : Observable<Country[]>;
    private _cities                         : Observable<City[]>;
    private _currencies                     : Observable<Currency[]>;
    private _parameterDaysTrial             : Observable<Parameter[]>;

    private _paymentMethods                 : PaymentMethod[] = [];
    private _paymentMethodsList             : PaymentMethod[] = [];
    private _restaurantPaymentMethods       : string[] = [];

    private _filesToUpload                  : Array<File>;
    private _restaurantImageToEdit          : File;
    private _editImage                      : boolean = false;
    private _nameImageFileEdit              : string = "";
    public _selectedIndex                   : number = 0;
    private _restaurantEditImage            : string;

    private _queue                          : string[] = [];
    private _selectedCountryValue           : string = "";
    private _selectedCityValue              : string = "";

    private _restaurantCountryValue         : string;
    private _restaurantCityValue            : string;

    private _restaurantCurrency             : string = '';
    private _countryIndicative              : string;
    private titleMsg                        : string;
    private btnAcceptLbl                    : string;

    private _showOtherCity: boolean;
    private _restaurantLegalityToEdit: RestaurantLegality;
    private _tipValue: number = 0;

    /**
     * RestaurantEditionComponent Constructor
     * @param {FormBuilder} _formBuilder 
     * @param {TranslateService} _translate 
     * @param {NgZone} _ngZone 
     * @param {ActivatedRoute} _route 
     * @param {Router} _router 
     * @param {UserLanguageService} _userLanguageService
     */
    constructor(private _formBuilder: FormBuilder,
        private _translate: TranslateService,
        private _ngZone: NgZone,
        private _route: ActivatedRoute,
        private _router: Router,
        private _userLanguageService: UserLanguageService,
        protected _mdDialog: MatDialog) {

        this._route.params.forEach((params: Params) => {
            this._restaurantToEdit = JSON.parse(params['param1']);
        });
        _translate.use(this._userLanguageService.getLanguage(Meteor.user()));
        _translate.setDefaultLang('en');

        this.titleMsg = 'SIGNUP.SYSTEM_MSG';
        this.btnAcceptLbl = 'SIGNUP.ACCEPT';
    }

    /**
     * ngOnInit implementation
     */
    ngOnInit() {
        this.removeSubscriptions();
        this._restaurantSub = MeteorObservable.subscribe('restaurants', this._user).subscribe();

        this._countriesSub = MeteorObservable.subscribe('countries').subscribe(() => {
            this._ngZone.run(() => {
                this._countries = Countries.find({}).zone();
                let _lCountry: Country = Countries.findOne({ _id: this._restaurantToEdit.countryId });
            });
        });

        this._citiesSub = MeteorObservable.subscribe('citiesByCountry', this._restaurantToEdit.countryId).subscribe(() => {
            this._ngZone.run(() => {
                this._cities = Cities.find({}).zone();
            });
        });

        this._restaurantImagesSub = MeteorObservable.subscribe('restaurantImages', this._user).subscribe();
        this._restaurantImageThumbsSub = MeteorObservable.subscribe('restaurantImageThumbs', this._user).subscribe(() => {
            this._ngZone.run(() => {
                let _lRestaurantImage: RestaurantImageThumb = RestaurantImageThumbs.findOne({ restaurantId: this._restaurantToEdit._id });
                if (_lRestaurantImage) {
                    this._restaurantEditImage = _lRestaurantImage.url
                } else {
                    this._restaurantEditImage = '/images/default-restaurant.png';
                }
            });
        });

        this._currencySub = MeteorObservable.subscribe('currencies').subscribe(() => {
            this._ngZone.run(() => {
                let find: Currency = Currencies.findOne({ _id: this._restaurantToEdit.currencyId });
                this._restaurantCurrency = find.code + ' - ' + this.itemNameTraduction(find.name);
            });
        });

        this._paymentMethodsSub = MeteorObservable.subscribe('paymentMethods').subscribe(() => {
            this._ngZone.run(() => {
                this._paymentMethods = PaymentMethods.collection.find({}).fetch();
                for (let pay of this._paymentMethods) {
                    let paymentTranslated: PaymentMethod = {
                        _id: pay._id,
                        isActive: pay.isActive,
                        name: this.itemNameTraduction(pay.name)
                    };

                    let find = this._restaurantPaymentMethods.filter(p => p === paymentTranslated._id);

                    if (find.length > 0) {
                        let control: FormControl = new FormControl(true);
                        this._paymentsFormGroup.addControl(paymentTranslated.name, control);
                        this._paymentMethodsList.push(paymentTranslated);
                    } else {
                        let control: FormControl = new FormControl(false);
                        this._paymentsFormGroup.addControl(paymentTranslated.name, control);
                        this._paymentMethodsList.push(paymentTranslated);
                    }
                }
            });
        });

        this._parameterSub = MeteorObservable.subscribe('getParameters').subscribe(() => {
            this._parameterDaysTrial = Parameters.find({ _id: '100' });
        });

        this._restaurantEditionForm = new FormGroup({
            editId: new FormControl(this._restaurantToEdit._id),
            country: new FormControl(this._restaurantToEdit.countryId),
            city: new FormControl(this._restaurantToEdit.cityId),
            name: new FormControl(this._restaurantToEdit.name),
            address: new FormControl(this._restaurantToEdit.address),
            phone: new FormControl(this._restaurantToEdit.phone),
            editImage: new FormControl(''),
            paymentMethods: this._paymentsFormGroup,
            otherCity: new FormControl(this._restaurantToEdit.other_city)
        });


        this._selectedCountryValue = this._restaurantToEdit.countryId;
        this._restaurantCountryValue = this._restaurantToEdit.countryId;
        if( ( this._restaurantToEdit.cityId === null || this._restaurantToEdit.cityId === '' ) && this._restaurantToEdit.other_city !== '' ){
            this._selectedCityValue = '0000';
            this._showOtherCity = true;
        } else {
            this._selectedCityValue = this._restaurantToEdit.cityId;   
            this._showOtherCity = false;         
        }

        this._restaurantCityValue = this._restaurantToEdit.cityId;
        this._restaurantPaymentMethods = this._restaurantToEdit.paymentMethods;
        this._countryIndicative = this._restaurantToEdit.indicative;
        this._queue = this._restaurantToEdit.queue;
        this._tipValue = this._restaurantToEdit.tip_percentage;
    }

    /**
     * Remove all subscriptions
     */
    removeSubscriptions():void{
        if( this._restaurantSub ){ this._restaurantSub.unsubscribe(); }
        if( this._currencySub ){ this._currencySub.unsubscribe(); }
        if( this._countriesSub ){ this._countriesSub.unsubscribe(); }
        if( this._citiesSub ){ this._citiesSub.unsubscribe(); }
        if( this._paymentMethodsSub ){ this._paymentMethodsSub.unsubscribe(); }
        if( this._restaurantImagesSub ){ this._restaurantImagesSub.unsubscribe(); }
        if( this._restaurantImageThumbsSub ){ this._restaurantImageThumbsSub.unsubscribe(); }
        if( this._parameterSub ){ this._parameterSub.unsubscribe(); }
    }

    /**
     * Funtion to edit Restaurant
     */
    editRestaurant(): void {
        if (!Meteor.userId()) {
            this.openDialog(this.titleMsg, '', 'LOGIN_SYSTEM_OPERATIONS_MSG', '', this.btnAcceptLbl, false);
            return;
        }

        let cityIdAux: string;
        let cityAux: string;

        let arrPay: any[] = Object.keys(this._restaurantEditionForm.value.paymentMethods);
        let _lPaymentMethodsToInsert: string[] = [];

        arrPay.forEach((pay) => {
            if (this._restaurantEditionForm.value.paymentMethods[pay]) {
                let _lPayment: PaymentMethod = this._paymentMethodsList.filter(p => p.name === pay)[0];
                _lPaymentMethodsToInsert.push(_lPayment._id);
            }
        });

        if (this._selectedCityValue === '0000' || this._selectedCityValue == "") {
            cityIdAux = '';
            cityAux = this._restaurantEditionForm.value.otherCity;
        } else {
            cityIdAux = this._selectedCityValue;
            cityAux = '';
        }

        Restaurants.update(this._restaurantEditionForm.value.editId, {
            $set: {
                modification_user: Meteor.userId(),
                modification_date: new Date(),
                countryId: this._restaurantEditionForm.value.country,
                cityId: cityIdAux,
                other_city: cityAux,
                name: this._restaurantEditionForm.value.name,
                address: this._restaurantEditionForm.value.address,
                phone: this._restaurantEditionForm.value.phone,
                paymentMethods: _lPaymentMethodsToInsert,
                tip_percentage: this._tipValue,
                queue: this._queue
            }
        });

        // Colombia
        if( this._restaurantEditionForm.value.country === '1900' ){
            RestaurantsLegality.update( { _id: this._restaurantLegalityToEdit._id }, {
                $set: {
                    regime: this._restaurantLegalityToEdit.regime,
                    forced_to_invoice: this._restaurantLegalityToEdit.forced_to_invoice === undefined || this._restaurantLegalityToEdit.forced_to_invoice === null ? false : this._restaurantLegalityToEdit.forced_to_invoice,
                    forced_to_inc: this._restaurantLegalityToEdit.forced_to_inc === undefined || this._restaurantLegalityToEdit.forced_to_inc === null ? false : this._restaurantLegalityToEdit.forced_to_inc,
                    business_name: this._restaurantLegalityToEdit.business_name === undefined || this._restaurantLegalityToEdit.business_name === null ? '' : this._restaurantLegalityToEdit.business_name,
                    document: this._restaurantLegalityToEdit.document === undefined || this._restaurantLegalityToEdit.document === null ? '' : this._restaurantLegalityToEdit.document,
                    invoice_resolution: this._restaurantLegalityToEdit.invoice_resolution === undefined || this._restaurantLegalityToEdit.invoice_resolution === null ? '' : this._restaurantLegalityToEdit.invoice_resolution,
                    invoice_resolution_date: this._restaurantLegalityToEdit.invoice_resolution_date === undefined || this._restaurantLegalityToEdit.invoice_resolution_date === null ? '' : this._restaurantLegalityToEdit.invoice_resolution_date,
                    prefix: this._restaurantLegalityToEdit.prefix === undefined || this._restaurantLegalityToEdit.prefix === null ? false : this._restaurantLegalityToEdit.prefix,
                    prefix_name: this._restaurantLegalityToEdit.prefix_name === undefined || this._restaurantLegalityToEdit.prefix_name === null ? '' : this._restaurantLegalityToEdit.prefix_name,
                    numeration_from: this._restaurantLegalityToEdit.numeration_from === undefined || this._restaurantLegalityToEdit.numeration_from === null ? '' : this._restaurantLegalityToEdit.numeration_from,
                    numeration_to: this._restaurantLegalityToEdit.numeration_to === undefined || this._restaurantLegalityToEdit.numeration_to === null ? '' : this._restaurantLegalityToEdit.numeration_to,
                    is_big_contributor: this._restaurantLegalityToEdit.is_big_contributor === undefined || this._restaurantLegalityToEdit.is_big_contributor === null ? false : this._restaurantLegalityToEdit.is_big_contributor,
                    big_contributor_resolution: this._restaurantLegalityToEdit.big_contributor_resolution === undefined || this._restaurantLegalityToEdit.big_contributor_resolution === null ? '' : this._restaurantLegalityToEdit.big_contributor_resolution,
                    big_contributor_date: this._restaurantLegalityToEdit.big_contributor_date === undefined || this._restaurantLegalityToEdit.big_contributor_date === null ? '' : this._restaurantLegalityToEdit.big_contributor_date,
                    is_self_accepting: this._restaurantLegalityToEdit.is_self_accepting === undefined || this._restaurantLegalityToEdit.is_self_accepting === null ? false : this._restaurantLegalityToEdit.is_self_accepting,
                    self_accepting_resolution: this._restaurantLegalityToEdit.self_accepting_resolution === undefined || this._restaurantLegalityToEdit.self_accepting_resolution === null ? '' : this._restaurantLegalityToEdit.self_accepting_resolution,
                    self_accepting_date: this._restaurantLegalityToEdit.self_accepting_date === undefined || this._restaurantLegalityToEdit.self_accepting_date === null ? '' : this._restaurantLegalityToEdit.self_accepting_date,
                    text_at_the_end: this._restaurantLegalityToEdit.text_at_the_end === undefined || this._restaurantLegalityToEdit.text_at_the_end === null ? '' : this._restaurantLegalityToEdit.text_at_the_end
                }
            });
        }

        if (this._editImage) {
            let _lRestaurantImage: RestaurantImage = RestaurantImages.findOne({ restaurantId: this._restaurantEditionForm.value.editId });
            let _lRestaurantImageThumb: RestaurantImageThumb = RestaurantImageThumbs.findOne({ restaurantId: this._restaurantEditionForm.value.editId });
            if (_lRestaurantImage) { RestaurantImages.remove({ _id: _lRestaurantImage._id }); }
            if (_lRestaurantImageThumb) { RestaurantImageThumbs.remove({ _id: _lRestaurantImageThumb._id }); }

            uploadRestaurantImage(this._restaurantImageToEdit,
                Meteor.userId(),
                this._restaurantEditionForm.value.editId).then((result) => {

                }).catch((err) => {
                    var error : string = this.itemNameTraduction('UPLOAD_IMG_ERROR');
                    this.openDialog(this.titleMsg, '', error, '', this.btnAcceptLbl, false);
                });
        }
        this.cancel();
    }

    /**
     * Function to cancel edition
     */
    cancel(): void {
        this._router.navigate(['app/restaurant']);
    }

    /**
     * This function get selectedIndex
     */
    get selectedIndex(): number {
        return this._selectedIndex;
    }

    /**
     * This function set selectedIndex
     * @param {number} _selectedIndex
     */
    set selectedIndex(_selectedIndex: number) {
        this._selectedIndex = _selectedIndex;
    }

    /**
     * This fuction allow wizard to create restaurant
     */
    canFinish(): boolean {
        return this._restaurantEditionForm.valid;
    }

    /**
     * This function allow move in wizard tabs
     * @param {number} _index
     */
    canMove(_index: number): boolean {
        switch (_index) {
            case 0:
                return true;
            case 1:
                if (this._restaurantEditionForm.controls['country'].valid && this._restaurantEditionForm.controls['city'].valid
                    && this._restaurantEditionForm.controls['name'].valid && this._restaurantEditionForm.controls['address'].valid
                    && this._restaurantEditionForm.controls['phone'].valid) {
                    return true;
                } else {
                    return false;
                }
            default:
                return true;
        }
    }

    /**
     * This function move to the next tab
     */
    next(): void {
        if (this.canMove(this.selectedIndex + 1)) {
            this.selectedIndex++;
        }
    }

    /**
     * This function move to the previous tab
     */
    previous(): void {
        if (this.selectedIndex === 0) {
            return;
        }
        if (this.canMove(this.selectedIndex - 1)) {
            this.selectedIndex--;
        }
    }

    /**
     * Function to change country
     * @param {string} _country
     */
    changeCountry(_country) {
        this._selectedCountryValue = _country;
        this._restaurantEditionForm.controls['country'].setValue(_country);
        this._cities = Cities.find({ country: _country }).zone();

        let _lCountry: Country;
        Countries.find({ _id: _country }).fetch().forEach((c) => {
            _lCountry = c;
        });
        let _lCurrency: Currency;
        Currencies.find({ _id: _lCountry.currencyId }).fetch().forEach((cu) => {
            _lCurrency = cu;
        });
        this._restaurantCurrency = _lCurrency.code + ' - ' + this.itemNameTraduction(_lCurrency.name);
        this._countryIndicative = _lCountry.indicative;
        this._queue = _lCountry.queue;
    }

    /**
     * Function to change city
     * @param {string} _city
     */
    changeCity(_city) {
        let control = this._restaurantEditionForm.get('otherCity');
        if (_city === '0000') {
            this._showOtherCity = true;
            control.setValidators(Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)]));
        } else {
            this._showOtherCity = false;
            control.clearValidators();
            control.reset();
        }
    }

    /**
     * When user change Image, this function allow update in the store
     * @param {any} _fileInput
     */
    onChangeImage(_fileInput: any): void {
        this._editImage = true;
        this._filesToUpload = <Array<File>>_fileInput.target.files;
        this._restaurantImageToEdit = this._filesToUpload[0];
        this._nameImageFileEdit = this._restaurantImageToEdit.name;
    }

    /**
     * Function to translate information
     * @param {string} _itemName
     */
    itemNameTraduction(_itemName: string): string {
        var _wordTraduced: string;
        this._translate.get(_itemName).subscribe((res: string) => {
            _wordTraduced = res;
        });
        return _wordTraduced;
    }

    /**
     * Set restaurant legality
     * @param {RestaurantLegality} _event
     */
    setRestaurantLegality( _event: RestaurantLegality ):void {
        this._restaurantLegalityToEdit = _event;
        this.editRestaurant();
    }

    /**
     * Run previous function
     * @param {boolean} _event 
     */
    runPrevious( _event : boolean ):void{
        if( _event ){
            this.previous();
        }
    }

    /**
     * Run cancel function
     * @param {boolean} _event
     */
    runCancel( _event: boolean ):void{
        if( _event ){
            this.cancel();
        }
    }
    
    /**
     * Set restaurant tip value
     * @param {number} _event
     */
    setTipValue( _event: number ):void{
        this._tipValue = _event;
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
    ngOnDestroy() {
        this.removeSubscriptions();   
    }
}