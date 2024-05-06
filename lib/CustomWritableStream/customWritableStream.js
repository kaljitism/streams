const { Writable } = require('stream');
const fs = require('node:fs');

// A writable file stream should implement _write, _writev, and _final

class FileWriteStream extends Writable {
  constructor({highWaterMark, fileName}) {
    super({highWaterMark});
    this.fileName = fileName;
    this.fd = null;
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

 _write(chunk, encoding, callback) {
    console.log(this.fd)
    callback() // this is the callback of drain event
  }
  //
  // _final(callback) {
  //   callback();
  // }
  //
  // _destroy(error, callback) {
  //   callback();
  // }
}

function  main(){
  const stream = new FileWriteStream({highWaterMark: 10, fileName: "./tst.txt"})
  stream.write(Buffer.from("this is some string"));
  // stream.end(Buffer.from("last write. end."));
  //
  // stream.on("drain", (error) => {
  //   console.log(error)
  // })

}

main();