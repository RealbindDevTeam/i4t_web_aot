import { Meteor } from 'meteor/meteor';
import { Promotions, PromotionImages, PromotionImagesThumbs } from '../../../both/collections/administration/promotion.collection';
import { check } from 'meteor/check';

/**
 * Meteor publication promotions with creation user condition
 * @param {string} _userId
 */
Meteor.publish( 'promotions', function( _userId:string ){
    check( _userId, String );
    return Promotions.collection.find( { creation_user: _userId } );
});

/**
 * Meteor publication promotionImages with user Id condition
 * @param {string} _userId
 */
Meteor.publish('promotionImages', function(_userId:string){
    check(_userId,String);
    return PromotionImages.collection.find( { userId: _userId } );
});

/**
 * Meteor publication promotionImageThumbs with user Id condition
 * @param {string} _userId
 */
Meteor.publish( 'promotionImageThumbs', function( _userId:string ){
    return PromotionImagesThumbs.collection.find( { userId: _userId } );
});