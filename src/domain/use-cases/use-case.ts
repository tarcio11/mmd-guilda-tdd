export interface UseCase<Input = any, Output = any> {
  execute: (input: Input) => Promise<Output>;
}

