class CancelOrderUseCase {
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

interface GetUserRepository {
  getOne: (input: { userId: string }) => Promise<User | undefined>;
}

interface CancelOrderRepository {
  cancel: (input: { orderId: string }) => Promise<void>;
}

type Permission = 'crmo' | 'doctor' | 'admin' | 'patient'

class User {
  userId: string;
  permission: Permission

  constructor (userId: string, permission: Permission) {
    this.userId = userId
    this.permission = permission
  }

  canCancelOrder () {
    return this.permission === 'crmo' || this.permission === 'admin'
  }
};

class GetUserRepositoryMock implements GetUserRepository {
  input?: { userId: string };
  output?: User = new User('any_user_id', 'crmo');

  async getOne(input: { userId: string }): Promise<User | undefined> {
    this.input = input;
    return Promise.resolve(this.output);
  }
}

class CancelOrderRepositoryMock implements CancelOrderRepository {
  input?: { orderId: string };

  async cancel(input: { orderId: string }): Promise<void> {
    this.input = input;
  }
}

type SutTypes = {
  sut: CancelOrderUseCase;
  getUserRepositoryMock: GetUserRepositoryMock;
  cancelOrderRepositoryMock: CancelOrderRepositoryMock;
};

const makeSut = (): SutTypes => {
  const getUserRepositoryMock = new GetUserRepositoryMock();
  const cancelOrderRepositoryMock = new CancelOrderRepositoryMock();
  const sut = new CancelOrderUseCase(
    getUserRepositoryMock,
    cancelOrderRepositoryMock
  );
  return {
    sut,
    getUserRepositoryMock,
    cancelOrderRepositoryMock,
  };
};

describe('CancelOrderUseCase', () => {
  it('should call GetUserRepository with correct input', async () => {
    const { sut, getUserRepositoryMock } = makeSut();
    await sut.execute({ userId: 'any_user_id', orderId: 'any_order_id' });
    expect(getUserRepositoryMock.input).toEqual({ userId: 'any_user_id' });
  });

  it('should throw if GetUserRepository returns undefined', async () => {
    const { sut, getUserRepositoryMock } = makeSut();
    getUserRepositoryMock.output = undefined;

    const promise = sut.execute({
      userId: 'any_user_id',
      orderId: 'any_order_id',
    });

    await expect(promise).rejects.toThrow();
  });

  it('should throw if user permission is patient', async () => {
    const { sut, getUserRepositoryMock } = makeSut();
    getUserRepositoryMock.output = new User(
      'any_user_id',
      'patient',
    );

    const promise = sut.execute({
      userId: 'any_user_id',
      orderId: 'any_order_id',
    });

    await expect(promise).rejects.toThrow();
  });

  it('should throw if user permission is doctor', async () => {
    const { sut, getUserRepositoryMock } = makeSut();
    getUserRepositoryMock.output = new User('any_user_id','doctor');

    const promise = sut.execute({
      userId: 'any_user_id',
      orderId: 'any_order_id',
    });

    await expect(promise).rejects.toThrow();
  });

  it('should not throw if user permission is crmo', async () => {
    const { sut, getUserRepositoryMock } = makeSut();
    getUserRepositoryMock.output = new User('any_user_id','crmo');

    const promise = sut.execute({
      userId: 'any_user_id',
      orderId: 'any_order_id',
    });

    await expect(promise).resolves.not.toThrow();
  });

  it('should not throw if user permission is admin', async () => {
    const { sut, getUserRepositoryMock } = makeSut();
    getUserRepositoryMock.output = new User('any_user_id','admin');

    const promise = sut.execute({
      userId: 'any_user_id',
      orderId: 'any_order_id',
    });

    await expect(promise).resolves.not.toThrow();
  });

  it('should call CancelOrderRepository with correct input', async () => {
    const { sut, cancelOrderRepositoryMock } = makeSut();
    await sut.execute({ userId: 'any_user_id', orderId: 'any_order_id' });
    expect(cancelOrderRepositoryMock.input).toEqual({
      orderId: 'any_order_id',
    });
  });

  it('should throw if CancelOrderRepository throws', async () => {
    const { sut, cancelOrderRepositoryMock } = makeSut();
    jest
      .spyOn(cancelOrderRepositoryMock, 'cancel')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const promise = sut.execute({
      userId: 'any_user_id',
      orderId: 'any_order_id',
    });

    await expect(promise).rejects.toThrow();
  });
});
