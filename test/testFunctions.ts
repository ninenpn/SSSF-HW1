import request from 'supertest';
import {User} from '../src/types/DBTypes';

type UserWithToken = {
  user: User;
  token: string;
};

const getNotFound = (url: string | Function) => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/what-is-this')
      .expect(404, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body);
        }
      });
  });
};

export {getNotFound};
