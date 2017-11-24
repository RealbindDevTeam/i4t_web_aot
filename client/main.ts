import { Meteor } from 'meteor/meteor';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '../imports/app/app.module';
import '../imports/polyfills';

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

function setClass(css) {
  if (!document.body.className) {
    document.body.className = "";
  }
  document.body.className += " " + css;
}

Meteor.startup(() => {
  if (Meteor.isProduction) {
    enableProdMode();
  }
  setClass('web');
  platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));;
});
