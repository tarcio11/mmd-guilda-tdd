import { Db, Document, MongoClient, ObjectId, WithId } from "mongodb";
import { User } from "@/domain/entities/user";
import { GetUserRepository } from "@/domain/contracts/user";

export class MongoUserRepository implements GetUserRepository {
  constructor(private readonly db: Db) {}

  async getOne(input: { userId: string }): Promise<User | undefined> {
    const collection = this.db.collection('users');
    const user = await collection.findOne({ userId: input.userId });
    return user ? this.serialize(user) : undefined;
  }

  private async serialize(user: WithId<Document>): Promise<User> {
    return new User(user.userId, user.permission);
  }
}

describe('MongoUserRepository', () => {
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

  describe('getOne', () => {
    it('should return a user if exists', async () => {
      await db.collection('users').insertOne({ userId: '1', permission: 'admin' });
      const sut = new MongoUserRepository(db);

      const user = await sut.getOne({ userId: '1' });

      expect(user).toBeInstanceOf(User);
      expect(user?.userId).toBe('1');
      expect(user?.permission).toBe('admin');
    });

    it('should return undefined if user does not exist', async () => {
      const sut = new MongoUserRepository(db);

      const user = await sut.getOne({ userId: '2' });

      expect(user).toBeUndefined();
    });

    it('should rethrow if getOne throws', async () => {
      const sut = new MongoUserRepository(db);

      jest.spyOn(db, 'collection').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const promise = sut.getOne({ userId: '1' });

      await expect(promise).rejects.toThrow();
    });
  });
});
