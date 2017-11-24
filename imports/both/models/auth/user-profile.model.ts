import { CollectionObject } from '../collection-object.model';

/**
 * User Profile Model
 */
export class UserProfile {
    first_name?: string;
    last_name?: string;
    language_code?: string;
}

/**
 * User Profile Image Model
 */
export class UserProfileImage {
    _id?: string;
    complete: boolean;
    extension: string;
    name: string;
    progress: number;
    size: number;
    store: string;
    token: string;
    type: string;
    uploaded_at: Date;
    uploading: boolean;
    url: string;
    userId: string;
}