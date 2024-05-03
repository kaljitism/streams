const fs = require('node:fs');

(() => {
  console.time("writeMany")
  fs.open("test.txt", 'w', (error, fileDescriptor,) => {
    for (let i = 0; i < 1000000; i++) {
      const buff = Buffer.from(` ${i} `, "utf8")
      fs.write(fileDescriptor, buff, (err, written) => {})
    }
    console.timeEnd("writeMany")
  })
}) ()