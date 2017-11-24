import { Meteor } from 'meteor/meteor';
import { UserLogin } from '../../models/auth/user-login.model';
import { UsersLogin } from '../../collections/auth/user-login.collection';

if(Meteor.isServer){
    Meteor.methods({
        insertUserLoginInfo: function( _pUserLogin: UserLogin ){
            UsersLogin.insert( _pUserLogin );
        }
    });
}