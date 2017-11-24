import { CollectionObject } from '../collection-object.model';

/**
 * Item model
 */
export interface Item extends CollectionObject {
    is_active: boolean;
    sectionId: string;
    categoryId?: string;
    subcategoryId?: string;
    name: string;
    description: string;
    time: string;
    restaurants: ItemRestaurant[];
    prices: ItemPrice[];
    observations: boolean;
    garnishFoodQuantity: number;
    garnishFood: string[];
    additions: string[];
    //isAvailable: boolean;
}

/**
 * Item Images model
 */
export interface ItemImage {
    _id?: string;
    complete: boolean;
    extension: string;
    name: string;
    progress: number;
    size: number;
    store: string;
    token: string;
    type: string;
    uploadedAt: Date;
    uploading: boolean;
    url: string;
    userId: string;
    itemId: string;
}

/**
 * Item Image Thumbs model
 */
export interface ItemImageThumb extends ItemImage {
    originalStore?: string;
    originalId?: string;
}

/**
 * Item Restaurant model
 */
export interface ItemRestaurant {
    restaurantId: string;
    price: number;
    itemTax?: number;
    isAvailable: boolean;
}

/**
 * Item Price model
 */
export interface ItemPrice {
    currencyId: string;
    price: number;
    itemTax?: number;
}