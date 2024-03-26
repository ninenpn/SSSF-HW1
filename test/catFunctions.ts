/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {Cat} from '../src/types/DBTypes';
import {MessageResponse, UploadResponse} from '../src/types/MessageTypes';

const getCat = (url: string | Function): Promise<Cat[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/cats')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const cats: Cat[] = response.body;
          cats.forEach((cat) => {
            expect(cat).toHaveProperty('cat_id');
            expect(cat).toHaveProperty('cat_name');
            expect(cat).toHaveProperty('owner');
            expect(cat).toHaveProperty('weight');
            expect(cat).toHaveProperty('birthdate');
          });
          resolve(cats);
        }
      });
  });
};

const getSingleCat = (url: string | Function, id: number): Promise<Cat> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/cats/' + id)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const cat = response.body;
          expect(cat).toHaveProperty('cat_id');
          expect(cat).toHaveProperty('cat_name');
          expect(cat).toHaveProperty('owner');
          expect(cat).toHaveProperty('weight');
          expect(cat).toHaveProperty('birthdate');
          resolve(response.body);
        }
      });
  });
};

const postCat = (
  url: string | Function,
  token: string,
  owner: number,
  pic: string
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/api/v1/cats/')
      .set('Content-type', 'form-data')
      .set('Authorization', 'Bearer ' + token)
      .attach('cat', 'test/' + pic)
      .field('cat_name', 'Test Cat ' + new Date().toLocaleDateString('fi-FI'))
      .field('birthdate', '2020-01-01')
      .field('owner', owner)
      .field('weight', 13.3)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const cat: MessageResponse = response.body;
          expect(cat.message).not.toBe('');
          resolve(response.body);
        }
      });
  });
};

// admin modify cat
const adminPutCat = (
  url: string | Function,
  token: string,
  id: number
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .put('/api/v1/cats/' + id)
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        cat_name: 'Test Cat ' + new Date().toISOString(),
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const cat: MessageResponse = response.body;
          expect(cat.message).not.toBe('');
          resolve(cat);
        }
      });
  });
};

// user modify cat
const userPutCat = (
  url: string | Function,
  token: string,
  id: number
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .put('/api/v1/cats/' + id)
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        cat_name: 'Test Cat ' + new Date().toISOString(),
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const cat: MessageResponse = response.body;
          expect(cat.message).not.toBe('');
          resolve(cat);
        }
      });
  });
};

// admin delete cat
const adminDeleteCat = (
  url: string | Function,
  token: string,
  id: number
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete('/api/v1/cats/' + id)
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const cat: MessageResponse = response.body;
          expect(cat.message).not.toBe('');
          resolve(cat);
        }
      });
  });
};

// user delete cat
const userDeleteCat = (
  url: string | Function,
  token: string,
  id: number
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete('/api/v1/cats/' + id)
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const cat: MessageResponse = response.body;
          expect(cat.message).not.toBe('');
          resolve(cat);
        }
      });
  });
};

export {
  getCat,
  getSingleCat,
  postCat,
  adminPutCat,
  userPutCat,
  adminDeleteCat,
  userDeleteCat,
};
