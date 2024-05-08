const {Transform} = require("node:stream");
const fs = require("node:fs/promises");

class Decrypt extends  Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 255) --chunk[i];
    }

    // You could either use this.push(chunk) or callback(chunk)
    // this.push(chunk) only writes 64 * 1024 Bytes of 64 KB
    // Callback writes the entire thing at once
    // this.push(chunk);
    callback(null, chunk)
  }
}

(async () => {
  const readFileHandle = await fs.open("encrypted.txt", 'r');
  const writeFileHandle = await fs.open("write.txt", 'w');

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  readStream.pipe(new Decrypt()).pipe(writeStream);
}) ()