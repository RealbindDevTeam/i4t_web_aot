import { UploadFS } from 'meteor/jalik:ufs';
import { PromotionImages, PromotionImagesThumbs } from '../../collections/administration/promotion.collection';

/**
 * Function to validate if user exists
 */
function loggedIn(){
    return !!Meteor.user();
}

/**
 * Create store to promotion image thumbs
 */
export const PromotionImageThumbsStore = new UploadFS.store.GridFS({
    collection: PromotionImagesThumbs.collection,
    name: 'promotionImageThumbsStore',
    permissions: new UploadFS.StorePermissions({
      insert: loggedIn,
      update: loggedIn,
      remove: loggedIn
    }),
    transformWrite(from, to, fileId, file) {
      // Resize to 100x100
      const gm = require('gm');
   
      gm(from, file.name)
        .resize(100, 100, "!")
        .gravity('Center')
        .extent(100, 100)
        .quality(75)
        .stream()
        .pipe(to);
    }
  });

  /**
 * Create store to promotion images
 */
export const PromotionImagesStore = new UploadFS.store.GridFS({
    collection: PromotionImages.collection,
    name: 'promotionImagesStore',
    filter: new UploadFS.Filter({
      contentTypes: ['image/*'],
      minSize: 1,
      maxSize: 1024 * 1000,  // 1MB
      extensions: ['jpg', 'png', 'jpeg']
    }),
    copyTo: [
      PromotionImageThumbsStore
    ],
    permissions: new UploadFS.StorePermissions({
      insert: loggedIn,
      update: loggedIn,
      remove: loggedIn
    }),
    transformWrite(from, to, fileId, file) {
      // Resize to 500x500
      const gm = require('gm');
   
      gm(from, file.name)
        .resize(500, 500, "!")
        .gravity('Center')
        .extent(500, 500)
        .quality(75)
        .stream()
        .pipe(to);
    }
  });