/// <reference types="zone.js" />
/// <reference types="meteor-typings" />
/// <reference types="@types/underscore" />
/// <reference types="@types/node" />

declare module '*.html' {
    const template: string;
    export default template;
}

declare module '*.scss' {
    const style: string;
    export default style;
}

declare module '*.less' {
    const style: string;
    export default style;
}

declare module '*.css' {
    const style: string;
    export default style;
}

declare module '*.sass' {
    const style: string;
    export default style;
}

  /*declare module 'meteor/tmeasday:publish-counts' {
    import { Mongo } from 'meteor/mongo';
  
    interface CountsObject {
      get(PublicationName:string):number;
      publish(context: any, pulicationName: string, cursor: Mongo.Cursor, options:any):number;
    }
  
    export const Counts: CountsObject;
  }
  
  declare var Fake: {
      sentence(words: number): string;
  }*/