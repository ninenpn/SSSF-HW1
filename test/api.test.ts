import app from '../src/app';
import {
  deleteUser,
  getCurrentUser,
  getSingleUser,
  getUser,
  postAuthLogin,
  postAuthLoginError,
  postUser,
  putUser,
} from './userFunctions';
import {closePool} from '../src/database/db';
import {getNotFound} from './testFunctions';
import {
  adminPutCat,
  getCat,
  getSingleCat,
  postCat,
  userDeleteCat,
  userPutCat,
} from './catFunctions';
import {User} from '../src/types/DBTypes';

describe('GET /api/v1', () => {
  afterAll(async () => {
    // close database connection
    await closePool();
  });

  // test not found
  it('responds with a not found message', async () => {
    await getNotFound(app);
  });

  // test login error
  it('should return error message on invalid credentials', async () => {
    await postAuthLoginError(app);
  });

  // test create user
  let token = '';
  it('should create a new user', async () => {
    await postUser(app, {
      user_name: 'Test User ' + new Date().toLocaleDateString('fi-FI'),
      email: 'test@user.fi',
      password: 'asdfQEWR1234',
    });
  });

  // test login
  it('should return a user object and bearer token on valid credentials', async () => {
    const user = await postAuthLogin(app, {
      username: 'test@user.fi',
      password: 'asdfQEWR1234',
    });
    token = user.token;
  });

  // test get all users
  let userId = 0;
  it('should return array of users', async () => {
    const users: User[] = await getUser(app);
    userId = users[0].user_id!;
  });

  // test get single user
  it('should return single user', async () => {
    await getSingleUser(app, userId);
  });

  // test update user
  it('should update user', async () => {
    await putUser(app, token);
  });

  // test get current user based on token
  let owner = 0;
  it('should return current user', async () => {
    const user = await getCurrentUser(app, token);
    owner = user.user_id;
  });

  // test cat upload without GPS
  let catID = 0;
  it('should upload a cat', async () => {
    const message = await postCat(app, token, owner, 'cat.jpg');
    catID = message.id!;
  });

  // test cat upload with GPS
  let catID2 = 0;
  it('should upload a cat with GPS', async () => {
    const message = await postCat(app, token, owner, 'picWithGPS.jpg');
    catID2 = message.id!;
  });

  // test get all cats
  it('should return array of cats', async () => {
    await getCat(app);
  });

  // test get single cat
  it('should return single cat', async () => {
    await getSingleCat(app, catID);
  });

  // modify user's cat
  it('should modify a cat', async () => {
    await userPutCat(app, token, catID);
  });

  // test delete user's cat
  it('should delete a cat', async () => {
    await userDeleteCat(app, token, catID);
  });

  // delete GPS image
  it('should delete GPS image', async () => {
    await userDeleteCat(app, token, catID2);
  });

  // upload another cat for admin tests
  it('should upload a cat for admin test', async () => {
    const message = await postCat(app, token, owner, 'cat.jpg');
    catID = message.id!;
  });

  // test delete user based on token
  it('should delete current user', async () => {
    await deleteUser(app, token);
  });

  // login as admin
  it('should login as admin', async () => {
    const user = await postAuthLogin(app, {
      username: 'admin@metropolia.fi',
      password: '1234',
    });
    token = user.token;
  });

  // test modify user's cat as admin
  it('should modify a cat as admin', async () => {
    await adminPutCat(app, token, catID);
  });

  // test delete user's cat as admin
  it('should delete a cat as admin', async () => {
    await userDeleteCat(app, token, catID);
  });
});
