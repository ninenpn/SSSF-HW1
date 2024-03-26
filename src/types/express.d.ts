/* eslint-disable @typescript-eslint/no-empty-interface */

// Passport adds the user to the Express Request object
// This file adds the User type to the Express Request object
import {User as UserType} from './DBTypes';

declare global {
  namespace Express {
    interface User extends Partial<UserType> {}
  }
}
