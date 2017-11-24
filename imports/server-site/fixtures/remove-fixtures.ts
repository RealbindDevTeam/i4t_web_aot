import { Menus } from '../../both/collections/auth/menu.collection';
import { Roles } from '../../both/collections/auth/role.collection';
import { Hours } from '../../both/collections/general/hours.collection';
import { Currencies } from '../../both/collections/general/currency.collection';
import { PaymentMethods } from '../../both/collections/general/paymentMethod.collection';
import { Countries } from '../../both/collections/settings/country.collection';
import { Cities } from '../../both/collections/settings/city.collection';
import { Languages } from '../../both/collections/settings/language.collection';
import { EmailContents } from '../../both/collections/general/email-content.collection';
import { Parameters } from '../../both/collections/general/parameter.collection';
import { CcPaymentMethods } from '../../both/collections/payment/cc-payment-methods.collection'

export function removeFixtures(){
    /**
     * Remove Menus Collection
     */
    Menus.remove( { } );
    
    /**
     * Remove Roles Collection
     */
    Roles.remove( { } );
    
    /**
     * Remove Hours Collection
     */
    Hours.remove( { } );
    
    /**
     * Remove Currencies Collection
     */
    Currencies.remove( { } );
    
    /**
     * Remove PaymentMethods Collection
     */
    PaymentMethods.remove( { } );
    
    /**
     * Remove Countries Collection
     */
    Countries.remove( { } );
    
    /**
     * Remove Cities Collection
     */
    Cities.remove( { } );
    
    /**
     * Remove Languages Collection
     */
    Languages.remove( { } );
    
    /**
     * Remove EmailContents Collection
     */
    EmailContents.remove( { } );
    
    /**
     * Remove Parameters Collection
     */
    Parameters.remove( { } );
    
    /**
     * Remove CcPaymentMethods Collection
     */
    CcPaymentMethods.remove( { } );
}