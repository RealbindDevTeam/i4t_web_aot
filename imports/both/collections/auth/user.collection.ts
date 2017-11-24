import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { UserProfileImage } from '../../models/auth/user-profile.model';

/**
 * Function to validate if user exists
 */
function loggedIn(){
    return !!Meteor.user();
}

/**
 * Users Collection
 */
export const Users = MongoObservable.fromExisting(Meteor.users);

/**
 * Allow Users collection update functions
 */
Users.allow({
    update: loggedIn
});

/**
 * User Images Collection
 */
export const UserImages = new MongoObservable.Collection<UserProfileImage>('userImages');

/**
 * Allow User Images collection insert, update and remove functions
 */
UserImages.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
});