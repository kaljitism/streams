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
      const finalBuffer = Buffer.alloc(bytesRead)
      readResult.buffer.copy(finalBuffer, 0, 0, indexOfLastValue)
      await writeFileHandle.write(finalBuffer)
    } else {
      await writeFileHandle.write(readResult.buffer)
    }
  }

  console.timeEnd('copy')
}) ()