import { MongoObservable } from 'meteor-rxjs';
import { Item, ItemImage, ItemImageThumb } from '../../models/administration/item.model';

/**
 * Function to validate if user exists
 */
function loggedIn(){
    return !!Meteor.user();
}

/**
 * Items Collection
 */
export const Items = new MongoObservable.Collection<Item>('items');

/**
 * Allow Items collection insert and update functions
 */
Items.allow({
    insert: loggedIn,
    update: loggedIn
});

/**
 * Item Image Thumbs Collection
 */
export const ItemImagesThumbs = new MongoObservable.Collection<ItemImageThumb>('itemImageThumbs');

/**
 * Allow Item Image Thumbs Collection insert, update and remove functions
 */
ItemImagesThumbs.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
});

/**
 * Item Images Collection
 */
export const ItemImages = new MongoObservable.Collection<ItemImage>('itemImages');

/**
 * Allow Item Images collection insert, update and remove functions
 */
ItemImages.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn
});