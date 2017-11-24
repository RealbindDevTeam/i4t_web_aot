import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { UserLanguageService } from '../../../shared/services/user-language.service';
import { Subcategories } from '../../../../both/collections/administration/subcategory.collection';
import { Subcategory } from '../../../../both/models/administration/subcategory.model';
import { Categories } from '../../../../both/collections/administration/category.collection';
import { Category } from '../../../../both/models/administration/category.model';
import { SubcategoryEditComponent } from './subcategories-edit/subcategories-edit.component';
import { Restaurant } from '../../../../both/models/restaurant/restaurant.model';
import { Restaurants } from '../../../../both/collections/restaurant/restaurant.collection';
import { AlertConfirmComponent } from '../../../web/general/alert-confirm/alert-confirm.component';
import { UserDetails } from '../../../../both/collections/auth/user-detail.collection';
import { UserDetail } from '../../../../both/models/auth/user-detail.model';

@Component({
    selector: 'subcategory',
    templateUrl: './subcategories.component.html',
    styleUrls: [ './subcategories.component.scss' ]
})
export class SubcategoryComponent implements OnInit, OnDestroy {

    private _user = Meteor.userId();
    private _subcategoryForm: FormGroup;
    private _mdDialogRef: MatDialogRef<any>;

    private _subcategories: Observable<Subcategory[]>;
    private _categories: Observable<Category[]>;
    private _restaurants: Observable<Restaurant[]>;
    private _userDetails: Observable<UserDetail[]>;

    private _subcategorySub: Subscription;
    private _categoriesSub: Subscription;
    private _restaurantSub: Subscription;
    private _userDetailsSub: Subscription;

    _selectedValue: string;
    private titleMsg: string;
    private btnAcceptLbl: string;
    _dialogRef: MatDialogRef<any>;
    private _thereAreRestaurants: boolean = true;

    private _thereAreUsers: boolean = false;
    private _usersCount: number;


    /**
     * SubcategoryComponent constructor
     * @param {MatDialog} _dialog
     * @param {MatSnackBar} snackBar
     * @param {FormBuilder} _formBuilder
     * @param {TranslateService} _translate
     * @param {Router} _router
     * @param {NgZone} _ngZone
     * @param {UserLanguageService} _userLanguageService
     */
    constructor(public _dialog: MatDialog,
        public snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _translate: TranslateService,
        private _router: Router,
        private _ngZone: NgZone,
        private _userLanguageService: UserLanguageService,
        protected _mdDialog: MatDialog) {
        _translate.use(this._userLanguageService.getLanguage(Meteor.user()));
        _translate.setDefaultLang('en');
        this._selectedValue = "";
        this.titleMsg = 'SIGNUP.SYSTEM_MSG';
        this.btnAcceptLbl = 'SIGNUP.ACCEPT';
    }

    /**
     * Implements ngOnInit function
     */
    ngOnInit() {
        let _lRestaurantsId: string[] = [];
        this.removeSubscriptions();
        this._subcategoryForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
            category: new FormControl('')
        });
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
        this._categoriesSub = MeteorObservable.subscribe('categories', this._user).subscribe(() => {
            this._ngZone.run(() => {
                this._categories = Categories.find({}).zone();
            });
        });
        this._subcategorySub = MeteorObservable.subscribe('subcategories', this._user).subscribe(() => {
            this._ngZone.run(() => {
                this._subcategories = Subcategories.find({}).zone();
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
     * Remove all subscriptions
     */
    removeSubscriptions(): void {
        if (this._categoriesSub) { this._categoriesSub.unsubscribe(); }
        if (this._subcategorySub) { this._subcategorySub.unsubscribe(); }
        if (this._restaurantSub) { this._restaurantSub.unsubscribe(); }
        if (this._userDetailsSub) { this._userDetailsSub.unsubscribe(); }
    }

    /**
     * Function to add subcategory
     */
    addSubcategory(): void {
        if (!Meteor.userId()) {
            var error: string = 'LOGIN_SYSTEM_OPERATIONS_MSG';
            this.openDialog(this.titleMsg, '', error, '', this.btnAcceptLbl, false);
            return;
        }

        if (this._subcategoryForm.valid) {
            let _lNewSubcategory = Subcategories.collection.insert({
                creation_user: this._user,
                creation_date: new Date(),
                modification_user: '-',
                modification_date: new Date(),
                is_active: true,
                name: this._subcategoryForm.value.name,
                category: this._subcategoryForm.value.category
            });

            if (_lNewSubcategory) {
                let _lMessage: string = this.itemNameTraduction('SUBCATEGORIES.SUBCATEGORY_CREATED');
                this.snackBar.open(_lMessage, '', {
                    duration: 2500
                });
            }

            this._subcategoryForm.reset();
            this._selectedValue = "";
        }
    }

    /**
     * This function set category value in the form when the value select change
     */
    changeCategory(_pCategory): void {
        this._subcategoryForm.controls['category'].setValue(_pCategory);
    }

    /**
     * Function to cancel add Subcategory
     */
    cancel(): void {
        this._subcategoryForm.controls['name'].reset();
        this._selectedValue = "";
    }

    /**
     * Function to update Subcategory status
     * @param {Subcategory} _subcategory
     */
    updateStatus(_subcategory: Subcategory): void {
        if (!Meteor.userId()) {
            var error: string = 'LOGIN_SYSTEM_OPERATIONS_MSG';
            this.openDialog(this.titleMsg, '', error, '', this.btnAcceptLbl, false);
            return;
        }

        Subcategories.update(_subcategory._id, {
            $set: {
                is_active: !_subcategory.is_active,
                modification_date: new Date(),
                modification_user: this._user
            }
        });
    }

    /**
     * When useer wants edit Subcategory, this function open dialog with Subcategory information
     * @param {Subcategory} _subcategory
     */
    open(_subcategory: Subcategory) {
        this._dialogRef = this._dialog.open(SubcategoryEditComponent, {
            disableClose: true,
            width: '60%'
        });
        this._dialogRef.componentInstance._subcategoryToEdit = _subcategory;
        this._dialogRef.afterClosed().subscribe(result => {
            this._dialogRef = null;
        });
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
     * Go to add new Restaurant
     */
    goToAddRestaurant() {
        this._router.navigate(['/app/restaurant-register']);
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
     * Implements ngOnDestroy function
     */
    ngOnDestroy() {
        this.removeSubscriptions();
    }
}