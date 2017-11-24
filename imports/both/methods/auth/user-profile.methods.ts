import { Meteor } from 'meteor/meteor';
import { UploadFS } from 'meteor/jalik:ufs';
import { UserImagesStore } from '../../stores/auth/user.store';

/**
 * Function allow upload user images
 * @param {File} data
 * @param {String} user
 * @return {Promise<any>} uploadUserImage
 */
export function uploadUserImage( data: File,
                                 user: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const file = {
        name: data.name,
        type: data.type,
        size: data.size,
        userId: user
      };
  
      const upload = new UploadFS.Uploader({
        data,
        file,
        store: UserImagesStore,
        onError: reject,
        onComplete: resolve
      });
      upload.start();
    });
  }