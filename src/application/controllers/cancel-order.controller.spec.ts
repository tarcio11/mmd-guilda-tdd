import { CancelOrderUseCase } from "@/domain/use-cases/cancel-order.use-case";
import { mock, MockProxy } from 'jest-mock-extended'

export class CancelOrderController {
  constructor(
    private readonly useCase: CancelOrderUseCase,
  ) {}

  async execute(input: { userId: string; orderId: string }) {
    await this.useCase.execute({ userId: input.userId, orderId: input.orderId });
  }
}

describe('CancelOrderController', () => {
  let cancelOrderUseCase: MockProxy<CancelOrderUseCase>;
  let sut: CancelOrderController;

  beforeEach(() => {
    cancelOrderUseCase = mock();
    sut = new CancelOrderController(cancelOrderUseCase);
  });

  it('should be able to cancel an order', async () => {
    await sut.execute({ userId: 'any_user_id', orderId: 'any_order_id' });
    expect(cancelOrderUseCase.execute).toHaveBeenCalledWith({ userId: 'any_user_id', orderId: 'any_order_id' });
  });
});
