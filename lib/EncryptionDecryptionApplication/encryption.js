/*
All the pair sets below are completely different from
one another. Although, they all work with binary data
but the [way, purpose and application] is completely
different from each other.

// encryption / decryption => crypto module
// hashing - salting => crypto module
// compression / decompression => zlib module
// encoding / decoding => buffer text-encoding/decoding {prefer C/C++/Rust/Python/npm libs, no native Node package}
*/

const { Transform } = require("node:stream");
const fs = require("node:fs/promises");


class Encrypt extends  Transform {
  _transform(chunk, encoding, callback) {

    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 255) ++chunk[i];

    }

    // You could either use this.push(chunk) or callback(chunk)
    // this.push(chunk) only writes 64 * 1024 Bytes of 64 KB
    // Callback writes the entire thing at once
    // this.push(chunk);
    callback(null, chunk);
  }
}

(async () => {
  const readFileHandle = await fs.open("read.txt", 'r');
  const writeFileHandle = await fs.open("encrypted.txt", 'w');

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  readStream.pipe(new Encrypt()).pipe(writeStream);
}) ()

