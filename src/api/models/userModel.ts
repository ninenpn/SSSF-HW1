import {promisePool} from '../../database/db';
import CustomError from '../../classes/CustomError';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {User} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';

const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & User[]>(
    `
    SELECT user_id, user_name, email, role 
    FROM sssf_user
    `
  );
  if (rows.length === 0) {
    throw new CustomError('No users found', 404);
  }
  return rows;
};

const getUser = async (userId: number): Promise<User> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & User[]>(
    `
    SELECT user_id, user_name, email, role 
    FROM sssf_user 
    WHERE user_id = ?;
    `,
    [userId]
  );
  if (rows.length === 0) {
    throw new CustomError('No users found', 404);
  }
  return rows[0];
};

// TODO: create addUser function
const addUser = async (data: User): Promise<MessageResponse> => {
  const sql = promisePool.format(
    'INSERT INTO sssf_user (user_name, email, password) VALUES (?, ?, ?);',
    [data.user_name, data.email, data.password]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('No users added', 400);
  }
  return {message: 'User added'};
};

const updateUser = async (
  data: Partial<User>,
  userId: number
): Promise<MessageResponse> => {
  const sql = promisePool.format('UPDATE sssf_user SET ? WHERE user_id = ?;', [
    data,
    userId,
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('No users updated', 400);
  }
  return {message: 'User updated'};
};

// TODO: create deleteUser function
const deleteUser = async (userId: number): Promise<MessageResponse> => {
  const sql = promisePool.format('DELETE FROM sssf_user WHERE user_id = ?;', [
    userId,
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('No users deleted', 400);
  }
  return {message: 'User deleted'};
};

const getUserLogin = async (email: string): Promise<User> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & User[]>(
    `
    SELECT * FROM sssf_user 
    WHERE email = ?;
    `,
    [email]
  );
  if (rows.length === 0) {
    throw new CustomError('Invalid username/password', 200);
  }
  return rows[0];
};

export {getAllUsers, getUser, addUser, updateUser, deleteUser, getUserLogin};
