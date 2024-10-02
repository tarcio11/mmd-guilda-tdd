import { User } from "../entities/user";

export interface GetUserRepository {
  getOne: (input: { userId: string }) => Promise<User | undefined>;
}
