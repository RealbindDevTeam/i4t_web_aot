import { Component, Input, OnInit, OnDestroy, QueryList, ViewChildren, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable, Subscription } from 'rxjs';
import { MenuItem } from '../menu-item';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { NavigationService } from '../navigation.service';
import { Users, UserImages } from '../../../../both/collections/auth/user.collection';
import { User } from '../../../../both/models/auth/user.model';
import { UserProfileImage } from '../../../../both/models/auth/user-profile.model';

@Component({
  selector : 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: [ './sidenav.component.scss' ],
})
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChildren(SidenavItemComponent) children: QueryList<SidenavItemComponent>;
  @Input() isHovering: boolean = false;

  private _subscriptions    : Subscription[] = [];
  private _userImageSub     : Subscription;
  private _userSubscription : Subscription;
  private _this             : SidenavComponent = this;
  private menuItems         : MenuItem[] = [];

  private _user         : User;//Meteor.User;
  private sidenavStyle  : string;
  private _userName     : string;
  private showSidenav   : boolean = false;
  private _initialLoad  : boolean = true;
  private _screenWidth  : number = NavigationService.largeViewportWidth;

  constructor(private _navigation: NavigationService, private _router: Router, private _ngZone: NgZone) {
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      if( sub ){ sub.unsubscribe(); }
    })
  }

  ngOnInit() {
    this._subscriptions.push(this._navigation.sidenavOpened.subscribe(opened => {
      if(this._navigation.largeScreen) {
        if(opened) {
          this._navigation.openSidenavStyle.take(1).subscribe(style => {
            this.sidenavStyle = style;
          });
        } else {
          this._navigation.closedSidenavStyle.take(1).subscribe(style => {
            this.sidenavStyle = style;
          });
        }
      } else {
        this.sidenavStyle = 'over';
      }
    }));
    this._navigation.menuItems.subscribe(menuItems => {
      this.menuItems = menuItems;
    });

    this._userSubscription = MeteorObservable.subscribe('getUserSettings').subscribe(() => {
      this._ngZone.run(() => {
        this._user = Users.collection.findOne({ _id: Meteor.userId() });
        if (this._user.username) {
          this._userName = this._user.username;
        }
        else if (this._user.profile.name) {
          this._userName = this._user.profile.name;
        }
        this._userImageSub = MeteorObservable.subscribe('getUserImages', Meteor.userId()).subscribe();
      });
    });
    
  }

  /**
   * Return user image
   */
  getUsetImage(): string {
    if (this._user && this._user.services.facebook) {
      return "http://graph.facebook.com/" + this._user.services.facebook.id + "/picture/?type=large";
    } else {
      let _lUserImage: UserProfileImage = UserImages.findOne({ userId: Meteor.userId() });
      if (_lUserImage) {
        return _lUserImage.url;
      }
      else {
        return '/images/user_default_image.png';
      }
    }
  }

  /*get height(): number {
    let addedHeight = 0;
    if(this.children) {
      this.children.forEach(childComponent => {
        if(childComponent.active) {
          addedHeight += childComponent.height;
        }
      });
    }
    return (this.menuItems.length * 48) + addedHeight;
  }*/

  toggle(active: boolean, child: SidenavItemComponent) {
    if(this.children) {
      this.children.forEach(childComponent => {
        if(child !== childComponent) {
          childComponent.toggle(false, undefined, true);
        }
      });
    }
  }

  signOut() {
    Meteor.logout();
    this._router.navigate(['signin']);
  }

}
