import BlockingSemaphore from "./blocking_semaphore.mjs"


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test() {
  console.log("Starting test!")
  var semaphore = new BlockingSemaphore(2);

  const start = Date.now();

  async function f() {
    await sleep(1000);
    return "return_val";
  }


  var slot = null;
  var r = null;

  slot = await semaphore.acquire()
  r = semaphore.async_call_with_slot(f, slot)
  console.log("1 at:", Date.now() - start);

  slot = await semaphore.acquire()
  r = semaphore.async_call_with_slot(f, slot)
  console.log("2 at:", Date.now() - start);

  slot = await semaphore.acquire()
  r = semaphore.async_call_with_slot(f, slot)
  console.log("3 at:", Date.now() - start);
}

await test();

async function test_exception_safe() {
  console.log("Starting exception safe test!")
  var semaphore = new BlockingSemaphore(1);

  const start = Date.now();

  async function f() {
    throw("exception");
  }


  var slot = null;
  var r = null;

  slot = await semaphore.acquire()
  await semaphore.async_call_with_slot(f, slot).catch((e) => {});

  slot = await semaphore.acquire()
  await semaphore.async_call_with_slot(f, slot).catch((e) => {});

  slot = await semaphore.acquire()
  await semaphore.async_call_with_slot(f, slot).catch((e) => {});
}

await test_exception_safe();

async function test_non_int_slot() {
  console.log("Starting non int test")
  var semaphore = new BlockingSemaphore(1);

  const start = Date.now();

  async function f() {
    return;
  }

  var exceptions = 0;
  await semaphore.async_call_with_slot(f, 0.5).catch((e) => {exceptions += 1;});
  await semaphore.async_call_with_slot(f, "a str slot").catch((e) => {exceptions += 1;});

  console.log("Caught", exceptions, "attempts to call with non-int slot.");
}

await test_non_int_slot();
