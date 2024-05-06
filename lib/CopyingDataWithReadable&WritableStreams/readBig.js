const fs = require("node:fs/promises");

(async() => {
  console.time('write')
  const srcFileHandle = await fs.open("src.txt", "r")
  const dstFileHandle = await fs.open("dst.txt", "w")

  const streamRead = srcFileHandle.createReadStream({highWaterMark: 64 * 1024})
  const streamWrite = dstFileHandle.createWriteStream({highWaterMark: 64 * 1024})

  streamRead.on("data", (chunks) => {
    if (!streamWrite.write(chunks)) {
      streamRead.pause()
    }
  })

  streamWrite.on("drain", () => {
    streamRead.resume()
  })

  streamRead.on("end", () => {
    console.timeEnd('write')
    srcFileHandle.close()
    dstFileHandle.close()
  })
}) ()

