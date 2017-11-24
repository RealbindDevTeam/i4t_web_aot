import { Meteor } from 'meteor/meteor';
import { Users, UserImages } from '../../../both/collections/auth/user.collection';
import { UserDetails } from '../../../both/collections/auth/user-detail.collection';
import { Restaurants } from '../../../both/collections/restaurant/restaurant.collection';
import { check } from 'meteor/check';

/*Meteor.publish('getUserProfile', function () {
    return Users.find({_id: this.userId});
});*/

Meteor.publish('getUserSettings', function () {
    return Users.find({ _id: this.userId }, { fields: { username: 1, "services.profile.name": 1, "services.facebook": 1, "services.twitter": 1, "services.google": 1 } });
});

/**
 * Meteor publish, get all users
 */
Meteor.publish('getUsers', function () {
    return Users.find({});
});

/**
 * Meteor publish. Get user by Id
 */
Meteor.publish('getUserByUserId', function ( _usrId : string ) {
    return Users.find({ _id : _usrId });
});

/**
 * Meteor publication return users with restaurant and table Id conditions
 * @param {string} _pRestaurantId
 * @param {string} _pTableId
 */
Meteor.publish( 'getUserByTableId', function( _pRestaurantId: string, _pTableId ){
    check( _pRestaurantId, String );
    check( _pTableId, String );
    let _lUsers: string[] = [];
    UserDetails.find( { current_restaurant: _pRestaurantId, current_table: _pTableId } ).fetch().forEach( (user) => {
        _lUsers.push( user.user_id );
    });
    return Users.find( { _id: { $in: _lUsers } } );
});

/**
 * Meteor publication return user image
 */
Meteor.publish( 'getUserImages', function( _pUserId: string ){
    check( _pUserId, String );
    return UserImages.find( { userId: _pUserId });
});

/**
 * Meteor publication return users by admin user Id
 */
Meteor.publish( 'getUsersByAdminUser', function( _pUserId: string ){
    check( _pUserId, String );
    let _lRestaurantsId:string[] = [];
    let _lUsers:string[] = [];
    Restaurants.collection.find( { creation_user: _pUserId } ).fetch().forEach( ( restaurant ) => {
        _lRestaurantsId.push( restaurant._id );
    });
    UserDetails.collection.find( { current_restaurant: { $in: _lRestaurantsId } } ).fetch().forEach( ( userDetail ) => {
        _lUsers.push( userDetail.user_id );
    });
    return Users.find( { _id: { $in: _lUsers } } );
});

/**
 * Meteor publication return users image by admin user id
 */
Meteor.publish( 'getUserImagesByAdminUser', function( _pUserId: string ) {
    let _lRestaurantsId:string[] = [];
    let _lUsers:string[] = [];
    Restaurants.collection.find( { creation_user: _pUserId } ).fetch().forEach( ( restaurant ) => {
        _lRestaurantsId.push( restaurant._id );
    });
    UserDetails.collection.find( { current_restaurant: { $in: _lRestaurantsId } } ).fetch().forEach( ( userDetail ) => {
        _lUsers.push( userDetail.user_id );
    });
    return UserImages.find( { userId: { $in: _lUsers } });
});

/**
 * Meteor publication return users images with restaurant and table Id conditions
 * @param {string} _pRestaurantId
 * @param {string} _pTableId
 */
Meteor.publish( 'getUserImagesByTableId', function( _pRestaurantId: string, _pTableId ){
    check( _pRestaurantId, String );
    check( _pTableId, String );
    let _lUsers: string[] = [];
    UserDetails.find( { current_restaurant: _pRestaurantId, current_table: _pTableId } ).fetch().forEach( (user) => {
        _lUsers.push( user.user_id );
    });
    return UserImages.find( { userId: { $in: _lUsers } });
});