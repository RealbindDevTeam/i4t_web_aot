import { Meteor } from 'meteor/meteor';
import { GarnishFoodCol } from '../../../both/collections/administration/garnish-food.collection';
import { Items } from '../../../both/collections/administration/item.collection';
import { UserDetails } from '../../../both/collections/auth/user-detail.collection';
import { UserDetail } from '../../../both/models/auth/user-detail.model';
import { check } from 'meteor/check';

/**
 * Meteor publication garnishFood with creation user condition
 * @param {String} _userId
 */
Meteor.publish('garnishFood', function (_userId: string) {
    check(_userId, String);
    return GarnishFoodCol.collection.find({ creation_user: _userId });
});

/**
 * Meteor publication return garnish food with restaurant condition
 * @param {string} _restaurantId
 */
Meteor.publish('garnishFoodByRestaurant', function (_restaurantId: string) {
    check(_restaurantId, String);
    return GarnishFoodCol.collection.find({ 'restaurants.restaurantId': { $in: [_restaurantId] }, is_active: true });
});

/**
 * Meteor publication return garnish food with _id
 * @param {string} _pId
 */
Meteor.publish('garnishFoodById', function ( _pId: string) {
    check(_pId, String);
    return GarnishFoodCol.collection.find({ _id : _pId });
});

/**
 * Meteor publication return garnish food by itemId  condition
 * @param {string}
 */
Meteor.publish('garnishesByItem', function (_itemId: string) {
    check(_itemId, String);
    var item = Items.collection.findOne({ _id: _itemId, garnishFoodIsAcceped: true });
    if( item ){
        return GarnishFoodCol.collection.find({ _id: { $in: item.garnishFood } });
    } else {
        return;
    }
});

/**
 * Meteor publication garnish food by restaurant work
 * @param {string} _userId
 */
Meteor.publish('garnishFoodByRestaurantWork', function (_userId: string) {
    check(_userId, String);
    let _lUserDetail: UserDetail = UserDetails.findOne({ user_id: _userId });
    if( _lUserDetail ){
        return GarnishFoodCol.collection.find({ 'restaurants.restaurantId': { $in: [_lUserDetail.restaurant_work] }, is_active: true });
    } else {
        return;
    }
});