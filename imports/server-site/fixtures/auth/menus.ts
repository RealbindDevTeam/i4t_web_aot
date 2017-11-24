import { Menus } from '../../../both/collections/auth/menu.collection';
import { Menu } from '../../../both/models/auth/menu.model';

export function loadMenus() {

    if (Menus.find().cursor.count() === 0) {

        const menus: Menu[] = [
            {
                _id: "900",
                is_active: true,
                name: "MENUS.DASHBOARD.DASHBOARD",
                url: "/app/dashboard",
                icon_name: "trending up",
                order: 900
            },
            {
                _id: "910",
                is_active: true,
                name: "MENUS.DASHBOARD.DASHBOARD",
                url: "/app/dashboards",
                icon_name: "trending up",
                order: 910
            },
            {
                _id: "1000",
                is_active: true,
                name: "MENUS.ADMINISTRATION.MANAGEMENT",
                url: "",
                icon_name: "supervisor account",
                order: 1000,
                children:
                [
                    {
                        _id: "1001",
                        is_active: true,
                        name: "MENUS.ADMINISTRATION.RESTAURANTS",
                        url: "",
                        icon_name: "",
                        order: 1001,
                        children: 
                        [
                            {
                                _id: "10011",
                                is_active: true,
                                name: "MENUS.ADMINISTRATION.MY_RESTAURANTS",
                                url: "/app/restaurant",
                                icon_name: "",
                                order: 10011
                            }, {
                                _id: "10012",
                                is_active: true,
                                name: "MENUS.ADMINISTRATION.PROFILE",
                                url: "/app/restaurant-profile",
                                icon_name: "",
                                order: 10012
                            }, {
                                _id: "10013",
                                is_active: true,
                                name: "MENUS.ADMINISTRATION.MONTHLY_CONFIG",
                                url: "/app/monthly-config",
                                icon_name: "",
                                order: 10013
                            }
                        ]
                    }, {
                        _id: "1002",
                        is_active: true,
                        name: "MENUS.ADMINISTRATION.TABLES",
                        url: "",
                        icon_name: "",
                        order: 1002,
                        children:
                        [
                            {
                                _id: "10021",
                                is_active: true,
                                name: "MENUS.ADMINISTRATION.TABLES_SEARCH",
                                url: "/app/tables",
                                icon_name: "",
                                order: 10021
                            }, {
                                _id: "10022",
                                is_active: true,
                                name: "MENUS.ADMINISTRATION.TABLE_CONTROL",
                                url: "/app/restaurant-table-control",
                                icon_name: "",
                                order: 10022
                            }
                        ]
                    }, {
                        _id: "1003",
                        is_active: true,
                        name: "MENUS.ADMINISTRATION.COLLABORATORS",
                        url: "/app/collaborators",
                        icon_name: "",
                        order: 1005
                    }, {
                        _id: "1004",
                        is_active: true,
                        name: "MENUS.ADMINISTRATION.INVOICES_DOWNLOAD",
                        url: "/app/invoices-download",
                        icon_name: "",
                        order: 1007
                    }
                ]
            },
            {
                _id: "1100",
                is_active: true,
                name: "MENUS.ADMINISTRATION.COLLABORATORS",
                url: "/app/supervisor-collaborators",
                icon_name: "supervisor account",
                order: 1100
            },
            {
                _id: "1200",
                is_active: true,
                name: "MENUS.ADMINISTRATION.TABLES",
                url: "/app/supervisor-tables",
                icon_name: "restaurant",
                order: 1200
            },
            {
                _id: "1300",
                is_active: true,
                name: "MENUS.ADMINISTRATION.TABLE_CONTROL",
                url: "/app/supervisor-restaurant-table-control",
                icon_name: "list",
                order: 1300
            },
            {
                _id: "2000",
                is_active: true,
                name: "MENUS.PAYMENTS.PAYMENTS",
                url: "",
                icon_name: "payment",
                order: 2000,
                children:
                [
                    {
                        _id: "2001",
                        is_active: true,
                        name: "MENUS.PAYMENTS.MONTHLY_PAYMENT",
                        url: "/app/monthly-payment",
                        icon_name: "",
                        order: 2001
                    },
                    {
                        _id: "2002",
                        is_active: true,
                        name: "MENUS.PAYMENTS.PAYMENT_HISTORY",
                        url: "/app/payment-history",
                        icon_name: "",
                        order: 2002
                    },
                    {
                        _id: "2003",
                        is_active: true,
                        name: "MENUS.PAYMENTS.REACTIVATE_RESTAURANT",
                        url: "/app/reactivate-restaurant",
                        icon_name: "",
                        order: 2003 
                    }
                ]
            },
            {
                _id: "3000",
                is_active: true,
                name: "MENUS.MENU_DEFINITION.MENU_DEFINITION",
                url: "",
                icon_name: "list",
                order: 3000,
                children:
                [
                    {
                        _id: "3001",
                        is_active: true,
                        name: "MENUS.MENU_DEFINITION.SECTIONS",
                        url: "/app/sections",
                        icon_name: "",
                        order: 3001
                    }, {
                        _id: "3002",
                        is_active: true,
                        name: "MENUS.MENU_DEFINITION.CATEGORIES",
                        url: "/app/categories",
                        icon_name: "",
                        order: 3002
                    }, {
                        _id: "3003",
                        is_active: true,
                        name: "MENUS.MENU_DEFINITION.SUBCATEGORIES",
                        url: "/app/subcategories",
                        icon_name: "",
                        order: 3003
                    }, {
                        _id: "3004",
                        is_active: true,
                        name: "MENUS.MENU_DEFINITION.ADDITIONS",
                        url: "/app/additions",
                        icon_name: "",
                        order: 3004
                    }, {
                        _id: "3005",
                        is_active: true,
                        name: "MENUS.MENU_DEFINITION.GARNISHFOOD",
                        url: "/app/garnishFood",
                        icon_name: "",
                        order: 3005
                    }, {
                        _id: "3006",
                        is_active: true,
                        name: "MENUS.MENU_DEFINITION.ITEMS",
                        url: "/app/items",
                        icon_name: "",
                        order: 3006
                    }, {
                        _id: "3007",
                        is_active: true,
                        name: "MENUS.MENU_DEFINITION.ITEMS_ENABLE",
                        url: "/app/items-enable",
                        icon_name: "",
                        order: 3007
                    }
                ]
            },
            {
                _id: "3100",
                is_active: true,
                name: "MENUS.MENU_DEFINITION.ITEMS_ENABLE",
                url: "/app/items-enable-sup",
                icon_name: "done all",
                order: 3100
            },
            {
                _id: "4000",
                is_active: true,
                name: "MENUS.ORDERS",
                url: "/app/orders",
                icon_name: "dns",
                order: 4000
            },
            {
                _id: "5000",
                is_active: true,
                name: "MENUS.PAYMENTS",
                url: "/app/payments",
                icon_name: "local_atm",
                order: 5000
            },
            {
                _id: "6000",
                is_active: true,
                name: "MENUS.WAITER_CALL",
                url: "/app/waiter-call",
                icon_name: "record_voice_over",
                order: 6000
            },
            {
                _id: "7000",
                is_active: true,
                name: "MENUS.MENU_DEFINITION.ORDERS_CHEF",
                url: "/app/chef-orders",
                icon_name: "list",
                order: 7000
            },
            {
                _id: "8000",
                is_active: true,
                name: "MENUS.CALLS",
                url: "/app/calls",
                icon_name: "pan_tool",
                order: 8000
            },
            {
                _id: "9000",
                is_active: true,
                name: "MENUS.MENU_DEFINITION.MENU_DEFINITION",
                url: "/app/menu-list",
                icon_name: "restaurant_menu",
                order: 9000
            },
            {
                _id: "10000",
                is_active: true,
                name: "MENUS.SETTINGS",
                url: "/app/settings",
                icon_name: "settings",
                order: 10000
            },
        ];
        menus.forEach((menu: Menu) => Menus.insert(menu));
    }
}
