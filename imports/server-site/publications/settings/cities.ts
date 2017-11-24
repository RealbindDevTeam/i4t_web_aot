import { Meteor } from 'meteor/meteor';
import { Cities } from '../../../both/collections/settings/city.collection';
import { Restaurants } from '../../../both/collections/restaurant/restaurant.collection';
import { check } from 'meteor/check';

/**
 * Meteor publication cities
 */
Meteor.publish('cities', () => Cities.find({ is_active: true }));

/**
 * City by restaurant
 */
Meteor.publish('getCityByRestaurantId', function (_restaurantId: string) {
    check(_restaurantId, String);
    let restaurant = Restaurants.collection.findOne({ _id: _restaurantId });
    if (restaurant) {
        return Cities.collection.find({ _id: restaurant.cityId });
    } else {
        return Cities.find({ is_active: true });
    }
});


/**
 * Meteor publications cities by country
 */
Meteor.publish('citiesByCountry', function (_countryId: string) {
    check(_countryId, String);
    return Cities.collection.find({ country: _countryId, is_active: true });
});