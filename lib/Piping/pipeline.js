const {pipeline} = require('node:stream');
const fs = require("node:fs/promises");

(async()=> {
  console.time('pipeline')

  const src = await fs.open("./src.txt", 'r')
  const dst = await fs.open("./dst.txt", 'w')

  const readStream = src.createReadStream()
  const writeStream = dst.createWriteStream()

  pipeline(readStream, writeStream, (err) => {
    if (err) {
      console.error(err)
    }
  })
}) ()