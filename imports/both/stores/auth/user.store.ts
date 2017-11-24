import { UploadFS } from 'meteor/jalik:ufs';
import { UserImages } from '../../collections/auth/user.collection';

/**
 * Function to validate if user exists
 */
function loggedIn(){
    return !!Meteor.user();
}

/**
 * Create store to User images
 */
export const UserImagesStore = new UploadFS.store.GridFS({
    collection: UserImages.collection,
    name: 'userImagesStore',
    filter: new UploadFS.Filter({
      contentTypes: ['image/*'],
      minSize: 1,
      maxSize: 1024 * 1000,  // 1MB
      extensions: ['jpg', 'png', 'jpeg']
    }),
    permissions: new UploadFS.StorePermissions({
      insert: loggedIn,
      update: loggedIn,
      remove: loggedIn
    }),
    transformWrite(from, to, fileId, file) {
      // Resize to 150x150
      //var require: any;
      const gm = require('gm');
   
      gm(from, file.name)
        .resize(150, 150, "!")
        .gravity('Center')
        .extent(150, 150)
        .quality(75)
        .stream()
        .pipe(to);
    }
  });