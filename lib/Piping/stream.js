const fs = require("fs/promises");

// Piping takes care of reading data from a readable stream and writing data from
// a writable stream to a destination file, while pausing and resuming when a buffer is filled
// or emptied.

(async() => {
  console.time('copy')

  const srcFile = await fs.open('./src.txt', 'r')
  const destFile = await fs.open('./dst.txt', 'w')

  const readStream = srcFile.createReadStream()
  const writeStream = destFile.createWriteStream()

  readStream.pipe(writeStream)
  console.log(readStream.readableFlowing)

  readStream.unpipe(writeStream)
  console.log(readStream.readableFlowing)

  readStream.pipe(writeStream)
  console.log(readStream.readableFlowing)

  readStream.unpipe(writeStream)
  console.log(readStream.readableFlowing)

  readStream.pipe(writeStream)
  console.log(readStream.readableFlowing)

  readStream.on('end', () => console.timeEnd('copy'))
}) ()


// Warning: When using standard source.pipe(dest), `source` will not be destroyed if dest emits close
// or an error happens, for those purposes, use stream.pipeline(src, [...transform], dest, [...options])