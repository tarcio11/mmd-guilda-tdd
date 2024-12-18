import { Db, MongoClient } from "mongodb";
import { CancelOrderRepository } from "@/domain/contracts/order";

export class MongoOrderRepository implements CancelOrderRepository {
  constructor(private readonly db: Db) {}

  async cancel(input: { orderId: string }): Promise<void> {
    const collection = this.db.collection('orders');
    await collection.updateOne({ orderId: input.orderId }, { $set: { status: 'cancelled' } });
  }
}

describe('MongoOrderRepository', () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    let global: any = globalThis;
    connection = await MongoClient.connect(global.__MONGO_URI__ as string);
    db = connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('cancel', () => {
    it('should cancel an order', async () => {
      await db.collection('orders').insertOne({ orderId: '1', status: 'pending' });
      const sut = new MongoOrderRepository(db);

      let order = await db.collection('orders').findOne({ orderId: '1' });
      expect(order?.status).toBe('pending');

      await sut.cancel({ orderId: '1' });

      order = await db.collection('orders').findOne({ orderId: '1' });
      expect(order?.status).toBe('cancelled');
    });

    it('should rethrow if cancel throws', async () => {
      const sut = new MongoOrderRepository(db);

      jest.spyOn(db, 'collection').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const promise = sut.cancel({ orderId: '1' });

      await expect(promise).rejects.toThrow();
    });
  });
});
