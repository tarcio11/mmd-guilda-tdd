import { UseCase } from "@/domain/use-cases/use-case";
import { mock, MockProxy } from 'jest-mock-extended'

export class CancelOrderController {
  constructor(
    private readonly useCase: UseCase,
  ) {}

  async execute(input: { userId: string; orderId: string }) {
    await this.useCase.execute({ userId: input.userId, orderId: input.orderId });
  }
}

describe('CancelOrderController', () => {
  let cancelOrderUseCase: MockProxy<UseCase>;
  let sut: CancelOrderController;

  beforeEach(() => {
    cancelOrderUseCase = mock();
    sut = new CancelOrderController(cancelOrderUseCase);
  });

  it('should be able to cancel an order', async () => {
    await sut.execute({ userId: 'any_user_id_input', orderId: 'any_order_id_input' });

    expect(cancelOrderUseCase.execute).toHaveBeenCalledWith({ userId: 'any_user_id_input', orderId: 'any_order_id_input' });
  });
});
