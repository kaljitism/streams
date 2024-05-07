const {Duplex} = require('node:stream');
const fs = require('node:fs/promises');

class DuplexStream extends  Duplex {
  constructor({writableHighWaterMark, readableHighWaterMark, readFileName, writeFileName}) {
    super({writableHighWaterMark, readableHighWaterMark});
    this.readFileName = readFileName;
    this.writeFileName = writeFileName;
    this.readFd = null;
    this.writeFd = null;

    this.chunks = [];
    this.chunkSize = 0;
  }

  async _construct(callback) {
    await fs.open(this.readFileName, 'r', (readError, readFd) => {
      if (readError) return callback(readError);
      this.readFd = readFd;

      fs.open(this.writeFileName, 'w', (writeError, writeFd) => {
        if (writeError) return callback(writeError);
        this.writeFd = writeFd;
        callback();
      })
      callback();
    })
  }

  _write (chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    if (this.chunkSize > this.writableHighWaterMark) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
        if (err) return callback(err);
        this.chunks = [];
        this.chunkSize = 0;
        callback();
        }
      )
    } else {
        callback();
    }

    }

  _read (size) {
    const buffer = Buffer.alloc(size);
    fs.read(this.readFd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
    });
  }

  _final(callback) {
    fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);

      this.chunks = [];
      callback();
      }
    )

  }

  _destroy(error, callback) {
    this.readFd.close()
    this.writeFd.close()
    callback(error)
  }
}

const duplex = new DuplexStream({
  readFileName: 'read.txt',
  writeFileName: 'write.txt',
  readableHighWaterMark: 16,
  writableHighWaterMark: 16,
})

duplex.write(Buffer.from("this is a string 1"))
duplex.write(Buffer.from("this is a string 2"))
duplex.write(Buffer.from("this is a string 3"))
duplex.write(Buffer.from("this is a string 4"))
duplex.write(Buffer.from("this is a string 5"))

duplex.on("data", (chunk) => console.log(chunk.toString()))

duplex.end()