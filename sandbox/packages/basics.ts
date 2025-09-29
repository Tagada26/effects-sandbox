import { Effect } from 'effect';

//1. Handle success

export const myFirstFunctionWithEffect = (): Effect.Effect<
  number,
  never,
  never
> => {
  const success = Effect.succeed(42);
  return success;
};

//2. Errors tracking

const divide = (a: number, b: number): Effect.Effect<number, Error> =>
  b === 0
    ? Effect.fail(new Error('Cannot divide by zero'))
    : Effect.succeed(a / b);

// link to error management guide https://effect.website/docs/error-management/expected-errors/

// 3. Modeling Synchronous Effects

const parse = (input: string) =>
  Effect.try({
    // JSON.parse may throw for bad input
    try: () => JSON.parse(input),
    // remap the error
    catch: (unknown) => new Error(`something went wrong ${unknown}`),
  });

//      ┌─── Effect<any, Error, never>
//      ▼
const program = parse('');

// 4. Modeling Asynchronous Effects

//Use Effect.promise when you are sure the operation will not reject.
// Error => defect => handle asa defect is not a standard error but indicates a flaw in the logic that was expected to be error-free.
// You can think of it similar to an unexpected crash in the program, which can be further managed or logged using tools like Effect.catchAllDefect.

const delay = (message: string) =>
  Effect.promise<string>(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(message);
        }, 2000);
      })
  );

//      ┌─── Effect<string, never, never>
//      ▼
const program4 = delay('Async operation completed successfully!');

//Asynchronous code with possible errors
//With try promise we could customize errors message

const getTodo = (id: number) =>
  Effect.tryPromise({
    try: () => fetch(`https://jsonplaceholder.typicode.com/todos/${id}`),
    // remap the error
    catch: (unknown) => new Error(`something went wrong ${unknown}`),
  });

//      ┌─── Effect<Response, Error, never>
//      ▼
const program2 = getTodo(1);

// API	Given	Result
// succeed	      A	                    Effect<A>
// fail           E	                    Effect<never, E>
// sync	          () => A	              Effect<A>
// try	          () => A	              Effect<A, UnknownException>
// try (overload)	() => A, unknown => E	Effect<A, E>
// promise	      () => Promise<A>	    Effect<A>
// tryPromise	    () => Promise<A>	    Effect<A, UnknownException>
// tryPromise     (overload)	() => Promise<A>, unknown => E	Effect<A, E>
// async	        (Effect<A, E> => void) => void	            Effect<A, E>
// suspend	      () => Effect<A, E, R>	                      Effect<A, E, R>

// link to other effect constructor https://effect-ts.github.io/effect/effect/Effect.ts.html#constructors
