import { Router, Request, NextFunction, Response } from "express";
import { validate } from 'class-validator';
import { CreateBirdhouseDto } from "../dtos/birdhouse.dto";
import { BirdhouseService } from "../services/birdhouse.service";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/', upload.array('pictures', 9), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { colors, size, price, name, description, stock, styles } = req.body;
    const pictures = req.files;
    const birdhouseDto = new CreateBirdhouseDto();
    birdhouseDto.colors = colors;
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
    const result = await birdhouseService.create(req.body);
    res.status(201).send(result);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { id } = req.params;
    const birdhouseService = new BirdhouseService();
    const foundBirdhouse = await birdhouseService.getById(id);
    if (foundBirdhouse.length < 1) {
      return res.sendStatus(404);
    }
    res.send(foundBirdhouse);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

export default router;
