// Key steps to follow when using Effect.gen:

// 1. Wrap your logic in Effect.gen
// 2. Use yield* to handle effects. => * means sync or async code
// 3. Return the final result

//When working with Effect.gen, it is important to understand how it handles errors.
//This API will stop execution at the **first error** it encounters and return that error.

//Example :)

import { Effect, Console } from 'effect';

const task1 = Console.log('task1...');
const task2 = Console.log('task2...');
const failure = Effect.fail('Something went wrong!');
const task4 = Console.log('task4...');

const program = Effect.gen(function* () {
  yield* task1;
  yield* task2;
  // The program stops here due to the error
  yield* failure;
  // The following lines never run
  yield* task4;
  return 'some result';
});

Effect.runPromise(program).then(console.log, console.error);
/*
Output:
task1...
task2...
(FiberFailure) Error: Something went wrong!
*/

//Even though execution never reaches code after a failure, TypeScript may still assume that the code below the error is reachable unless you explicitly return after the failure.
//Just return in that case
