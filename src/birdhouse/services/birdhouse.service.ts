import { BirdhouseInterface, BirdhouseStatusEnum } from '../interfaces/birdhouse.interface';
import { Manager } from '../../database/connection';
import { Birdhouse } from '../entities/Birdhouse.entity';
import { Birdhouse_style } from '../../birdhouse/entities/Birdhouse_style.entity';
import { Birdhouse_picture } from '../entities/Birdhouse_picture.entity';
import { v4 as uuid } from 'uuid';
import { ILike } from 'typeorm';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { firebaseConfig } from '../../config/firebase';
import { initializeApp } from 'firebase/app';
initializeApp(firebaseConfig);
const storage = getStorage();
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
        styles: []
      });
      entitesToSave.push(createdBirdhouse);
      for (let i = 0; i < data.pictures.length; i += 1) {
        const picture = data.pictures[i];
        // Firebase image upload
        const storageRef = ref(storage, `files/${picture.originalname}/${uuid()}`);
        const metadata = {
          contentType: picture.mimetype
        };
        const snapshot = await uploadBytesResumable(storageRef, picture.buffer, metadata);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        const createdPicture = this.entityManager.create(Birdhouse_picture, {
          picture: downloadUrl
        });
        createdBirdhouse.pictures.push(createdPicture);
        entitesToSave.push(createdPicture);
      }
      for (let i = 0; i < data.styles.length; i += 1) {
        const createdStyle = this.entityManager.create(Birdhouse_style, {
          style: data.styles[i]
        });
        createdBirdhouse.styles.push(createdStyle);
        entitesToSave.push(createdStyle);
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
      const foundBirdhouse = await this.entityManager.findOne(Birdhouse, {
        where: {
          birdhouseId: data.birdhouseId
        }
      });
      await this.entityManager.delete(Birdhouse_style, { birdhouse: data.birdhouseId });
      for (let i = 0; i < data.styles.length; i += 1) {
        const updatedStyle = this.entityManager.create(Birdhouse_style, {
          style: data.styles[i]
        });
        updatedStyle.birdhouse = foundBirdhouse;
        await this.entityManager.save(updatedStyle);
      }
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAll (search: any, sort: any, page: number) {
    try {
      const numItems = 12;
      const totalCountOptions = search
        ? {
            where: {
              name: ILike(`%${search}%`)
            }
          }
        : {};
      const totalCount = await this.entityManager.count(Birdhouse, totalCountOptions);
      const totalPages = Math.ceil(totalCount / numItems);
      const findOptions = {
        relations: ['styles', 'pictures'],
        skip: (page - 1) * numItems,
        take: numItems
      };
      if (search) {
        findOptions["where"] = {
          name: ILike(`%${search}%`)
        };
      }
      if (sort && sort.length > 0) {
        const sortType = this.getSortType(sort);
        findOptions["order"] = {
          [sortType.field]: sortType.sortType
        };
      }
      const foundBirdhouses = await this.entityManager.find(Birdhouse, findOptions);
      foundBirdhouses.forEach((b) => {
      });
      return { data: foundBirdhouses, totalPages };
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
