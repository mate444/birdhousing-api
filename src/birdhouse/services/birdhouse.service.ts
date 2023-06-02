import { BirdhouseInterface, BirdhouseStatusEnum } from '../interfaces/birdhouse.interface';
import fsPromise from 'fs/promises';
import { Manager } from '../../database/connection';
import { Birdhouse } from '../entities/Birdhouse.entity';
import { Birdhouse_style } from '../../birdhouse/entities/Birdhouse_style.entity';
import { Birdhouse_color } from '../entities/Birdhouse_color.entity';
import { Birdhouse_picture } from '../entities/Birdhouse_picture.entity';
import { v4 as uuid } from 'uuid';
import { ILike } from 'typeorm';

export class BirdhouseService {
  entityManager = Manager;
  async create (data: BirdhouseInterface) {
    try {
      const birdhouseId = uuid();
      const entitesToSave = [];
      const createdBirdhouse = this.entityManager.create(Birdhouse, {
        birdhouseId,
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
        size: data.size,
        pictures: [],
        colors: [],
        styles: []
      });
      entitesToSave.push(createdBirdhouse);
      if (data.pictures) {
        for (let i = 0; i < data.pictures.length; i += 1) {
          const file = await fsPromise.readFile(data.pictures[i].path, 'binary');
          const createdPicture = this.entityManager.create(Birdhouse_picture, {
            picture: file
          });
          createdBirdhouse.pictures.push(createdPicture);
          entitesToSave.push(createdPicture);
          await fsPromise.unlink(data.pictures[i].path);
        }
      }
      for (let i = 0; i < data.styles.length; i += 1) {
        const createdStyle = this.entityManager.create(Birdhouse_style, {
          style: data.styles[i]
        });
        createdBirdhouse.styles.push(createdStyle);
        entitesToSave.push(createdStyle);
      }
      for (let i = 0; i < data.colors.length; i += 1) {
        const createdColor = this.entityManager.create(Birdhouse_color, {
          color: data.colors[i]
        });
        entitesToSave.push(createdColor);
        createdBirdhouse.colors.push(createdColor);
      }
      await this.entityManager.save(entitesToSave);
      return "Created";
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async getById (id: string) {
    try {
      const foundBirdhouse = await this.entityManager.findOne(Birdhouse, {
        where: {
          birdhouseId: id
        },
        relations: {
          pictures: true,
          colors: true,
          styles: true
        }
      });
      return foundBirdhouse;
    } catch (err) {
      throw new Error(err);
    }
  }

  async softDelete (id: string, status: BirdhouseStatusEnum) {
    try {
      const deletedBirdhouseResult = await this.entityManager.update(Birdhouse, { birdhouseId: id }, { status });
      if (deletedBirdhouseResult.affected < 1) return false;
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
      await this.entityManager.update(Birdhouse, { birdhouseId: data.birdhouseId }, {
        name: data.name,
        price: data.price,
        size: data.size,
        description: data.description,
        stock: data.stock
      });
      await this.entityManager.delete(Birdhouse_picture, { birdhouse: data.birdhouseId });
      for (let i = 0; i < data.pictures.length; i += 1) {
        this.entityManager.save(Birdhouse_picture, {
          picture: data.pictures[i]
        });
      }
      await this.entityManager.delete(Birdhouse_style, { birdhouse: data.birdhouseId });
      for (let i = 0; i < data.styles.length; i += 1) {
        this.entityManager.save(Birdhouse_style, {
          style: data.styles[i]
        });
      }
      await this.entityManager.delete(Birdhouse_color, { birdhouse: data.birdhouseId });
      for (let i = 0; i < data.colors.length; i += 1) {
        this.entityManager.save(Birdhouse_color, {
          color: data.colors[i]
        });
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAll (search: string | undefined, sort: string | undefined, page: number) {
    try {
      const numItems = 10;
      const totalCount = await this.entityManager.count(Birdhouse);
      const totalPages = Math.ceil(totalCount / numItems);
      if (!sort) {
        const foundBirdhouses = await this.entityManager.find(Birdhouse, {
          select: {
            name: true,
            price: true,
            stock: true,
            size: true,
            styles: true,
            colors: true,
            pictures: true
          },
          where: {
            name: ILike(`%${search}%`)
          },
          skip: (page - 1) * numItems,
          take: numItems
        });
        return { data: foundBirdhouses, totalPages };
      }

      if (sort.length > 0) {
        const sortType = this.getSortType(sort);
        const foundBirdhouses = await this.entityManager.find(Birdhouse, {
          select: {
            name: true,
            price: true,
            stock: true,
            size: true,
            styles: true,
            colors: true,
            pictures: true
          },
          where: {
            name: ILike(`%${search}%`)
          },
          skip: (page - 1) * numItems,
          take: numItems,
          order: {
            [sortType.field]: sortType.sortType
          }
        });
        return { data: foundBirdhouses, totalPages };
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  getSortType (sortType: string): { field:string, sortType: string } {
    switch (sortType) {
      case 'price_asc':
        return {
          field: 'price',
          sortType: 'ASC'
        };
      case 'price_desc':
        return {
          field: 'price',
          sortType: 'DESC'
        };
      case 'name_asc':
        return {
          field: 'name',
          sortType: 'ASC'
        };
      case 'name_desc':
        return {
          field: 'name',
          sortType: 'DESC'
        };
      case 'size_asc':
        return {
          field: 'size',
          sortType: 'ASC'
        };
      case 'size_desc':
        return {
          field: 'size',
          sortType: 'DESC'
        };
    }
  }
}
