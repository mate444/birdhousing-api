import { query } from '../../common/createQuery';
import { BirdhouseInterface, BirdhouseStatusEnum } from '../interfaces/birdhouse.interface';
import { v4 as uuid } from 'uuid';
import fsPromise from 'fs/promises';

export class BirdhouseService {
  SQLQuery = query;
  async create (data: BirdhouseInterface) {
    try {
      const status = 'active';
      const birdhouseId = uuid();
      await this.SQLQuery(`INSERT INTO birdhouse (birdhouseId,
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
          await this.SQLQuery(`INSERT into birdhouse_picture (birdhouseId, picture) VALUES(?, ?)`,
            [birdhouseId, file]);
          await fsPromise.unlink(data.pictures[i].path);
        }
      }
      for (let i = 0; i < data.styles.length; i += 1) {
        await this.SQLQuery(`INSERT into birdhouse_style (birdhouseId, style) VALUES(?, ?)`,
          [birdhouseId, data.styles[i]]);
      }
      for (let i = 0; i < data.colors.length; i += 1) {
        await this.SQLQuery(`INSERT into birdhouse_color (birdhouseId, color) VALUES(?, ?)`,
          [birdhouseId, data.colors[i]]);
      }

      return "Created";
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async getById (id: string) {
    try {
      const foundBirdhouse = await this.SQLQuery(`SELECT
        name, price, description, stock, size, color, picture, style
        FROM birdhouse
        INNER JOIN birdhouse_color ON birdhouse_color.birdhouseId = birdhouse.birdhouseId
        INNER JOIN birdhouse_style ON birdhouse_style.birdhouseId = birdhouse.birdhouseId
        INNER JOIN birdhouse_picture ON birdhouse_picture.birdhouseId = birdhouse.birdhouseId
        WHERE birdhouse.birdhouseId = ?`, [id]);
      return foundBirdhouse[0][0];
    } catch (err) {
      throw new Error(err);
    }
  }

  async softDelete (id: string, status: BirdhouseStatusEnum) {
    try {
      const deletedBirdhouseResult = await this.SQLQuery(`UPDATE birdhouse 
      SET status = ?
      WHERE birdhouseId = ?`, [status, id]);
      if (deletedBirdhouseResult.affectedRows === 0) {
        return false;
      }
      if (status === 'inactive') {
        return 'Deleted';
      }
      if (status === 'active') {
        return "Restored";
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async update (data: BirdhouseInterface) {
    try {
      await this.SQLQuery(`UPDATE birdhouse SET
        name = ?,
        price = ?,
        stock = ?,
        size = ?,
        description = ?
        WHERE birdhouseId = ?`, [data.name,
        data.price,
        data.stock,
        data.size,
        data.description,
        data.birdhouseId
      ]);

      await this.SQLQuery(`DELETE from birdhouse_picture WHERE birdhouseId = ?`, [data.birdhouseId]);
      for (let i = 0; i < data.pictures.length; i += 1) {
        await this.SQLQuery(`INSERT INTO birdhouse_picture(birdhouseId, picture) VALUES(?, ?)`, [data.birdhouseId,
          data.pictures[i]]);
      }
      await this.SQLQuery(`DELETE from birdhouse_style WHERE birdhouseId = ?`, [data.birdhouseId]);
      for (let i = 0; i < data.styles.length; i += 1) {
        await this.SQLQuery(`INSERT INTO birdhouse_style(birdhouseId, style) VALUES(?, ?)`, [data.birdhouseId,
          data.styles[i]]);
      }
      await this.SQLQuery(`DELETE from birdhouse_color WHERE birdhouseId = ?`, [data.birdhouseId]);
      for (let i = 0; i < data.colors.length; i += 1) {
        await this.SQLQuery(`INSERT INTO birdhouse_color(birdhouseId, color) VALUES(?, ?)`, [data.birdhouseId,
          data.colors[i]]);
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
}
