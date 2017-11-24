import { Meteor } from 'meteor/meteor';
import { UploadFS } from 'meteor/jalik:ufs';
import { Items } from '../../collections/administration/item.collection';
import { ItemImagesStore } from '../../stores/administration/item.store';
import { Item } from '../../models/administration/item.model';
import { UserDetail } from '../../models/auth/user-detail.model';

/**
 * Function allow upload item images
 * @param {File} data
 * @param {String} user
 * @return {Promise<any>} uploadItemImage
 */
export function uploadItemImage(data: File,
  user: string,
  itemId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const file = {
      name: data.name,
      type: data.type,
      size: data.size,
      userId: user,
      itemId: itemId
    };

    const upload = new UploadFS.Uploader({
      data,
      file,
      store: ItemImagesStore,
      onError: reject,
      onComplete: resolve
    });
    upload.start();
  });
}


if (Meteor.isServer) {
  Meteor.methods({
    /**
     * Function to update item available for supervisor
     * @param {UserDetail} _userDetail
     * @param {Item} _item
     */
    updateItemAvailable: function (_restaurantId: string, _itemId: string) {
      let _itemRestaurant = Items.collection.findOne({ _id: _itemId }, { fields: { _id: 0, restaurants: 1 } });
      let aux = _itemRestaurant.restaurants.find(element => element.restaurantId === _restaurantId);
      Items.update({ _id: _itemId, "restaurants.restaurantId": _restaurantId }, { $set: { 'restaurants.$.isAvailable': !aux.isAvailable, modification_date: new Date(), modification_user: Meteor.userId() } });
    }
  })
}



