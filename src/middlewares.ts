/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from 'express';
import sharp from 'sharp';
import {ExifImage} from 'exif';
import {ErrorResponse} from './types/MessageTypes';
import CustomError from './classes/CustomError';
// import chalk from 'chalk';

// convert GPS coordinates to decimal format
// for longitude, send exifData.gps.GPSLongitude, exifData.gps.GPSLongitudeRef
// for latitude, send exifData.gps.GPSLatitude, exifData.gps.GPSLatitudeRef
const gpsToDecimal = (gpsData: number[], hem: string) => {
  let d = gpsData[0] + gpsData[1] / 60 + gpsData[2] / 3600;
  return hem === 'S' || hem === 'W' ? (d *= -1) : d;
};

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  // console.error('errorHandler', chalk.red(err.stack));
  res.status(err.status || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const getCoordinates = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.file?.path);
    // coordinates below should be an array of GPS coordinates in decimal format: [longitude, latitude]
    new ExifImage({image: req.file?.path}, (error, exifData) => {
      if (error) {
        console.log('eka', error);
        res.locals.coords = [60, 24];
        next();
      } else {
        // console.log('exif data', exifData);
        try {
          const lon = gpsToDecimal(
            exifData.gps.GPSLongitude || [0, 0, 0],
            exifData.gps.GPSLongitudeRef || 'N'
          );
          const lat = gpsToDecimal(
            exifData.gps.GPSLatitude || [0, 0, 0],
            exifData.gps.GPSLatitudeRef || 'E'
          );
          const coordinates = [lat, lon];
          res.locals.coords = coordinates;
          next();
        } catch (err) {
          console.log('toka', err);
          res.locals.coords = [60, 24];
          next();
        }
      }
    });
  } catch (error) {
    console.log('kolmas', error);
    res.locals.coords = [60, 24];
    next();
  }
};

const makeThumbnail = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.file?.path);
    await sharp(req.file?.path)
      .resize(160, 160)
      .png()
      .toFile(req.file?.path + '_thumb');
    next();
  } catch (error) {
    next(new CustomError('Thumbnail not created', 500));
  }
};

export {notFound, errorHandler, getCoordinates, makeThumbnail};
