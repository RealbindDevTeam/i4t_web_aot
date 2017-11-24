import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from '../../../both/shared-components/validators/custom-validator';
import { Observable, Subscription } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { UserDetails } from '../../../both/collections/auth/user-detail.collection';
import { Countries } from '../../../both/collections/settings/country.collection';
import { Country } from '../../../both/models/settings/country.model';
import { City } from '../../../both/models/settings/city.model';
import { Cities } from '../../../both/collections/settings/city.collection';
import { UserProfile } from '../../../both/models/auth/user-profile.model';
import { AuthClass } from './auth.class';

@Component({
    selector: 'admin-signup',
    templateUrl: './admin-signup.component.html',
    styleUrls: [ './auth.component.scss' ]
})
export class AdminSignupComponent extends AuthClass implements OnInit, OnDestroy {

    private _countrySub: Subscription;
    private _countries: Observable<Country[]>;
    private _citySub: Subscription;
    private _cities: Observable<City[]>;
    private _selectedCountry: string;
    private _selectedCity: string = "";
    private _showOtherCity: boolean = false;

    private signupForm: FormGroup;
    private showLoginPassword: boolean = true;
    private showConfirmError: boolean = false;
    private userProfile = new UserProfile();

    /**
     * AdminSignupComponent Constructor
     * @param {Router} router 
     * @param {NgZone} zone 
     * @param {FormBuilder} formBuilder 
     * @param {TranslateService} translate 
     * @param {NgZone} _ngZone 
     */
    constructor(protected router: Router,
        protected zone: NgZone,
        protected translate: TranslateService,
        protected _mdDialog: MatDialog) {
        super(router, zone, translate, _mdDialog);
    }

    ngOnInit() {
        this.removeSubscriptions();
        this.signupForm = new FormGroup({
            username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), CustomValidators.noSpacesValidator]),
            email: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255), CustomValidators.emailValidator]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
            firstName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(70)]),
            lastName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(70)]),
            dniNumber: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]),
            contactPhone: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]),
            shippingAddress: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]),
            country: new FormControl('', [Validators.required]),
            city: new FormControl('', [Validators.required]),
            otherCity: new FormControl()
        });

        this._countrySub = MeteorObservable.subscribe('countries').subscribe(() => {
            this.zone.run(() => {
                this._countries = Countries.find({}).zone();
            });
        });

        this._citySub = MeteorObservable.subscribe('cities').subscribe(() => {
            this.zone.run(() => {
                this._cities = Cities.find({ country: '' }).zone();
            });
        });
    }

    /**
     * Remove all subscriptions
     */
    removeSubscriptions():void{
        if( this._countrySub ){ this._countrySub.unsubscribe(); }
        if( this._citySub ){ this._citySub.unsubscribe(); }
    }

    /**
    * This function changes de country to select
    *@param {Country} _country
    */
    changeCountry(_country: Country) {
        this._cities = Cities.find({ country: _country._id }).zone();
    }

    /**
     * This function changes de city to select other city
     * @param {string} cityId
     */
    changeOtherCity(cityId: string) {
        this._showOtherCity = true;
        this.signupForm.controls['otherCity'].setValidators(Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)]));
    }

    /**
     * This function changes de city 
     */
    changeCity() {
        this._showOtherCity = false;
        this.signupForm.controls['otherCity'].clearValidators();
    }

    /**
     * This function makes the administrator register for iurest restaurant
     */
    register() {

        let cityIdAux: string;
        let cityAux: string;
        if (this.signupForm.value.password == this.signupForm.value.confirmPassword) {

            this.userProfile.first_name = this.signupForm.value.firstName;
            this.userProfile.last_name = this.signupForm.value.lastName;
            this.userProfile.language_code = this.getUserLang();

            if (this.signupForm.valid) {
                let confirmMsg: string;
                if (this._selectedCity === '0000') {
                    cityIdAux = '';
                    cityAux = this.signupForm.value.otherCity;
                } else {
                    cityIdAux = this._selectedCity;
                    cityAux = '';
                }
                Accounts.createUser({
                    username: this.transformToLower(this.signupForm.value.username),
                    email: this.transformToLower(this.signupForm.value.email),
                    password: this.signupForm.value.password,
                    profile: this.userProfile
                }, (err) => {
                    this.zone.run(() => {
                        if (err) {
                            let confirmMsg: string;
                            if (err.reason === 'Username already exists.' || err.reason === 'Email already exists.') {
                                confirmMsg = 'SIGNUP.USER_EMAIL_EXISTS';
                            } else {
                                confirmMsg = 'SIGNUP.ERROR'
                            }
                            this.openDialog(this.titleMsg, '', confirmMsg, '', this.btnAcceptLbl, false);
                        } else {
                            confirmMsg = 'SIGNUP.SUCCESS'
                            UserDetails.insert({
                                user_id: Meteor.userId(),
                                role_id: '100',
                                is_active: true,
                                contact_phone: this.signupForm.value.contactPhone,
                                dni_number: this.signupForm.value.dniNumber,
                                address: this.signupForm.value.shippingAddress,
                                country_id: this._selectedCountry,
                                city_id: cityIdAux,
                                other_city: cityAux
                            });
                            this.openDialog(this.titleMsg, '', confirmMsg, '', this.btnAcceptLbl, false);
                            Meteor.logout();
                            this.router.navigate(['signin']);
                        }
                    });
                });
            }

        } else {
            this.showConfirmError = true;
        }
    }

    ngOnDestroy() {
        this.removeSubscriptions();
    }
}