import { enableProdMode, PlatformRef, ApplicationModule, ApplicationRef} from '@angular/core';
import { ResourceLoader } from '@angular/compiler';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import { platformDynamicServer, BEFORE_APP_SERIALIZED ,INITIAL_CONFIG, PlatformState } from '@angular/platform-server';
import { Meteor } from 'meteor/meteor';
import { WebApp, WebAppInternals } from 'meteor/webapp';
import { ServerAppModule } from '../imports/app/server-app.module';
import '../imports/polyfills';

import '../imports/server-site/publications/administration/sections';
import '../imports/server-site/publications/administration/categories';
import '../imports/server-site/publications/administration/subcategories';
import '../imports/server-site/publications/administration/additions';
import '../imports/server-site/publications/administration/promotions';
import '../imports/server-site/publications/administration/garnish-food';
import '../imports/server-site/publications/administration/item';
import '../imports/server-site/publications/auth/users';
import '../imports/server-site/publications/auth/roles';
import '../imports/server-site/publications/auth/menus';
import '../imports/server-site/publications/auth/collaborators';
import '../imports/server-site/publications/auth/user-details';
import '../imports/server-site/publications/general/hour';
import '../imports/server-site/publications/general/currency';
import '../imports/server-site/publications/general/paymentMethod';
import '../imports/server-site/publications/general/email-content';
import '../imports/server-site/publications/general/parameter';
import '../imports/server-site/publications/payment/payment-history';
import '../imports/server-site/publications/payment/cc-payment-method';
import '../imports/server-site/publications/payment/payment-transaction';
import '../imports/server-site/publications/payment/invoice-info';
import '../imports/server-site/publications/payment/iurest-invoices';
import '../imports/server-site/publications/restaurant/restaurant';
import '../imports/server-site/publications/restaurant/table';
import '../imports/server-site/publications/restaurant/account';
import '../imports/server-site/publications/restaurant/order';
import '../imports/server-site/publications/restaurant/waiter-call';
import '../imports/server-site/publications/restaurant/payment';
import '../imports/server-site/publications/restaurant/invoice';
import '../imports/server-site/publications/settings/cities';
import '../imports/server-site/publications/settings/countries';
import '../imports/server-site/publications/settings/languages';

import '../imports/both/methods/administration/promotion.methods';
import '../imports/both/methods/administration/collaborators.methods';
import '../imports/both/methods/administration/item.methods';
import '../imports/both/methods/auth/menu.methods';
import '../imports/both/methods/auth/user-detail.methods';
import '../imports/both/methods/auth/user-devices.methods';
import '../imports/both/methods/auth/user-login.methods';
import '../imports/both/methods/auth/user-profile.methods';
import '../imports/both/methods/auth/user.methods';
import '../imports/both/methods/general/cron.methods';
import '../imports/both/methods/general/email.methods';
import '../imports/both/methods/general/parameter.methods';
import '../imports/both/methods/restaurant/restaurant.methods';
import '../imports/both/methods/restaurant/invoice.methods';
import '../imports/both/methods/restaurant/order.methods';
import '../imports/both/methods/restaurant/payment.methods';
import '../imports/both/methods/restaurant/schedule.methods';
import '../imports/both/methods/restaurant/table.method';
import '../imports/both/methods/restaurant/waiter-queue/waiter-queue.methods';
import '../imports/both/methods/restaurant/waiter-queue/queues.methods';

import '../imports/server-site/fixtures/auth/account-creation';
import '../imports/server-site/fixtures/auth/email-config';
import { loadRoles } from '../imports/server-site/fixtures/auth/roles';
import { loadMenus } from '../imports/server-site/fixtures/auth/menus';
import { loadHours } from '../imports/server-site/fixtures/general/hours';
import { loadCurrencies } from '../imports/server-site/fixtures/general/currencies';
import { loadEmailContents } from '../imports/server-site/fixtures/general/email-contents';
import { loadParameters } from '../imports/server-site/fixtures/general/parameters';
import { loadPaymentMethods } from '../imports/server-site/fixtures/general/paymentMethods';
import { loadCcPaymentMethods } from '../imports/server-site/fixtures/payments/cc-payment-methods';
import { loadInvoicesInfo } from '../imports/server-site/fixtures/payments/invoices-info';
import { loadCountries } from '../imports/server-site/fixtures/settings/countries';
import { loadCities } from '../imports/server-site/fixtures/settings/cities';
import { loadLanguages } from '../imports/server-site/fixtures/settings/languages';
import { createdbindexes } from '../imports/server-site/indexes/indexdb';
import { createCrons } from '../imports/server-site/cron';
import { removeFixtures } from '../imports/server-site/fixtures/remove-fixtures';

Meteor.startup(() => {
  // Enable Angular's production mode if Meteor is in production mode
  if (Meteor.isProduction) {
    enableProdMode();
  }

  // When page requested
  WebApp.connectHandlers.use(async (request, response, next) => {
    let document, platformRef : PlatformRef;
    // Handle Angular's error, but do not prevent client bootstrap
    try {
      document = await WebAppInternals.getBoilerplate(request, WebApp.defaultArch);

      // Integrate Angular's router with Meteor
      const url = request.url;

      // Get rendered document
      platformRef = platformDynamicServer([
        {
          provide: INITIAL_CONFIG,
          useValue: {
            // Initial document
            document,
            url
          }
        }
      ]);

      const appModuleRef = await platformRef.bootstrapModule(ServerAppModule, {
        providers: [
          {
            provide: ResourceLoader,
            useValue: {
              get: Assets.getText
            },
            deps: []
          }
        ]
      });

      const applicationRef : ApplicationRef = appModuleRef.injector.get(ApplicationRef);

      await applicationRef.isStable.first(isStable => isStable == true).toPromise();

      // Run any BEFORE_APP_SERIALIZED callbacks just before rendering to string.
      const callbacks = appModuleRef.injector.get(BEFORE_APP_SERIALIZED, null);
      if (callbacks) {
        for (const callback of callbacks) {
          try {
            callback();
          } catch (e) {
            // Ignore exceptions.
            console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
          }
        }
      }

      const platformState: PlatformState = appModuleRef.injector.get(PlatformState);
      document = platformState.renderToString();
    } catch (e) {
      // Write errors to console
      console.error('Angular SSR Error: ' + e.stack || e);
    }finally{
      //Make sure platform is destroyed before rendering
      if(platformRef){
        platformRef.destroy();
      }
      response.end(document);
    }
  })

  removeFixtures();
  loadMenus();
  loadRoles();
  loadHours();
  loadCurrencies();
  loadPaymentMethods();
  loadCountries();
  loadCities();
  loadLanguages();
  createdbindexes();
  loadEmailContents();
  loadParameters();
  loadCcPaymentMethods();
  loadInvoicesInfo();
  createCrons();

});
