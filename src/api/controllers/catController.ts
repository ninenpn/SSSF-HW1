import {
  addCat,
  deleteCat,
  getAllCats,
  getCat,
  updateCat,
} from '../models/catModel';
import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {validationResult} from 'express-validator';
import {MessageResponse} from '../../types/MessageTypes';
import {Cat, User} from '../../types/DBTypes';

const catListGet = async (
  _req: Request,
  res: Response<Cat[]>,
  next: NextFunction
) => {
  try {
    const cats = await getAllCats();
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const catGet = async (req: Request, res: Response<Cat>, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const id = Number(req.params.id);
    const cat = await getCat(id);
    res.json(cat);
  } catch (error) {
    next(error);
  }
};

// TODO: create catPost function to add new cat
const catPost = async (
  req: Request<{}, {}, Omit<Cat, 'owner'> & {owner: number}>,
  res: Response<MessageResponse, {coords: [number, number]}>,
  next: NextFunction
) => {
  // catPost should use addCat function from catModel
  // catPost should use validationResult to validate req.body
  // catPost should use req.file to get filename
  // catPost should use res.locals.coords to get lat and lng (see middlewares.ts)
  // catPost should use req.user to get user_id and role (see passport/index.ts and express.d.ts)
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    if (!req.file) {
      throw new CustomError('File is missing', 400);
      return;
    }
    const filename = req.file.filename;
    const [lat, lng] = res.locals.coords;
    const {user_id, role} = req.user as User;

    const cat: Omit<Cat, 'owner'> & {
      owner: number;
      filename: string;
      lat: number;
      lng: number;
      user_id: number;
      role: string;
    } = {
      ...req.body,
      owner: user_id,
      filename,
      lat,
      lng,
      user_id,
      role,
    };

    const result = await addCat(cat);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const catPut = async (
  req: Request<{id: Cat}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req.params.id);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const id = Number(req.params.id);
    const cat = req.body as Cat;
    const result = await updateCat(cat, id, req.user as User);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// TODO: create catDelete function to delete cat
// catDelete should use deleteCat function from catModel
// catDelete should use validationResult to validate req.params.id
const catDelete = async (
  req: Request<{id: Cat}, {}, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req.params.id);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const id = Number(req.params.id);
    const result = await deleteCat(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {catListGet, catGet, catPost, catPut, catDelete};
