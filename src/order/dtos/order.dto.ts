import {
  IsInt,
  IsUUID,
  IsNumber,
  ValidateNested
} from "class-validator";

class OrderBirdhouse {
  @IsUUID(4, { message: "Birdhouse id must be a V4 UUID" })
    id: string;

  @IsInt({ message: "Birdhouse amount must be a number" })
    amount: number;
}

export class CreateOrderDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Order price must be number' })
    price: number;

  @ValidateNested({ each: true })
    birdhouses: OrderBirdhouse[];

  @IsUUID(4, { message: "User id must be a V4 UUID" })
    userId: string;
}
