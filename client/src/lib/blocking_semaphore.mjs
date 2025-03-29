class BlockingSemaphore {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.free_slots = Array(concurrency).fill(true);
    this.wait_queue = []
  }

  _get_first_free_slot() {
    for (var i = 0; i < this.free_slots.length; i++) {
      if (this.free_slots[i]) {
        return i;
      }
    }
    return -1;
  }

  async _advance_queue() {
    if (this.wait_queue.length === 0) {
      return;
    }

    var resolve_wait = this.wait_queue.pop();
    resolve_wait();
    return;
  }

  async acquire() {
    var free_slot = this._get_first_free_slot();
    if (free_slot === -1) {
      const wait = new Promise((resolve, reject) => { this.wait_queue.push(resolve) });
      await wait;
      free_slot = this._get_first_free_slot();
    }

    console.assert(free_slot !== -1);
    return free_slot;
  }

  async async_call_with_slot(fn, slot) {
    if (!Number.isInteger(slot)) {
      throw new Error("Semaphore slots must be integers. Requested slot:", slot);
    }

    this.free_slots[slot] = false;
    try {
      var ret = await fn();
      return ret;
    } finally {
      this.free_slots[slot] = true;
      this._advance_queue();
    }
  }
}

export default BlockingSemaphore;
