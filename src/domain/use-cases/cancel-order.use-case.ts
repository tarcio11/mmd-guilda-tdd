import { GetUserRepository } from "../contracts/user";
import { CancelOrderRepository } from "../contracts/order";
import { UseCase } from "./use-case";

export class CancelOrderUseCase implements UseCase<{ userId: string; orderId: string }, void> {
  constructor(
    private readonly orderRepository: GetUserRepository,
    private readonly cancelOrderRepository: CancelOrderRepository
  ) {}

  async execute(input: { userId: string; orderId: string }) {
    const user = await this.orderRepository.getOne({ userId: input.userId });
    if (!user?.canCancelOrder()) throw new Error()
    await this.cancelOrderRepository.cancel({ orderId: input.orderId });
  }
}
