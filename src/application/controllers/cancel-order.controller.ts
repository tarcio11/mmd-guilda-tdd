import { UseCase } from "@/domain/use-cases/use-case";

export class CancelOrderController {
  constructor(private readonly useCase: UseCase) {}

  async execute(input: { userId: string; orderId: string }) {
    try {
      if (input.userId === null || input.userId === undefined || input.userId === '') {
        return {
          statusCode: 400,
          data: {
            error: 'Missing param: userId'
          }
        }
      }
      if (input.orderId === null || input.orderId === undefined || input.orderId === '') {
        return {
          statusCode: 400,
          data: {
            error: 'Missing param: orderId'
          }
        }
      }
      await this.useCase.execute({ userId: input.userId, orderId: input.orderId });
      return {
        statusCode: 200,
        data: {}
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: {
          error: 'Internal server error'
        }
      }
    }
  }
}

type Input = {
  userId: string;
  orderId: string;
}
