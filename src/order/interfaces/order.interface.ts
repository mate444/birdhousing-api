export enum OrderStatusEnum {
  canceled = "canceled",
  pendingConfirmation = "pending confirmation",
  completed = "completed",
  pending = "pending"
};

export interface IOrder {
  id: string;
  updatedAt: string;
  createdAt: string;
  status: OrderStatusEnum;
  price: number;
  calculatedArrival: string;
  birdhouses: [{ id: string, amount: number }];
  amount: number;
  userId: string;
}
