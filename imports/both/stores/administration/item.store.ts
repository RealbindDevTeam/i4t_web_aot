import { UploadFS } from 'meteor/jalik:ufs';
import { ItemImages, ItemImagesThumbs } from '../../collections/administration/item.collection';

/**
 * Function to validate if user exists
 */
function loggedIn(){
    return !!Meteor.user();
}

/**
 * Create store to item image thumbs
 */
export const ItemImageThumbsStore = new UploadFS.store.GridFS({
    collection: ItemImagesThumbs.collection,
    name: 'itemImageThumbsStore',
    permissions: new UploadFS.StorePermissions({
      insert: loggedIn,
      update: loggedIn,
      remove: loggedIn
    }),
    transformWrite(from, to, fileId, file) {
      // Resize to 160x160
      //var require: any;
      const gm = require('gm');
   
      gm(from, file.name)
        .resize(160, 160, "!")
        .gravity('Center')
        .extent(160, 160)
        .quality(75)
        .stream()
        .pipe(to);
  
    }
  });

/**
 * Create store to Item images
 */
export const ItemImagesStore = new UploadFS.store.GridFS({
    collection: ItemImages.collection,
    name: 'itemImagesStore',
    filter: new UploadFS.Filter({
      contentTypes: ['image/*'],
      minSize: 1,
      maxSize: 1024 * 1000,  // 1MB
      extensions: ['jpg', 'png', 'jpeg']
    }),
    copyTo: [
      ItemImageThumbsStore
    ],
    permissions: new UploadFS.StorePermissions({
      insert: loggedIn,
      update: loggedIn,
      remove: loggedIn
    }),
    transformWrite(from, to, fileId, file) {
      // Resize to 500x500
      //var require: any;
      const gm = require('gm');
   
      gm(from, file.name)
        .resize(250, 250, "!")
        .gravity('Center')
        .extent(250, 250)
        .quality(75)
        .stream()
        .pipe(to);
    }
  });