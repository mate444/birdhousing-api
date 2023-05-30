import pool from '../../database/pool';
import { BirdhouseInterface } from '../interfaces/birdhouse.interface';
import { v4 as uuid } from 'uuid';
import fsPromise from 'fs/promises';

export class BirdhouseService {
  async create (data: BirdhouseInterface) {
    try {
      const status = 'active';
      const birdhouseId = uuid();
      const promisePool = pool.promise();
      await promisePool.query(`INSERT INTO birdhouse (birdhouseId,
        name,
        price,
        description,
        status,
        stock,
        size) VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [birdhouseId,
        data.name,
        data.price,
        data.description,
        status,
        data.stock,
        data.size
      ]);

      if (data.pictures) {
        for (let i = 0; i < data.pictures.length; i += 1) {
          const file = await fsPromise.readFile(data.pictures[i].path, 'binary');
          await promisePool.query(`INSERT into birdhouse_picture (birdhouseId, picture) VALUES(?, ?)`,
            [birdhouseId, file]);
          await fsPromise.unlink(data.pictures[i].path);
        }
      }
      for (let i = 0; i < data.styles.length; i += 1) {
        await promisePool.query(`INSERT into birdhouse_style (birdhouseId, style) VALUES(?, ?)`,
          [birdhouseId, data.styles[i]]);
      }
      for (let i = 0; i < data.colors.length; i += 1) {
        await promisePool.query(`INSERT into birdhouse_color (birdhouseId, color) VALUES(?, ?)`,
          [birdhouseId, data.colors[i]]);
      }

      return "Created";
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
