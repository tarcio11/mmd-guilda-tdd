import { UseCase } from "@/domain/use-cases/use-case";
import { mock, MockProxy } from 'jest-mock-extended'
import { CancelOrderController } from "@/application/controllers/cancel-order.controller";

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

  it('should 400 if userId is null', async () => {
    const response = await sut.execute({ userId: null as any, orderId: 'any_order_id_input' });

    expect(response?.statusCode).toBe(400);
    expect(response?.data.error).toBe('Missing param: userId');
  });

  it('should 400 if userId is not provided', async () => {
    const response = await sut.execute({ userId: undefined as any, orderId: 'any_order_id_input' });

    expect(response?.statusCode).toBe(400);
    expect(response?.data.error).toBe('Missing param: userId');
  });

  it('should 400 if userId is empty', async () => {
    const response = await sut.execute({ userId: '', orderId: null as any });

    expect(response?.statusCode).toBe(400);
    expect(response?.data.error).toBe('Missing param: userId');
  });

  it('should 400 if orderId is null', async () => {
    const response = await sut.execute({ userId: 'any_user_id', orderId: null as any });

    expect(response?.statusCode).toBe(400);
    expect(response?.data.error).toBe('Missing param: orderId');
  });

  it('should 400 if orderId is not provided', async () => {
    const response = await sut.execute({ userId: 'any_user_id', orderId: undefined as any });

    expect(response?.statusCode).toBe(400);
    expect(response?.data.error).toBe('Missing param: orderId');
  });

  it('should 400 if orderId is empty', async () => {
    const response = await sut.execute({ userId: 'any_user_id', orderId: '' });

    expect(response?.statusCode).toBe(400);
    expect(response?.data.error).toBe('Missing param: orderId');
  });

  it('should 200 if success', async () => {
    const response = await sut.execute({ userId: 'any_user_id', orderId: 'any_order_id' });

    expect(response?.statusCode).toBe(200);
  });

  it('should throws if useCase throws', async () => {
    cancelOrderUseCase.execute.mockRejectedValue(new Error('any_error'));

    const response = await sut.execute({ userId: 'any_user_id', orderId: 'any_order_id' });

    expect(response?.statusCode).toBe(500);
    expect(response?.data.error).toBe('Internal server error');
  });
});
