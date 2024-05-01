const fs= require('node:fs/promises');

(async () => {
  console.time("writeMany")
  const fileHandle = await fs.open("test.txt", 'w')

  const stream = fileHandle.createWriteStream()

  for (let i = 0; i < 10000000; i++) {
    const buff = Buffer.from(` ${i} `, "utf8")
    stream.write(buff)
  }
  console.timeEnd("writeMany")
}) ()

