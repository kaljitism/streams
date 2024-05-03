const fs = require("fs/promises");

(async() => {
  console.time('copy')

  const readFileHandle = await fs.open('./src.txt', 'r')
  const writeFileHandle = await fs.open('./dst.txt', 'w')

  let bytesRead = -1

  while (bytesRead !== 0) {
    const readResult = await readFileHandle.read()
    bytesRead = readResult.bytesRead

    if (bytesRead !== 16384) {
      const indexOfLastValue = readResult.buffer.indexOf(0)
      const finalBuffer = Buffer.alloc(readResult.buffer[indexOfLastValue+20])
      readResult.buffer.copy(finalBuffer, 0, 0, indexOfLastValue+20)
      writeFileHandle.write(finalBuffer)
    } else {
      writeFileHandle.write(readResult.buffer)
    }
  }

  console.timeEnd('copy')
}) ()