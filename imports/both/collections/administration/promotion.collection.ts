import { MongoObservable } from 'meteor-rxjs';
import { Promotion, PromotionImage, PromotionImageThumb } from '../../models/administration/promotion.model';

/**
 * Function to validate if user exists
 */
function loggedIn(){
    return !!Meteor.user();
}

/**
 * Promotion Collection
 */
export const Promotions = new MongoObservable.Collection<Promotion>('promotions');

/**
 * Allow Promotion collection insert and update functions
 */
Promotions.allow({
    insert: loggedIn,
    update: loggedIn
});

/**
 * Promotion Image Thumbs Collection
 */
export const PromotionImagesThumbs = new MongoObservable.Collection<PromotionImageThumb>('promotionImageThumbs');

/**
 * Allow Promotion Image Thumbs Collection insert, update and remove functions
 */
PromotionImagesThumbs.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
});

/**
 * Promotion Images Collection
 */
export const PromotionImages = new MongoObservable.Collection<PromotionImage>('promotionImages');

/**
 * Allow Promotion Images Collection insert, update and remove functions
 */
PromotionImages.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
});
