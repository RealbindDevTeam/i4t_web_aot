import { MongoObservable } from 'meteor-rxjs';
import { Category } from '../../models/administration/category.model';

/**
 * Function to validate if user exists
 */
function loggedIn(){
    return !!Meteor.user();
}

/**
 * Categories Collection
 */
export const Categories = new MongoObservable.Collection<Category>('categories');

/**
 * Allow Category collection insert and update functions
 */
Categories.allow({
    insert: loggedIn,
    update: loggedIn
});