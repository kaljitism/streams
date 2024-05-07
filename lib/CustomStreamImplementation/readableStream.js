const {Readable, Writable} = require("node:stream");
const fs = require("node:fs");
const {write} = require("node:fs");

class FileReadStream extends Readable {
  constructor({highWaterMark, fileName}) {
    super({highWaterMark});

    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) return callback(err)

      this.fd = fd;
      callback();
    })
  }

  _read(size) {
    const buffer = Buffer.alloc(size);
    fs.read(this.fd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);

      //.push(buffer) method emits data event if it has a value passed in
      // .push(null) method emits 'end' event
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
    })
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => callback(err || error))
    } else {
      callback(error)
    }
  }
}

class FileWriteStream extends Writable {
  constructor({highWaterMark, fileName}) {
    super({highWaterMark});

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.numberOfWrites = 0;
  }

  // This method runs after constructor and before other methods
  // Until this callback is completed, stream.write or any other
  // operation will not work.
  _construct(callback) {
    fs.open(this.fileName, 'w', (err, fd) => {
      if (err) {
        // if we call callback with an argument that means we have an error, and we should not proceed.
        return callback(err);
      }
      this.fd = fd;
      //  No arguments mean it was successful!
      callback();
    })
  }

  // Will be called when stream.on("write", callback) will be revoked.
  _write(chunk, encoding, callback) {
    this.chunks.push(chunk)
    this.chunkSize += chunk.length

    if (this.chunkSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) return callback(err);

        this.chunks = [];
        this.chunkSize = 0;
        ++this.numberOfWrites;
        callback();
      })
    } else {
      callback();
    }
  }


  // Will be called when stream.end() will be revoked
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks),  (err) => {
      if (err) return callback(err)

      this.chunks = [];
      this.chunkSize = 0;
      ++this.numberOfWrites;
      callback();
    })
  }

  // Will be called when stream.on("finish", callback) is revoked.
  _destroy(error, callback) {
    console.log(`Number of Writes: ${this.numberOfWrites}`)
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error)
      })

    } else {
      callback(error)
    }

  }
}

let i = 0;
const iMax = 100000000;

function writeMany() {
  while (i < iMax) {
    const buff = Buffer.from(` ${i} `, 'utf8')
    if (i === (iMax-1)) {
      writeStream.end(buff)
      readStream.pause()
      return
    }
    if (writeStream.write(buff) === false) {
      i++
      return
    }
    i++
  }
}


console.time("TimeLog")

const readStream = new FileReadStream({
  highWaterMark: 1024 * 1024,
  fileName: "./read.txt"
});

const writeStream = new FileWriteStream({
  highWaterMark: 1024 * 1024,
  fileName: "./dest.txt",
});


readStream.on("data", (chunks) => {
  writeMany();
})

writeStream.on("drain", () => {
  writeMany();
})

readStream.on("end", () => {
  console.log("Stream End")
  console.timeEnd("TimeLog")
})
