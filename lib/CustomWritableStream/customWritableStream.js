const { Writable } = require('stream');
const fs = require('node:fs');

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

  // Will be called when stream will about to be closed by 'finish' event
  _destroy(error, callback) {
    console.log(`Number of Writes: ${this.numberOfWrites}`)
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err | error)
      })

    } else {
      callback(error)
    }

  }
}

function  main(){
  const stream = new FileWriteStream({highWaterMark: 1024, fileName: "./tst.txt"})
  stream.write(Buffer.from("Hell0\n"));
  stream.end(Buffer.from("last write. end."));

  stream.on("finish", () => {
    console.log("Stream finished")
  })
}

main();
