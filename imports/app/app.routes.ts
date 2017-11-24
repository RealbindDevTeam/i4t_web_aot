import { Route } from '@angular/router';
import { NgZone } from '@angular/core';
import { LayoutComponent } from './web/navigation/layout/layout.component';
import { DashboardComponent } from './web/dashboard/dashboard.component';
import { SectionComponent } from './web/administration/sections/section.component';
import { LandingPageComponent } from './web/landing-page/landing-page.component';
import { SignupWebComponent } from './web/auth/signup.web.component';
import { SigninWebComponent } from './web/auth/signin.web.component';
import { CategoryComponent } from './web/administration/categories/categories.component';
import { SubcategoryComponent } from './web/administration/subcategories/subcategories.component';
import { AdditionComponent } from './web/administration/additions/addition.component';
import { GarnishFoodComponent } from './web/administration/garnish-food/garnish-food.component';
import { OrdersComponent } from './web/customer/orders/order.component';
import { SettingsWebComponent } from './web/customer/settings/settings.web.component';
import { TableComponent } from './web/restaurant/tables/table.component';
import { RestaurantComponent } from './web/restaurant/restaurant/restaurant.component';
import { RestaurantRegisterComponent } from './web/restaurant/restaurant/restaurant-register/restaurant-register.component';
import { ItemCreationComponent } from './web/administration/items/items-creation/item-creation.component';
import { ResetPasswordWebComponent } from './web/auth/reset-password.web.component';
import { GoToStoreComponent } from './web/auth/go-to-store/go-to-store.component';
import { CollaboratorsComponent } from './web/restaurant/collaborators/collaborators.component';
import { CollaboratorsRegisterComponent } from './web/restaurant/collaborators/collaborators-register/collaborators-register.component';
import { ItemComponent } from './web/administration/items/item.component';
import { RestaurantEditionComponent } from './web/restaurant/restaurant/restaurant-edition/restaurant-edition.component';
import { ItemEnableComponent } from './web/administration/items/items-enable/items-enable.component';
import { WaiterCallComponent } from './web/customer/waiter-call/waiter-call.component';
import { OrderAttentionComponent } from './web/chef/order-attention/order-attention.component';
import { CallsComponent } from "./web/waiter/calls/calls.component";
import { NotFoundWebComponent } from './web/auth/notfound.web.component';
import { MeteorObservable } from 'meteor-rxjs';
import { CustomerGuard } from './web/auth/navigation/customer-guard.service';
import { AdminGuard } from './web/auth/navigation/admin-guard.service';
import { WaiterGuard } from './web/auth/navigation/waiter-guard.service';
import { SupervisorGuard } from './web/auth/navigation/supervisor-guard.service';
import { ChefGuard } from './web/auth/navigation/chef-guard.service';
import { CashierGuard } from './web/auth/navigation/cashier-guard.service';
import { PaymentsComponent } from './web/customer/payments/payments.component';
import { MonthlyPaymentComponent } from './web/payment/monthly-payment/monthly-payment.component';
import { SupervisorDashboardComponent } from './web/supervisor-dashboard/supervisor-dashboard.component';
import { MonthlyConfigComponent } from './web/restaurant/monthly-config/monthly-config.component';
import { ColombiaOrderInfoComponent } from './web/customer/payments/country-payment/colombia-payment/colombia-order-info/colombia-order-info.component';
import { OrderPaymentTranslateComponent } from './web/customer/payments/order-payment-translate/order-payment-translate.component';
import { PayuPaymentFormComponent } from './web/payment/payu-payment-form/payu-payment-form.component';
import { PaymentHistoryComponent } from './web/payment/payment-history/payment-history.component';
import { ReactivateRestaurantComponent } from './web/payment/reactivate-restaurant/reactivate-restaurant.component';
import { ColombiaPayInfoComponent } from './web/customer/payments/country-payment/colombia-payment/colombia-pay-info/colombia-pay-info.component';
import { CustomerPaymentsHistoryComponent } from './web/customer/settings/customer-payments-history/customer-payments-history.component';
import { AdminSignupComponent } from './web/auth/admin-signup.component';
import { ItemEnableSupComponent } from './web/administration/items/items-enable-sup/items-enable-sup.component';
import { MenuListComponent } from './web/chef/menu-list/menu-list.component';
import { SupervisorCollaboratorsComponent } from './web/supervisor/collaborators/supervisor-collaborators.component';
import { SupervisorCollaboratorsRegisterComponent } from './web/supervisor/collaborators/collaborators-register/supervisor-collaborators-register.component';
import { SupervisorTableComponent } from './web/supervisor/tables/supervisor-tables.component';
import { TableChangeComponent } from './web/customer/table-change/table-change.component';
import { RestaurantExitComponent } from './web/customer/restaurant-exit/restaurant-exit.component';
import { RestaurantTableControlComponent } from './web/restaurant/restaurant/restaurant-table-control/restaurant-table-control.component';
import { TableDetailComponent } from './web/restaurant/restaurant/restaurant-table-control/table-detail/table-detail.component';
import { SupervisorRestaurantTableControlComponent } from './web/supervisor/restaurant-table-control/supervisor-restaurant-table-control.component';
import { InvoicesDownloadPage } from './web/administration/invoices-download/invoices-download.component';
import { RestaurantProfileComponent } from './web/restaurant/restaurant/profile/restaurant-profile.component';
import { RestaurantProFileDetailComponent } from './web/customer/restaurant-profile-detail/restaurant-profile-detail.component';

export const routes: Route[] = [
    {
        path: 'app', component: LayoutComponent, canActivateChild: ['canActivateForLoggedIn'], children: [
            { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
            { path: 'settings', component: SettingsWebComponent },
            { path: 'collaborators', component: CollaboratorsComponent, canActivate: [SupervisorGuard] },
            { path: 'collaborators-register', component: CollaboratorsRegisterComponent, canActivate: [SupervisorGuard] },
            { path: 'sections', component: SectionComponent, canActivate: [AdminGuard] },
            { path: 'categories', component: CategoryComponent, canActivate: [AdminGuard] },
            { path: 'subcategories', component: SubcategoryComponent, canActivate: [AdminGuard] },
            { path: 'additions', component: AdditionComponent, canActivate: [AdminGuard] },
            { path: 'garnishFood', component: GarnishFoodComponent, canActivate: [AdminGuard] },
            { path: 'items', component: ItemComponent, canActivate: [AdminGuard] },
            { path: 'items-creation', component: ItemCreationComponent, canActivate: [AdminGuard] },
            { path: 'restaurant', component: RestaurantComponent, canActivate: [AdminGuard] },
            { path: 'restaurant-register', component: RestaurantRegisterComponent, canActivate: [AdminGuard] },
            { path: 'restaurant-edition/:param1', component: RestaurantEditionComponent, canActivate: [AdminGuard] },
            { path: 'tables', component: TableComponent, canActivate: [AdminGuard] },
            { path: 'orders', component: OrdersComponent, canActivate: [CustomerGuard] },
            { path: 'items-enable', component: ItemEnableComponent, canActivate: [SupervisorGuard] },
            { path: 'waiter-call', component: WaiterCallComponent, canActivate: [CustomerGuard] },
            { path: 'chef-orders', component: OrderAttentionComponent, canActivate: [ChefGuard] },
            { path: 'calls', component: CallsComponent, canActivate: [WaiterGuard] },
            { path: 'payments', component: PaymentsComponent, canActivate: [CustomerGuard] },
            { path: 'monthly-payment', component: MonthlyPaymentComponent, canActivate: [AdminGuard] },
            { path: 'dashboards', component: SupervisorDashboardComponent, canActivate: [SupervisorGuard] },
            { path: 'monthly-config', component: MonthlyConfigComponent, canActivate: [AdminGuard] },
            { path: 'col-orders-info', component: ColombiaOrderInfoComponent, canActivate: [CustomerGuard] },
            { path: 'orders-translate', component: OrderPaymentTranslateComponent, canActivate: [CustomerGuard] },
            { path: 'payment-form/:param1/:param2/:param3', component: PayuPaymentFormComponent, canActivate: [AdminGuard] },
            { path: 'payment-history', component: PaymentHistoryComponent, canActivate: [AdminGuard] },
            { path: 'reactivate-restaurant', component: ReactivateRestaurantComponent, canActivate: [AdminGuard] },
            { path: 'col-pay-info', component: ColombiaPayInfoComponent, canActivate: [CustomerGuard] },
            { path: 'customer-payments-history', component: CustomerPaymentsHistoryComponent, canActivate: [CustomerGuard] },
            { path: 'items-enable-sup', component: ItemEnableSupComponent, canActivate: [SupervisorGuard] },
            { path: 'menu-list', component: MenuListComponent },
            { path: 'supervisor-collaborators', component: SupervisorCollaboratorsComponent, canActivate: [SupervisorGuard] },
            { path: 'supervisor-collaborators-register', component: SupervisorCollaboratorsRegisterComponent, canActivate: [SupervisorGuard] },
            { path: 'supervisor-tables', component: SupervisorTableComponent, canActivate: [SupervisorGuard] },
            { path: 'table-change', component: TableChangeComponent, canActivate: [CustomerGuard] },
            { path: 'restaurant-exit', component: RestaurantExitComponent, canActivate: [CustomerGuard] },
            { path: 'restaurant-table-control', component: RestaurantTableControlComponent, canActivate: [AdminGuard] },
            { path: 'table-detail/:param1/:param2/:param3/:param4/:param5', component: TableDetailComponent, canActivate: [SupervisorGuard] },
            { path: 'supervisor-restaurant-table-control', component: SupervisorRestaurantTableControlComponent, canActivate: [SupervisorGuard] },
            { path: 'invoices-download', component: InvoicesDownloadPage, canActivate: [AdminGuard] },
            { path: 'restaurant-profile', component: RestaurantProfileComponent, canActivate: [AdminGuard] },
            { path: 'restaurant-detail', component: RestaurantProFileDetailComponent },
            { path: 'restaurant-detail/:param1', component: RestaurantProFileDetailComponent }
        ]
    },
    { path: '', component: LandingPageComponent },
    { path: 'signin', component: SigninWebComponent },
    { path: 'signup', component: SignupWebComponent },
    { path: 'admin-signup', component: AdminSignupComponent },
    { path: 'reset-password/:tk', component: ResetPasswordWebComponent },
    { path: 'go-to-store/:ic', component: GoToStoreComponent },
    { path: '404', component: NotFoundWebComponent },
    { path: '**', redirectTo: '/404' }
];
