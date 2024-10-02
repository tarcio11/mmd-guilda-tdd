export interface CancelOrderRepository {
  cancel: (input: { orderId: string }) => Promise<void>;
}
