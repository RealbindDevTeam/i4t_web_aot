import { Roles } from '../../../both/collections/auth/role.collection';
import { Role } from '../../../both/models/auth/role.model';

export function loadRoles() {

    if(Roles.find().cursor.count() === 0 ){

        const roles: Role[] = [{
            _id: "100",
            is_active: true,
            name: "ROLE.ADMINISTRATOR",
            description: "restaurant administrator",
            menus: ["900","1000", "2000", "3000", "10000"]
        },{
            _id: "200",
            is_active: true,
            name: "ROLE.WAITER",
            description: "restaurant waiter",
            menus: ["8000","9000", "10000"],
            user_prefix: 'wa'
        },{
            _id: "300",
            is_active: false,
            name: "ROLE.CASHIER",
            description: "restaurant cashier",
            menus: [],
            user_prefix: 'ca'            
        },{
            _id: "400",
            is_active: true,
            name: "ROLE.CUSTOMER",
            description: "restaurant customer",
            menus: ["4000","5000","6000"]
        },{
            _id: "500",
            is_active: true,
            name: "ROLE.CHEF",
            description: "restaurant chef",
            menus: ["7000","9000", "10000"],
            user_prefix: 'cf'            
        },{
            _id: "600",
            is_active: true,
            name: "ROLE.SUPERVISOR",
            description: "restaurant supervisor",
            menus: ["910","1100","3100", "1200", "1300", "10000"],
            user_prefix: 'sp'            
        }];

        roles.forEach((role: Role) => Roles.insert(role));
    }
}