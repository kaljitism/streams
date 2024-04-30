const fs = require('node:fs/promises');

(async () => {
  console.time("writeMany")
  const fileHandle = await fs.open("test.txt", 'w')

  for (let i = 0; i < 1000000; i++) {
    await fileHandle.write(`${i}`)
  }
  console.timeEnd("writeMany")
}) ()

