import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';
import { MeteorObservable } from 'meteor-rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { UserLanguageService } from '../../../shared/services/user-language.service';
import { Restaurant } from '../../../../both/models/restaurant/restaurant.model';
import { Restaurants } from '../../../../both/collections/restaurant/restaurant.collection';
import { Role } from '../../../../both/models/auth/role.model';
import { Roles } from '../../../../both/collections/auth/role.collection';
import { UserDetail } from '../../../../both/models/auth/user-detail.model';
import { UserDetails } from '../../../../both/collections/auth/user-detail.collection';
import { User } from '../../../../both/models/auth/user.model';
import { Users } from '../../../../both/collections/auth/user.collection';
import { CollaboratorsEditionComponent } from './collaborators-edition/collaborators-edition.component';
import { AlertConfirmComponent } from '../../../web/general/alert-confirm/alert-confirm.component';

@Component({
    selector: 'collaborators',
    templateUrl: './collaborators.component.html',
    styleUrls: [ './collaborators.component.scss' ]
})
export class CollaboratorsComponent implements OnInit, OnDestroy{

    private _user = Meteor.userId();
    private _restaurants            : Observable<Restaurant[]>;
    private _userDetails            : Observable<UserDetail[]>;
    private _users                  : Observable<User[]>;
    private _roles                  : Observable<Role[]>;

    private _restaurantSub          : Subscription;
    private _userDetailsSub         : Subscription;
    private _roleSub                : Subscription;
    private _usersSub               : Subscription;

    //private _form                   : FormGroup;
    public _dialogRef               : MatDialogRef<any>;
    private _mdDialogRef            : MatDialogRef<any>;
    private titleMsg                : string;
    private btnAcceptLbl            : string;
    private _thereAreRestaurants    : boolean = true;

    /**
     * CollaboratorsComponent Constructor
     * @param {Router} _router 
     * @param {TranslateService} _translate 
     * @param {MatDialog} _dialog 
     * @param {UserLanguageService} _userLanguageService 
     * @param {NgZone} _ngZone
     */
    constructor( private _router: Router, 
                 private _translate: TranslateService, 
                 public _dialog: MatDialog,
                 private _userLanguageService: UserLanguageService,
                 protected _mdDialog: MatDialog,
                 private _ngZone: NgZone )
    {
        _translate.use( this._userLanguageService.getLanguage( Meteor.user() ) );
        _translate.setDefaultLang( 'en' );
        this.titleMsg = 'SIGNUP.SYSTEM_MSG';
        this.btnAcceptLbl = 'SIGNUP.ACCEPT';
    } 

    /**
     * ngOnInit Implementation
     */
    ngOnInit() {
        this.removeSubscriptions();
        this._restaurantSub = MeteorObservable.subscribe('restaurants', this._user ).subscribe( () => {
            this._ngZone.run( () => {
                this._restaurants = Restaurants.find({}).zone();
                this.countRestaurants();
                this._restaurants.subscribe( () => { this.countRestaurants(); } );
            });
        });
        this._roleSub = MeteorObservable.subscribe('getRoleCollaborators').subscribe( () => {
            this._ngZone.run( () => {
                this._roles = Roles.find({}).zone();
            });
        });
    }

    /**
     * Validate if restaurants exists
     */
    countRestaurants():void{
        Restaurants.collection.find( { } ).count() > 0 ? this._thereAreRestaurants = true : this._thereAreRestaurants = false;
    }

    /**
     * Remove all subscriptions
     */
    removeSubscriptions():void{
        if( this._restaurantSub ){ this._restaurantSub.unsubscribe(); }
        if( this._roleSub ){ this._roleSub.unsubscribe(); }
        if(this._userDetailsSub){ this._userDetailsSub.unsubscribe(); }
        if(this._usersSub){ this._usersSub.unsubscribe();}
    }

    /**
     * This method allow search collaborators by restaurant id
     */
    collaboratorsSearch( _pRestaurantId: string ){
        this._userDetailsSub = MeteorObservable.subscribe('getUsersDetailsForRestaurant', _pRestaurantId ).subscribe(() => {
            this._userDetails = UserDetails.find({restaurant_work : _pRestaurantId}).zone();
        });
        
        this._usersSub = MeteorObservable.subscribe( 'getUsersByRestaurant' , _pRestaurantId ).subscribe( () => {
            this._users = Users.find({}).zone();
        });
    }

    /**
     * Collaboratos edition
     * @param _userdetail 
     */
    editCollaborator( _userdetail : UserDetail, _user : User ){
        this._dialogRef = this._dialog.open( CollaboratorsEditionComponent, {
            disableClose : true,
            width: '75%'
        });
        this._dialogRef.componentInstance.selectUserDetail = _userdetail;
        this._dialogRef.componentInstance.selectUser       = _user;
        this._dialogRef.afterClosed().subscribe( result => {
            this._dialogRef = null;
        });
    }

    /**
     * Change user state
     * @param {string} _pUserDetailId
     */
    changeUserState( _pUserDetail: UserDetail ):void{
        UserDetails.update( { _id: _pUserDetail._id }, { $set: { is_active: !_pUserDetail.is_active } } );
    }
    
    /**
     * Open Collaborator register component
     */
    openCollaboratorstRegister(){
        this._router.navigate(['app/collaborators-register']);
    }

    /**
     * Go to add new Restaurant
     */
    goToAddRestaurant(){
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
     * This function allow translate
     * @param itemName 
     */
    itemNameTraduction(itemName: string): string {
        var wordTraduced: string;
        this._translate.get(itemName).subscribe((res: string) => {
            wordTraduced = res;
        });
        return wordTraduced;
    }

    /**
     * ngOnDestroy implementation
     */
    ngOnDestroy(){
        this.removeSubscriptions();
    }
}