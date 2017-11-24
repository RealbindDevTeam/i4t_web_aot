import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../collections/restaurant/account.collection';
import { Orders } from '../../collections/restaurant/order.collection';
import { Payments } from '../../collections/restaurant/payment.collection';
import { Tables } from '../../collections/restaurant/table.collection';
import { UserDetails } from "../../collections/auth/user-detail.collection";
import { WaiterCallDetail } from '../../models/restaurant/waiter-call-detail.model';

if(Meteor.isServer){
    Meteor.methods({
        /**
         * This method allow to payment of the account according to the restaurant and table
         * @param { string } _restaurantId
         * @param { string } _tableId
         */
        closePay : function (_restaurantId : string , _tableId : string, _call : WaiterCallDetail) {
            
            let _paymentsToPay       : any;
            let _paymentsNotReceived : number = 0;
            let _countOrders         : number = 0;

            _paymentsToPay = Payments.collection.find( { restaurantId: _restaurantId, tableId: _tableId, status: 'PAYMENT.NO_PAID', received : true } );
            _paymentsNotReceived = Payments.collection.find( { restaurantId: _restaurantId, tableId: _tableId, status: 'PAYMENT.NO_PAID', received : false } ).count();

            _paymentsToPay.fetch().forEach((pay)=>{
                pay.orders.forEach((order)=> {
                    Orders.update({_id : order}, { $set : { status : 'ORDER_STATUS.CLOSED' }});
                });
                Payments.update({_id : pay._id },{ $set : { status : 'PAYMENT.PAID' }});
                let orderOwner = Orders.collection.find({creation_user : pay.creation_user, status : 
                    { $in : ['ORDER_STATUS.REGISTERED','ORDER_STATUS.IN_PROCESS','ORDER_STATUS.PREPARED','ORDER_STATUS.DELIVERED','ORDER_STATUS.PENDING_CONFIRM']}}).count();
                if(orderOwner===0){
                    UserDetails.update({ user_id : pay.creation_user },{ $set : { current_restaurant : '', current_table : '' }});
                    let currentTable = Tables.findOne({_id: _tableId});
                    Tables.update({ _id :  _tableId }, { $set : { amount_people : (currentTable.amount_people - 1) }});
                }
                
                let accountTable = Accounts.collection.findOne({tableId : _tableId, status : 'OPEN'});
                Accounts.update({ _id : accountTable._id }, { $set : { total_payment : (accountTable.total_payment - pay.totalOrdersPrice) } });

                //Invoice generate
                Meteor.call('invoiceGenerating', pay);
            });
            
            _countOrders = Orders.collection.find({ restaurantId: _restaurantId, tableId: _tableId, status: 
                { $in : ['ORDER_STATUS.REGISTERED','ORDER_STATUS.IN_PROCESS','ORDER_STATUS.PREPARED','ORDER_STATUS.DELIVERED','ORDER_STATUS.PENDING_CONFIRM'] }  }).count();
            
            let accountTable = Accounts.collection.findOne({tableId : _tableId, status : 'OPEN'});
            if ( _countOrders === 0 && accountTable.total_payment===0 ) {
                Accounts.update({ _id : accountTable._id }, { $set : { status : 'CLOSED' } });
                Tables.update({ _id :  _tableId }, { $set : { status : 'FREE', amount_people : 0 }});
            }

            if(_paymentsNotReceived === 0){
                Meteor.call('closeCall', _call, Meteor.userId());
            }
        }
    });
}