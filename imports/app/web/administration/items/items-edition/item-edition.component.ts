import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MeteorObservable } from 'meteor-rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MatSnackBar } from '@angular/material';
import { UserLanguageService } from '../../../../shared/services/user-language.service';
import { Item, ItemImage, ItemImageThumb, ItemRestaurant, ItemPrice } from '../../../../../both/models/administration/item.model';
import { Items, ItemImages, ItemImagesThumbs } from '../../../../../both/collections/administration/item.collection';
import { uploadItemImage } from '../../../../../both/methods/administration/item.methods';
import { Sections } from '../../../../../both/collections/administration/section.collection';
import { Section } from '../../../../../both/models/administration/section.model';
import { Categories } from '../../../../../both/collections/administration/category.collection';
import { Category } from '../../../../../both/models/administration/category.model';
import { Subcategory } from '../../../../../both/models/administration/subcategory.model';
import { Subcategories } from '../../../../../both/collections/administration/subcategory.collection';
import { Restaurant } from '../../../../../both/models/restaurant/restaurant.model';
import { Restaurants } from '../../../../../both/collections/restaurant/restaurant.collection';
import { GarnishFood } from '../../../../../both/models/administration/garnish-food.model';
import { GarnishFoodCol } from '../../../../../both/collections/administration/garnish-food.collection';
import { Addition } from '../../../../../both/models/administration/addition.model';
import { Additions } from '../../../../../both/collections/administration/addition.collection';
import { Currency } from '../../../../../both/models/general/currency.model';
import { Currencies } from '../../../../../both/collections/general/currency.collection';
import { Country } from '../../../../../both/models/settings/country.model';
import { Countries } from '../../../../../both/collections/settings/country.collection';
import { AlertConfirmComponent } from '../../../../web/general/alert-confirm/alert-confirm.component';

@Component({
    selector: 'item-edition',
    templateUrl: './item-edition.component.html',
    styleUrls: [ './item-edition.component.scss' ]
})
export class ItemEditionComponent implements OnInit, OnDestroy {

    private _user = Meteor.userId();
    public _itemToEdit                          : Item;
    private _itemEditionForm                    : FormGroup;
    private _garnishFormGroup                   : FormGroup = new FormGroup({});
    private _additionsFormGroup                 : FormGroup = new FormGroup({});
    private _restaurantsFormGroup               : FormGroup = new FormGroup({});
    private _currenciesFormGroup                : FormGroup = new FormGroup({});
    private _taxesFormGroup                     : FormGroup = new FormGroup({});
    private _mdDialogRef                        : MatDialogRef<any>;

    private _sections                           : Observable<Section[]>;
    private _categories                         : Observable<Category[]>;
    private _subcategories                      : Observable<Subcategory[]>;
    private _currencies                         : Observable<Currency[]>;

    private _itemImagesSub                      : Subscription;
    private _itemImageThumbsSub                 : Subscription;
    private _sectionsSub                        : Subscription;
    private _categorySub                        : Subscription;
    private _subcategorySub                     : Subscription;
    private _garnishFoodSub                     : Subscription;
    private _additionSub                        : Subscription;
    private _currenciesSub                      : Subscription;
    private _countriesSub                       : Subscription;

    public _selectedIndex                       : number = 0;
    private _showGarnishFood                    : boolean = true;
    private _showAddition                       : boolean = true;
    private _garnishFoodQuantity                : number = 0;
    private _showRestaurants                    : boolean = false;
    private _showCurrencies                     : boolean = false;
    private _showTaxes                          : boolean = false;

    private _itemSection                        : string;
    private _itemCategory                       : string;
    private _itemSubcategory                    : string;
    private _selectedCategory                   : string = "";
    private _selectedSection                    : string = "";
    private _selectedSubcategory                : string = "";
    private _selectedTime                       : string;

    private _garnishFoodList                    : GarnishFood[];
    private _itemGarnishFood                    : string[];
    private _restaurantsGarnishFood             : string[];
    private _edition_garnishFood                : string[];
    private _itemAdditions                      : string[];
    private _additionList                       : Addition[];
    private _edition_addition                   : string[];
    private _restaurantList                     : Restaurant[] = [];
    private _itemRestaurants                    : ItemRestaurant[] = [];
    private _restaurantCurrencies               : string[] = [];
    private _restaurantTaxes                    : string[] = [];

    private _editImage                          : boolean = false;
    private _editFilesToUpload                  : Array<File>;
    private _editItemImageToInsert              : File;
    private _nameImageFileEdit                  : string;
    private _itemEditImage                      : string;
    private _restaurantsSelectedCount           : number = 0;
    private titleMsg                            : string;
    private btnAcceptLbl                        : string;

    /**
     * ItemEditionComponent constructor
     * @param {FormBuilder} _formBuilder
     * @param {TranslateService} _translate
     * @param {NgZone} _ngZone
     * @param {MatDialogRef<any>} _dialogRef
     * @param {MatSnackBar} snackBar
     * @param {UserLanguageService} _userLanguageService
     */
    constructor(private _formBuilder: FormBuilder,
        private _translate: TranslateService,
        private _ngZone: NgZone,
        public _dialogRef: MatDialogRef<any>,
        public snackBar: MatSnackBar,
        private _userLanguageService: UserLanguageService,
        protected _mdDialog: MatDialog) {
        _translate.use(this._userLanguageService.getLanguage(Meteor.user()));
        _translate.setDefaultLang('en');
        this._itemGarnishFood = [];
        this._garnishFoodList = [];
        this._editFilesToUpload = [];
        this._restaurantsGarnishFood = [];
        this._edition_garnishFood = [];
        this._itemAdditions = [];
        this._additionList = [];
        this._edition_addition = [];
        this.titleMsg = 'SIGNUP.SYSTEM_MSG';
        this.btnAcceptLbl = 'SIGNUP.ACCEPT';
    }

    /**
     * implements ngOnInit function
     */
    ngOnInit() {
        this.removeSubscriptions();
        let _restaurantsId: string[] = [];
        let _currenciesId: string[] = [];
        this._itemEditionForm = this._formBuilder.group({
            editId: [this._itemToEdit._id],
            editIsActive: [this._itemToEdit.is_active],
            editSectionId: [this._itemToEdit.sectionId],
            editCategoryId: [this._itemToEdit.categoryId],
            editSubcategoryId: [this._itemToEdit.subcategoryId],
            editName: [this._itemToEdit.name],
            editDescription: [this._itemToEdit.description],
            editCookingTime: [this._itemToEdit.time],
            editRestaurants: this._restaurantsFormGroup,
            editCurrencies: this._currenciesFormGroup,
            editTaxes: this._taxesFormGroup,
            editObservations: [this._itemToEdit.observations],
            editImage: [''],
            editGarnishFoodQuantity: [this._itemToEdit.garnishFoodQuantity],
            editGarnishFood: this._garnishFormGroup,
            editAdditions: this._additionsFormGroup,
        });

        this._itemSection = this._itemToEdit.sectionId;
        this._selectedSection = this._itemToEdit.sectionId;
        this._itemCategory = this._itemToEdit.categoryId;
        this._selectedCategory = this._itemToEdit.categoryId;
        this._itemSubcategory = this._itemToEdit.subcategoryId;
        this._selectedSubcategory = this._itemToEdit.subcategoryId;
        this._selectedTime = this._itemToEdit.time;

        this._itemGarnishFood = this._itemToEdit.garnishFood;
        this._itemAdditions = this._itemToEdit.additions;
        this._garnishFoodQuantity = this._itemToEdit.garnishFoodQuantity;
        this._itemRestaurants = this._itemToEdit.restaurants;

        this._restaurantsSelectedCount = this._itemToEdit.restaurants.length;
        if (this._itemToEdit.restaurants.length > 0) { this._showRestaurants = true }

        this._itemImagesSub = MeteorObservable.subscribe('itemImages', this._user).subscribe();
        this._itemImageThumbsSub = MeteorObservable.subscribe('itemImageThumbs', this._user).subscribe(() => {
            this._ngZone.run(() => {
                let _lItemImage: ItemImageThumb = ItemImagesThumbs.findOne({ itemId: this._itemToEdit._id });
                if (_lItemImage) {
                    this._itemEditImage = _lItemImage.url;
                } else {
                    this._itemEditImage = '/images/default-plate.png';
                }
            });
        });
        this._sectionsSub = MeteorObservable.subscribe('sections', this._user).subscribe(() => {
            this._ngZone.run(() => {
                this._sections = Sections.find({ is_active: true }).zone();
            });
        });
        this._categorySub = MeteorObservable.subscribe('categories', this._user).subscribe(() => {
            this._ngZone.run(() => {
                this._categories = Categories.find({ section: this._itemSection }).zone();
            });
        });
        this._subcategorySub = MeteorObservable.subscribe('subcategories', this._user).subscribe(() => {
            this._ngZone.run(() => {
                this._subcategories = Subcategories.find({ category: this._itemCategory }).zone();
            });
        });
        Restaurants.collection.find({}).fetch().forEach((rest) => {
            _restaurantsId.push(rest._id);
            _currenciesId.push(rest.currencyId);
            let find = this._itemRestaurants.filter(r => r.restaurantId === rest._id);

            if (find.length > 0) {
                let control: FormControl = new FormControl(true);
                this._restaurantsFormGroup.addControl(rest._id, control);
                this._restaurantList.push(rest);
            } else {
                let control: FormControl = new FormControl(false);
                this._restaurantsFormGroup.addControl(rest._id, control);
                this._restaurantList.push(rest);
            }
        });
        this._countriesSub = MeteorObservable.subscribe('getCountriesByRestaurantsId', _restaurantsId).subscribe();
        this._currenciesSub = MeteorObservable.subscribe('getCurrenciesByRestaurantsId', _restaurantsId).subscribe(() => {
            this._ngZone.run(() => {
                if (this._itemToEdit.prices.length > 0) {
                    this._showCurrencies = true;
                    this._itemToEdit.prices.forEach((p) => {
                        let control: FormControl = new FormControl(p.price, [Validators.required]);
                        this._currenciesFormGroup.addControl(p.currencyId, control);
                        this._restaurantCurrencies.push(p.currencyId);

                        if (p.itemTax !== undefined) {
                            this._showTaxes = true;
                            let controlTax: FormControl = new FormControl(p.itemTax, [Validators.required]);
                            this._taxesFormGroup.addControl(p.currencyId, controlTax);
                            this._restaurantTaxes.push(p.currencyId);
                        }
                    });
                }
                this._currencies = Currencies.find({ _id: { $in: _currenciesId } }).zone();
            });
        });
        this._garnishFoodSub = MeteorObservable.subscribe('garnishFood', this._user).subscribe(() => {
            this._ngZone.run(() => {
                GarnishFoodCol.collection.find().fetch().forEach((gar) => {
                    let garnishF: GarnishFood = gar;
                    let find = this._itemGarnishFood.filter(g => g == garnishF._id);

                    if (find.length > 0) {
                        let control: FormControl = new FormControl(true);
                        this._garnishFormGroup.addControl(garnishF._id, control);
                        this._garnishFoodList.push(garnishF);
                    } else {
                        let control: FormControl = new FormControl(false);
                        this._garnishFormGroup.addControl(garnishF._id, control);
                        this._garnishFoodList.push(garnishF);
                    }
                });

                if (this._garnishFoodList.length === 0) { this._showGarnishFood = false; }
            });
        });
        this._additionSub = MeteorObservable.subscribe('additions', this._user).subscribe(() => {
            this._ngZone.run(() => {
                Additions.collection.find().fetch().forEach((add) => {
                    let addition: Addition = add;
                    let findAdd = this._itemAdditions.filter(d => d == addition._id);

                    if (findAdd.length > 0) {
                        let control: FormControl = new FormControl(true);
                        this._additionsFormGroup.addControl(addition._id, control);
                        this._additionList.push(addition);
                    } else {
                        let control: FormControl = new FormControl(false);
                        this._additionsFormGroup.addControl(addition._id, control);
                        this._additionList.push(addition);
                    }
                });

                if (this._additionList.length === 0) { this._showAddition = false; }
            });
        });
    }

    /**
     * Remove all subscriptions
     */
    removeSubscriptions():void{
        if( this._itemImagesSub ){ this._itemImagesSub.unsubscribe(); }
        if( this._itemImageThumbsSub ){ this._itemImageThumbsSub.unsubscribe(); }
        if( this._sectionsSub ){ this._sectionsSub.unsubscribe(); }
        if( this._categorySub ){ this._categorySub.unsubscribe(); }
        if( this._subcategorySub ){ this._subcategorySub.unsubscribe(); }
        if( this._garnishFoodSub ){ this._garnishFoodSub.unsubscribe(); }
        if( this._additionSub ) { this._additionSub.unsubscribe(); }
        if( this._currenciesSub ) { this._currenciesSub.unsubscribe(); }
        if( this._countriesSub ) { this._countriesSub.unsubscribe(); }
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
     * This function allow move in wizard tabs
     * @param {number} _index
     */
    canMove(_index: number): boolean {
        switch (_index) {
            case 0:
                return true;
            case 1:
                if (this._itemEditionForm.controls['editSectionId'].valid) {
                    return true;
                } else {
                    return false;
                }
            case 2:
                if (this._itemEditionForm.controls['editName'].valid && this._itemEditionForm.controls['editDescription'].valid
                    && this._itemEditionForm.controls['editCookingTime'].valid && this._restaurantsSelectedCount > 0) {
                    return true
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
        if (this.canMove(this._selectedIndex + 1)) {
            this._selectedIndex++;
        }
    }

    /**
     * This function move to the previous tab
     */
    previous(): void {
        if (this._selectedIndex === 0) {
            return;
        }
        if (this.canMove(this._selectedIndex - 1)) {
            this._selectedIndex--;
        }
    }

    /**
     * This fuction allow wizard to create restaurant
     */
    canFinish(): boolean {
        return this._itemEditionForm.valid;
    }

    /**
     * Function to change Section
     * @param {string} _section
     */
    changeSectionEdit(_section): void {
        let _restaurantSectionsIds: string[] = [];
        this._restaurantList = [];
        this._itemEditionForm.controls['editSectionId'].setValue(_section);

        this._categories = Categories.find({ section: _section, is_active: true }).zone();
        if (this._categories.isEmpty) { this._selectedCategory = ""; }

        let _lSection: Section = Sections.findOne({ _id: _section });

        if (Restaurants.find({ _id: { $in: _lSection.restaurants } }).zone().isEmpty) {
            this._showRestaurants = true;
            Restaurants.collection.find({ _id: { $in: _lSection.restaurants } }).fetch().forEach((r) => {
                if (this._restaurantsFormGroup.contains(r._id)) {
                    this._restaurantsFormGroup.controls[r._id].setValue(false);
                } else {
                    let control: FormControl = new FormControl(false);
                    this._restaurantsFormGroup.addControl(r._id, control);
                }
                _restaurantSectionsIds.push(r._id);
                this._restaurantList.push(r);
            });
        }

        if (!GarnishFoodCol.find({ 'restaurants.restaurantId': { $in: _restaurantSectionsIds } }).zone().isEmpty()) {
            this._showGarnishFood = true;
            GarnishFoodCol.collection.find({ 'restaurants.restaurantId': { $in: _restaurantSectionsIds } }).fetch().forEach((gar) => {
                if (this._garnishFormGroup.contains(gar._id)) {
                    this._garnishFormGroup.controls[gar._id].setValue(false);
                } else {
                    let control: FormControl = new FormControl(false);
                    this._garnishFormGroup.addControl(gar._id, control);
                }
            });
            this._garnishFoodList = GarnishFoodCol.collection.find({ 'restaurants.restaurantId': { $in: _restaurantSectionsIds } }).fetch();
        }

        if (!Additions.find({ 'restaurants.restaurantId': { $in: _restaurantSectionsIds } }).zone().isEmpty()) {
            this._showAddition = true;
            Additions.collection.find({ 'restaurants.restaurantId': { $in: _restaurantSectionsIds } }).fetch().forEach((ad) => {
                if (this._additionsFormGroup.contains(ad._id)) {
                    this._additionsFormGroup.controls[ad._id].setValue(false);
                } else {
                    let control: FormControl = new FormControl(false);
                    this._additionsFormGroup.addControl(ad._id, control);
                }
            });
            this._additionList = Additions.collection.find({ 'restaurants.restaurantId': { $in: _restaurantSectionsIds } }).fetch();
        }
    }

    /**
     * Function to change category
     * @param {string} _category
     */
    changeCategoryEdit(_category) {
        this._itemEditionForm.controls['editCategoryId'].setValue(_category);
        this._subcategories = Subcategories.find({ category: _category, is_active: true }).zone();
        if (this._subcategories.isEmpty) { this._selectedSubcategory = ""; }
    }

    /**
     * Function to change subcategory
     * @param {string} _subcategory
     */
    changeSubcategoryEdit(_subcategory) {
        this._itemEditionForm.controls['editSubcategoryId'].setValue(_subcategory);
    }

    /**
     * When user wants edit item image, this function allow insert the image in the store
     * @param {any} _fileInput
     */
    onChangeEditImage(_fileInput: any): void {
        this._editImage = true;
        this._editFilesToUpload = <Array<File>>_fileInput.target.files;
        this._editItemImageToInsert = this._editFilesToUpload[0];
        this._nameImageFileEdit = this._editItemImageToInsert.name;
    }

    /**
     * Function to edit Item
     */
    editItem(): void {
        if (!Meteor.userId()) {
            var error : string = 'LOGIN_SYSTEM_OPERATIONS_MSG';
            this.openDialog(this.titleMsg, '', error, '', this.btnAcceptLbl, false);
            return;
        }

        if (this._itemEditionForm.valid) {
            let arrCur: any[] = Object.keys(this._itemEditionForm.value.editCurrencies);
            let _lItemRestaurantsToInsert: ItemRestaurant[] = [];
            let _lItemPricesToInsert: ItemPrice[] = [];

            arrCur.forEach((cur) => {
                let find: Restaurant[] = this._restaurantList.filter(r => r.currencyId === cur);
                for (let res of find) {
                    if (this._itemEditionForm.value.editRestaurants[res._id]) {
                        let _lItemRestaurant: ItemRestaurant = { restaurantId: '', price: 0, isAvailable: true };
                        _lItemRestaurant.restaurantId = res._id;
                        _lItemRestaurant.price = this._itemEditionForm.value.editCurrencies[cur];

                        if (this._itemEditionForm.value.editTaxes[cur] !== undefined) {
                            _lItemRestaurant.itemTax = this._itemEditionForm.value.editTaxes[cur];
                        }

                        _lItemRestaurantsToInsert.push(_lItemRestaurant);
                    }
                }
                if (cur !== null && this._itemEditionForm.value.editCurrencies[cur] !== null) {
                    let _lItemPrice: ItemPrice = { currencyId: '', price: 0 };
                    _lItemPrice.currencyId = cur;
                    _lItemPrice.price = this._itemEditionForm.value.editCurrencies[cur];
                    if (this._itemEditionForm.value.editTaxes[cur] !== undefined) {
                        _lItemPrice.itemTax = this._itemEditionForm.value.editTaxes[cur];
                    }
                    _lItemPricesToInsert.push(_lItemPrice);
                }
            });

            let arr: any[] = Object.keys(this._itemEditionForm.value.editGarnishFood);

            arr.forEach((gar) => {
                if (this._itemEditionForm.value.editGarnishFood[gar]) {
                    this._edition_garnishFood.push(gar);
                }
            });

            let arrAdd: any[] = Object.keys(this._itemEditionForm.value.editAdditions);
            arrAdd.forEach((add) => {
                if (this._itemEditionForm.value.editAdditions[add]) {
                    this._edition_addition.push(add);
                }
            });

            Items.update(this._itemEditionForm.value.editId, {
                $set: {
                    modification_user: this._user,
                    modification_date: new Date(),
                    is_active: this._itemEditionForm.value.editIsActive,
                    sectionId: this._itemEditionForm.value.editSectionId,
                    categoryId: this._itemEditionForm.value.editCategoryId,
                    subcategoryId: this._itemEditionForm.value.editSubcategoryId,
                    name: this._itemEditionForm.value.editName,
                    description: this._itemEditionForm.value.editDescription,
                    time: this._itemEditionForm.value.editCookingTime,
                    restaurants: _lItemRestaurantsToInsert,
                    prices: _lItemPricesToInsert,
                    observations: this._itemEditionForm.value.editObservations,
                    garnishFoodQuantity: this._itemEditionForm.value.editGarnishFoodQuantity,
                    garnishFood: this._edition_garnishFood,
                    additions: this._edition_addition,
                    isAvailable: this._itemEditionForm.value.editIsAvailable
                }
            });

            if (this._editImage) {
                let _lItemImage: ItemImage = ItemImages.findOne({ itemId: this._itemEditionForm.value.editId });
                let _lItemImageThumb: ItemImageThumb = ItemImagesThumbs.findOne({ itemId: this._itemEditionForm.value.editId });

                if (_lItemImage && _lItemImageThumb) {
                    ItemImages.remove({ _id: _lItemImage._id });
                    ItemImagesThumbs.remove({ _id: _lItemImageThumb._id });
                }

                uploadItemImage(this._editItemImageToInsert,
                    Meteor.userId(),
                    this._itemEditionForm.value.editId).then((result) => {

                    }).catch((err) => {
                        var error : string = 'Update image error. Only accept .png, .jpg, .jpeg files.';
                        this.openDialog(this.titleMsg, '', error, '', this.btnAcceptLbl, false);
                    });
            }

            let _lMessage: string = this.itemNameTraduction('ITEMS.ITEM_EDITED');
            this.snackBar.open(_lMessage, '', {
                duration: 2500
            });
            this._dialogRef.close();
        }
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
     * This function allow create item price with diferent currencies
     * @param {string} _pRestaurantName 
     * @param {any} _pEvent 
     */
    onCheckRestaurant(_pRestaurantName: string, _pEvent: any): void {
        let _lRestaurant: Restaurant = this._restaurantList.filter(r => r.name === _pRestaurantName)[0];
        if (_pEvent.checked) {
            this._restaurantsSelectedCount++;
            let _lCountry: Country = Countries.findOne({ _id: _lRestaurant.countryId });
            if (this._restaurantCurrencies.indexOf(_lRestaurant.currencyId) <= -1) {
                let _lCurrency: Currency = Currencies.findOne({ _id: _lRestaurant.currencyId });
                let _initValue: string = '';
                if (_lCurrency.decimal !== 0) {
                    for (let i = 0; i < (_lCurrency.decimal).toString().slice((_lCurrency.decimal.toString().indexOf('.')), (_lCurrency.decimal.toString().length)).length - 1; i++) {
                        _initValue += '0';
                    }
                    _initValue = '0.' + _initValue;
                }
                if (this._currenciesFormGroup.contains(_lRestaurant.currencyId)) {
                    this._currenciesFormGroup.controls[_lRestaurant.currencyId].setValue(_initValue);
                } else {
                    let control: FormControl = new FormControl(_initValue, [Validators.required]);
                    this._currenciesFormGroup.addControl(_lRestaurant.currencyId, control);
                }
                this._restaurantCurrencies.push(_lRestaurant.currencyId);

                if (_lCountry.itemsWithDifferentTax === true) {
                    if (this._taxesFormGroup.contains(_lRestaurant.currencyId)) {
                        this._taxesFormGroup.controls[_lRestaurant.currencyId].setValue('0');
                    } else {
                        let control: FormControl = new FormControl('0', [Validators.required]);
                        this._taxesFormGroup.addControl(_lRestaurant.currencyId, control);
                    }
                    this._restaurantTaxes.push(_lRestaurant.currencyId);
                }
            }
        } else {
            this._restaurantsSelectedCount--;
            let _aux: number = 0;
            let _auxTax: number = 0;
            let arr: any[] = Object.keys(this._itemEditionForm.value.editRestaurants);
            arr.forEach((rest) => {
                if (this._itemEditionForm.value.editRestaurants[rest]) {
                    let _lRes: Restaurant = this._restaurantList.filter(r => r.name === rest)[0];
                    if (_lRestaurant.currencyId === _lRes.currencyId) {
                        _aux++;
                    }
                    let _lCountry: Country = Countries.findOne({ _id: _lRes.countryId });
                    if (_lCountry.itemsWithDifferentTax === true) {
                        _auxTax++;
                    }
                }
            });

            if (_aux === 0) { this._restaurantCurrencies.splice(this._restaurantCurrencies.indexOf(_lRestaurant.currencyId), 1); }
            if (_auxTax === 0) { this._restaurantTaxes.splice(this._restaurantTaxes.indexOf(_lRestaurant.currencyId), 1); }
        }
        this._restaurantCurrencies.length > 0 ? this._showCurrencies = true : this._showCurrencies = false;
        this._restaurantTaxes.length > 0 ? this._showTaxes = true : this._showTaxes = false;
    }

    /**
     * Allow mark all garnish food
     * @param {any} _event
     */
    markAllGarnishFood(_event: any): void {
        if (_event.checked) {
            GarnishFoodCol.collection.find({}).fetch().forEach((gar) => {
                if (this._garnishFormGroup.contains(gar._id)) {
                    this._garnishFormGroup.controls[gar._id].setValue(true);
                }
            });
        } else {
            GarnishFoodCol.collection.find({}).fetch().forEach((gar) => {
                if (this._garnishFormGroup.contains(gar._id)) {
                    this._garnishFormGroup.controls[gar._id].setValue(false);
                }
            });
        }
    }

    /**
     * Allow mark all additions
     * @param {any} _event
     */
    markAllAdditions(_event: any): void {
        if (_event.checked) {
            Additions.collection.find({}).fetch().forEach((ad) => {
                if (this._additionsFormGroup.contains(ad._id)) {
                    this._additionsFormGroup.controls[ad._id].setValue(true);
                }
            });
        } else {
            Additions.collection.find({}).fetch().forEach((ad) => {
                if (this._additionsFormGroup.contains(ad._id)) {
                    this._additionsFormGroup.controls[ad._id].setValue(false);
                }
            });
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