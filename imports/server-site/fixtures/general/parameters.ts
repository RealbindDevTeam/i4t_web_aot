import { Parameter } from '../../../both/models/general/parameter.model';
import { Parameters } from '../../../both/collections/general/parameter.collection';

export function loadParameters() {
    if (Parameters.find().cursor.count() === 0) {
        const parameters: Parameter[] = [
            { _id: '100', name: 'start_payment_day', value: '1', description: 'initial day of month to validate client payment' },
            { _id: '200', name: 'end_payment_day', value: '5', description: 'final day of month to validate client payment' },
            { _id: '300', name: 'from_email', value: 'Iurest <no-reply@iurest.com>', description: 'default from account email to send messages' },
            { _id: '400', name: 'first_pay_discount', value: '50', description: 'discount in percent to service first pay' },
            { _id: '500', name: 'colombia_tax_iva', value: '19', description: 'Colombia tax iva to monthly iurest payment' },
            { _id: '600', name: 'payu_script_p_tag', value: 'url(https://maf.pagosonline.net/ws/fp?id=', description: 'url for security script for payu form in <p> tag' },
            { _id: '700', name: 'payu_script_img_tag', value: 'https://maf.pagosonline.net/ws/fp/clear.png?id=', description: 'url for security script for payu form in <img> tag' },
            { _id: '800', name: 'payu_script_script_tag', value: 'https://maf.pagosonline.net/ws/fp/check.js?id=', description: 'url for security script for payu form in <script> tag' },
            { _id: '900', name: 'payu_script_object_tag', value: 'https://maf.pagosonline.net/ws/fp/fp.swf?id=', description: 'url for security script for payu form in <object> tag' },
            { _id: '1000', name: 'payu_payments_url', value: 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi', description: 'url for connect payu payments API' },
            { _id: '2000', name: 'payu_reports_url', value: 'https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi', description: 'url for connect payu reports API' },
            { _id: '3000', name: 'ip_public_service_url', value: 'https://api.ipify.org?format=json', description: 'url for retrieve the client public ip' },
            { _id: '4000', name: 'payu_pay_info_url', value: 'http://192.168.0.3:9000/api/getCusPayInfo', description: 'url for retrieve credentials for payu payment' },
            { _id: '1100', name: 'company_name', value: 'Realbind S.A.S', description: 'Realbind company name for invoice' },
            { _id: '1150', name: 'company_phone', value: 'Tel: (57 1) 6959537', description: 'Realbind phone' },
            { _id: '1200', name: 'company_address', value: 'Cra 6 # 58-43 Of 201', description: 'Realbind company address' },
            { _id: '1300', name: 'company_country', value: 'Colombia', description: 'Realbind country location' },
            { _id: '1400', name: 'company_city', value: 'Bogotá', description: 'Realbind city location' },
            { _id: '1500', name: 'company_nit', value: 'NIT: 901.036.585-0', description: 'Realbind NIT' },
            { _id: '1510', name: 'company_regime', value: 'Régimen común', description: 'Realbind regime in Colombia' },
            { _id: '1520', name: 'company_contribution', value: 'No somos grandes contribuyentes', description: 'Realbind contribution in Colombia' },
            { _id: '1530', name: 'company_retainer', value: 'No somos autoretenedores por ventas ni servicios', description: 'Realbind retention in Colombia' },
            { _id: '1540', name: 'company_agent_retainer', value: 'No somos agentes retenedores de IVA e ICA', description: 'Realbind iva and ica agent retention in Colombia' },
            { _id: '1550', name: 'invoice_generated_msg', value: 'Factura emitida por computador', description: 'Invoice message for invoice' },
            { _id: '1600', name: 'iurest_url', value: 'https://www.iurest.com', description: 'iurest url page' },
            { _id: '1700', name: 'facebook_link', value: 'https://www.facebook.com', description: 'facebook link for iurest' },
            { _id: '1800', name: 'twitter_link', value: 'https://www.twitter.com', description: 'twitter link for iurest' },
            { _id: '1900', name: 'instagram_link', value: 'https://www.instagram.com', description: 'instagram link for iurest' },
            { _id: '1610', name: 'iurest_img_url', value: 'https://www.iurest.com/images/', description: 'iurest images url' },
            { _id: '3100', name: 'ip_public_service_url2', value: 'https://ipinfo.io/json', description: 'url for retrieve the client public ip #2' },
            { _id: '3200', name: 'ip_public_service_url3', value: 'https://ifconfig.co/json', description: 'url for retrieve the client public ip #3' },
            { _id: '9000', name: 'payu_is_prod', value: 'false', description: 'Flag to enable to prod payu payment' },
            { _id: '9100', name: 'payu_test_state', value: 'APPROVED', description: 'Test state for payu payment transaction' },
            { _id: '9200', name: 'payu_reference_code', value: 'M0NP_', description: 'Prefix for reference code on payu transactions' },
            { _id: '2100', name: 'max_user_penalties', value: '3', description: 'Max number of user penalties' },
            { _id: '2200', name: 'penalty_days', value: '30', description: 'User penalty days' },
            { _id: '8000', name: 'date_test_monthly_pay', value: "November 1, 2017", description: 'Date test for monthly payment of iurest service' }
        ];

        parameters.forEach((parameter: Parameter) => Parameters.insert(parameter));
    }
}