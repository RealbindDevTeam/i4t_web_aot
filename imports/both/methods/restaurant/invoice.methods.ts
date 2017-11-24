import { Meteor } from 'meteor/meteor';
import { Invoice, InvoiceItem, InvoiceAddition, InvoiceLegalInformation } from '../../models/restaurant/invoice.model';
import { Invoices } from '../../collections/restaurant/invoice.collection';
import { Restaurants, RestaurantsLegality } from '../../collections/restaurant/restaurant.collection';
import { Tables } from '../../collections/restaurant/table.collection';
import { Orders } from '../../collections/restaurant/order.collection';
import { Items } from '../../collections/administration/item.collection';
import { GarnishFoodCol } from '../../collections/administration/garnish-food.collection';
import { Additions } from '../../collections/administration/addition.collection';
import { Currencies } from "../../collections/general/currency.collection";
import { PaymentMethods } from "../../collections/general/paymentMethod.collection";

if (Meteor.isServer) {
    Meteor.methods({
        /**
         * This function allow Invoice generate
         * @param { string } _restaurantId
         */
        invoiceGenerating : function( _pPay : any ) {
            let lRestaurant = Restaurants.findOne({_id : _pPay.restaurantId});
            let lTable      = Tables.findOne({_id : _pPay.tableId});
            let lCurrency   = Currencies.findOne({_id : lRestaurant.currencyId});
            let lPayMethod  = PaymentMethods.findOne({_id : _pPay.paymentMethodId});
            let lRestaurantLegality = RestaurantsLegality.findOne({restaurant_id: lRestaurant._id });

            let lInvoiceItems               : InvoiceItem[] = [];
            let lInvoiceAdditions           : InvoiceAddition[] = [];
            let lInvoiceLegalInformation    : InvoiceLegalInformation = {};
            
            _pPay.orders.forEach((order)=> {
                let lOrder = Orders.findOne({_id : order});
                
                lOrder.items.forEach((item)=> {
                    let lItem = Items.findOne({_id : item.itemId});
                    let lGarnishFood : any[] = [];
                    let lAdditions   : any[] = [];
                    
                    if(item.garnishFood.length > 0){
                        item.garnishFood.forEach((gf)=>{
                            let lgf = GarnishFoodCol.findOne({_id : gf});
                            lGarnishFood.push({ garnish_food_name : lgf.name, 
                                                price : lgf.restaurants.filter( g => g.restaurantId === _pPay.restaurantId )[0].price });
                        });
                    }
                    if(item.additions.length > 0){
                        item.additions.forEach((ad) => {
                            let lad = Additions.findOne({_id: ad});
                            lAdditions.push({ addition_name : lad.name,
                                              price : lad.restaurants.filter( a => a.restaurantId === _pPay.restaurantId)[0].price});
                        });
                    }
                    let lInvoiceItem : InvoiceItem = {
                        item_name    : lItem.name,
                        quantity     : item.quantity,
                        garnish_food : lGarnishFood,
                        additions    : lAdditions,
                        price        : lItem.restaurants.filter( i => i.restaurantId === _pPay.restaurantId)[0].price,
                    }
                    lInvoiceItems.push(lInvoiceItem);
                });

                lOrder.additions.forEach((addition) => {
                    let lAddition = Additions.findOne({_id : addition.additionId});
                    let lAddAddition : InvoiceAddition = {
                        addition_name : lAddition.name,
                        quantity      : addition.quantity,
                        price         : lAddition.restaurants.filter( a => a.restaurantId === _pPay.restaurantId)[0].price,
                    }
                    lInvoiceAdditions.push(lAddAddition);
                });
            });

            // Colombia Invoice
            if( lRestaurant.countryId === '1900' ){
                lInvoiceLegalInformation.regime = lRestaurantLegality.regime;
                lInvoiceLegalInformation.forced_to_invoice = lRestaurantLegality.forced_to_invoice;
                lInvoiceLegalInformation.forced_to_inc = lRestaurantLegality.forced_to_inc;
                if( lInvoiceLegalInformation.regime === 'regime_co' ){
                    lInvoiceLegalInformation.business_name = lRestaurantLegality.business_name;
                    lInvoiceLegalInformation.document = lRestaurantLegality.document;
                    lInvoiceLegalInformation.invoice_resolution = lRestaurantLegality.invoice_resolution;
                    lInvoiceLegalInformation.invoice_resolution_date = lRestaurantLegality.invoice_resolution_date;
                    lInvoiceLegalInformation.prefix = lRestaurantLegality.prefix;
                    if( lInvoiceLegalInformation.prefix ){
                        lInvoiceLegalInformation.prefix_name = lRestaurantLegality.prefix_name;
                    }
                    lInvoiceLegalInformation.numeration_from = lRestaurantLegality.numeration_from;
                    lInvoiceLegalInformation.numeration_to = lRestaurantLegality.numeration_to;
                    lInvoiceLegalInformation.is_big_contributor = lRestaurantLegality.is_big_contributor;
                    if( lInvoiceLegalInformation.is_big_contributor ){
                        lInvoiceLegalInformation.big_contributor_resolution = lRestaurantLegality.big_contributor_resolution;
                        lInvoiceLegalInformation.big_contributor_date = lRestaurantLegality.big_contributor_date;
                    }
                    lInvoiceLegalInformation.is_self_accepting = lRestaurantLegality.is_self_accepting;
                    if( lInvoiceLegalInformation.is_self_accepting ){
                        lInvoiceLegalInformation.self_accepting_resolution = lRestaurantLegality.self_accepting_resolution;
                        lInvoiceLegalInformation.self_accepting_date = lRestaurantLegality.self_accepting_date;
                    }
                    lInvoiceLegalInformation.text_at_the_end = lRestaurantLegality.text_at_the_end;
                } else if( lInvoiceLegalInformation.regime === 'regime_si' ){
                    if( lInvoiceLegalInformation.forced_to_invoice ){
                        lInvoiceLegalInformation.business_name = lRestaurantLegality.business_name;
                        lInvoiceLegalInformation.document = lRestaurantLegality.document;
                        lInvoiceLegalInformation.invoice_resolution = lRestaurantLegality.invoice_resolution;
                        lInvoiceLegalInformation.invoice_resolution_date = lRestaurantLegality.invoice_resolution_date;
                        lInvoiceLegalInformation.prefix = lRestaurantLegality.prefix;
                        if( lInvoiceLegalInformation.prefix ){
                            lInvoiceLegalInformation.prefix_name = lRestaurantLegality.prefix_name;
                        }
                        lInvoiceLegalInformation.numeration_from = lRestaurantLegality.numeration_from;
                        lInvoiceLegalInformation.numeration_to = lRestaurantLegality.numeration_to;
                        lInvoiceLegalInformation.text_at_the_end = lRestaurantLegality.text_at_the_end;
                    }
                }   
            }

            Invoices.insert({
                creation_user         : Meteor.userId(),
                creation_date         : new Date(),
                restaurant_id         : _pPay.restaurantId,
                payment_id            : _pPay._id,
                restaurant_name       : lRestaurant.name,
                restaurant_address    : lRestaurant.address,
                restaurant_phone      : lRestaurant.phone,
                country_id            : lRestaurant.countryId,
                table_number          : lTable._number,
                total_pay             : _pPay.totalToPayment,
                total_order           : _pPay.totalOrdersPrice,
                total_tip             : _pPay.totalTip,
                customer_id           : _pPay.userId,
                currency              : lCurrency.code,
                pay_method            : lPayMethod.name,
                items                 : lInvoiceItems,
                additions             : lInvoiceAdditions,
                legal_information     : lInvoiceLegalInformation
            });
        }
    });
}