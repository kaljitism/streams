const fs = require("node:fs/promises");

(async () => {
  console.time("writeMany")
  const fileHandle = await fs.open("test.txt", "w")

  const stream = fileHandle.createWriteStream()

  let i = 0
  const iMax = 10000

  function writeMany() {
    while (i < iMax) {
      const buff = Buffer.from(` ${i++} `, 'utf8')
      if (i === (iMax-1)) {
        stream.end(buff)
        return
      }

      stream.write(buff)
      if (stream.write(buff) === false) {
        i++
        break
      }
      i++
    }
  }
  writeMany()

  stream.on("drain", ( ) => {
    writeMany()
  })

  stream.on("finish", () => {
    console.timeEnd("writeMany")
    fileHandle.close()
  })
}) ()
