export function random(lower = 0, upper = 1, floating = false): number {
    let value = lower + cryptoRand() * upper;
    if (!floating) {
        value = Math.trunc(value);
    }
    return value;
}

const crypto = typeof window === 'undefined' ? require('crypto') : window.crypto;

const cryptoRand = typeof window === 'undefined'
    ? (): number => {
        const buf = crypto.randomBytes(4);
        const dataView = new DataView(toArrayBuffer(buf));

        const uint = dataView.getUint32(0);
        return uint / (0xffffffff + 1); // 0xFFFFFFFF = uint32.MaxValue (+1 because Math.random is inclusive of 0, but not 1)
    } : (): number => {
        const array = new Int8Array(4);
        (crypto as typeof window.crypto).getRandomValues(array);
        const dataView = new DataView(array.buffer);

        const uint = dataView.getUint32(0);
        return uint / (0xffffffff + 1); // 0xFFFFFFFF = uint32.MaxValue (+1 because Math.random is inclusive of 0, but not 1)
    };

function toArrayBuffer(buf: Buffer): ArrayBuffer {
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}
