import { Meteor } from 'meteor/meteor';
import { WaiterCallDetails } from '../../../both/collections/restaurant/waiter-call-detail.collection';

/**
 * Meteor publication waiter call details. userId
 * @param { string } _userId
 */
Meteor.publish('countWaiterCallDetailByUsrId', function ( _userId : string ) {
  return WaiterCallDetails.collection.find({ user_id: _userId, status : { $in : ["waiting", "completed"] } });
});

/**
 * Meteor publication waiter call details, for to payment.
 * @param { string } _restaurantId
 * @param { string } _tableId
 * @param { string } _type
 * @param { string[] } _status
 */
Meteor.publish('WaiterCallDetailForPayment', function ( _restaurantId : string, 
                                                        _tableId      : string,
                                                        _type         : string ) {
  return WaiterCallDetails.collection.find({ restaurant_id : _restaurantId, 
                                             table_id : _tableId, 
                                             type : _type,
                                             status : { $in : ['waiting', 'completed'] }});
});

/**
 * Meteor publication waiter call details. userId (Waiter id)
 * @param { string } _waiterId
 */
Meteor.publish('waiterCallDetailByWaiterId', function ( _waiterId : string ) {
  return WaiterCallDetails.collection.find({ waiter_id: _waiterId, status : "completed" });
});