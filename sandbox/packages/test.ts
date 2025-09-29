import { Effect } from 'effect';

export const myFirstFunctionWithEffect = (): Effect.Effect<
  number,
  never,
  never
> => {
  const success = Effect.succeed(42);
  return success;
};
