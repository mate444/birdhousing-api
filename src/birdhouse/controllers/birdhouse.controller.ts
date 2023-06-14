import { Router, Request, NextFunction, Response } from "express";
import { validate } from 'class-validator';
import { CreateBirdhouseDto, DeleteBirdhouseDto, UpdateBirdhouseDto } from "../dtos/birdhouse.dto";
import { BirdhouseService } from "../services/birdhouse.service";
import { isAdmin } from "../../middleware/auth";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/', isAdmin, upload.array('pictures', 9), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { size, price, name, description, stock, styles } = req.body;
    const pictures = req.files;
    const birdhouseDto = new CreateBirdhouseDto();
    birdhouseDto.size = parseInt(size);
    birdhouseDto.price = parseInt(price);
    birdhouseDto.description = description;
    birdhouseDto.stock = parseInt(stock);
    birdhouseDto.pictures = pictures;
    birdhouseDto.styles = styles;
    birdhouseDto.name = name;
    const errors = await validate(birdhouseDto);
    if (errors.length) {
      return res.status(400).send(errors);
    }
    const birdhouseService = new BirdhouseService();
    const result = await birdhouseService.create(req.body);
    res.status(201).send(result);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { id } = req.params;
    const birdhouseService = new BirdhouseService();
    const foundBirdhouse = await birdhouseService.getById(id);
    if (!foundBirdhouse) {
      return res.sendStatus(404);
    }
    res.send(foundBirdhouse);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

router.delete('/', isAdmin, async (req:Request, res: Response, next: NextFunction) => {
  try {
    const { birdhouseId, status } = req.body;
    const birdHouseDto = new DeleteBirdhouseDto();
    birdHouseDto.birdhouseId = birdhouseId;
    birdHouseDto.status = status;
    const errors = await validate(birdHouseDto);
    if (errors.length) {
      return res.status(400).send(errors);
    }
    const birdhouseService = new BirdhouseService();
    const deletedBirdhouse = await birdhouseService.softDelete(birdhouseId, status);
    if (!deletedBirdhouse) return res.sendStatus(404);
    res.send(deletedBirdhouse);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

router.patch('/', isAdmin, async (req:Request, res:Response, next: NextFunction) => {
  try {
    const { birdhouseId, size, price, name, description, stock, styles } = req.body;
    const pictures = req.files;
    const birdhouseDto = new UpdateBirdhouseDto();
    birdhouseDto.birdhouseId = birdhouseId;
    birdhouseDto.size = size;
    birdhouseDto.price = price;
    birdhouseDto.description = description;
    birdhouseDto.stock = stock;
    birdhouseDto.pictures = pictures;
    birdhouseDto.styles = styles;
    birdhouseDto.name = name;
    const errors = await validate(birdhouseDto);
    if (errors.length) {
      return res.status(400).send(errors);
    }
    const birdhouseService = new BirdhouseService();
    const updatedBirdhouse = await birdhouseService.update(req.body);
    res.send(updatedBirdhouse);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

router.get('/', async (req:Request, res:Response) => {
  try {
    let { sort, page, search } = req.query;
    if (page === 'undefined') page = undefined;
    if (sort === 'undefined') sort = undefined;
    if (search === 'undefined') search = undefined;
    if (!page) return res.status(400).send('Page is required');
    const birdhouseService = new BirdhouseService();
    const birdhouses = await birdhouseService.getAll(search, sort, parseInt(`${page}`));
    res.send(birdhouses);
  } catch (err) {
    console.log(err.message, err.stack);
    res.sendStatus(500);
  }
});

export default router;
