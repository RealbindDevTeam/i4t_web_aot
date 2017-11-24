import { Meteor } from 'meteor/meteor';
import { UploadFS } from 'meteor/jalik:ufs';
import { Promotions, PromotionImages, PromotionImagesThumbs } from '../../collections/administration/promotion.collection';
import { PromotionImagesStore } from '../../stores/administration/promotion.store';

/**
 * Function allow upload promotion images
 * @param {File} data
 * @param {String} user
 * @return {Promise<any>} uploadGarnishFoodImage
 */
export function uploadPromotionImage( data:File, 
                                      user:string, 
                                      promotionId: string ): Promise<any> {
  return new Promise( ( resolve, reject ) => {
    const file = {
      name: data.name,
      type: data.type,
      size: data.size,
      userId: user,
      promotionId: promotionId
    };

    const upload = new UploadFS.Uploader({
      data,
      file,
      store: PromotionImagesStore,
      onError: reject,
      onComplete: resolve
    });
    upload.start();
  });
}