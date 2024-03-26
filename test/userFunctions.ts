/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {User} from '../src/types/DBTypes';
import {ErrorResponse, MessageResponse} from '../src/types/MessageTypes';

type UserWithToken = {
  user: User;
  token: string;
};

const getUser = (url: string | Function): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/users')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users: User[] = response.body;
          users.forEach((user) => {
            expect(user).toHaveProperty('user_id');
            expect(user).toHaveProperty('user_name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('role');
            expect(user).not.toHaveProperty('password');
          });
          resolve(users);
        }
      });
  });
};

const getSingleUser = (url: string | Function, id: number): Promise<User> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/users/' + id)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user: User = response.body;
          expect(user).toHaveProperty('user_id');
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('role');
          expect(user).not.toHaveProperty('password');
          resolve(response.body);
        }
      });
  });
};

const postUser = (
  url: string | Function,
  user: Omit<User, 'user_id' | 'role'>
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/api/v1/users/')
      .set('Content-type', 'application/json')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const resp: MessageResponse = response.body;
          expect(resp.message).toBe('User added');
          resolve(resp);
        }
      });
  });
};

const putUser = (
  url: string | Function,
  token: string
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .put('/api/v1/users/')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        user_name: 'Test User ' + new Date().toISOString(),
      })
      .expect('Content-Type', /json/)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const resp: MessageResponse = response.body;
          expect(resp.message).toBe('User updated');
          resolve(resp);
        }
      });
  });
};

const getCurrentUser = (
  url: string | Function,
  token: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/users/token')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body;
          expect(user).toHaveProperty('user_id');
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('role');
          expect(user).not.toHaveProperty('password');
          resolve(response.body);
        }
      });
  });
};

const postAuthLogin = (
  url: string | Function,
  user: {username: string; password: string}
): Promise<UserWithToken> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/api/v1/auth/login')
      .send(user)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          expect(response.body).toHaveProperty('user');
          expect(response.body).toHaveProperty('token');
          const user: User = response.body.user;
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('role');
          expect(user).toHaveProperty('user_id');
          expect(user).not.toHaveProperty('password');
          resolve(response.body);
        }
      });
  });
};

const postAuthLoginError = (url: string | Function): Promise<ErrorResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/api/v1/auth/login')
      .send({
        username: 'wrong@example.com',
        password: 'wrongpassword',
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('stack');
          resolve(response.body);
        }
      });
  });
};

const deleteUser = (
  url: string | Function,
  token: string
): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete('/api/v1/users')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const resp: MessageResponse = response.body;
          expect(resp.message).toBe('User deleted');
          resolve(resp);
        }
      });
  });
};

export {
  getUser,
  getSingleUser,
  getCurrentUser,
  postUser,
  putUser,
  postAuthLogin,
  postAuthLoginError,
  deleteUser,
};
