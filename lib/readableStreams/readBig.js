const fs = require("node:fs/promises");;

(async() => {
  const fileHandle = await fs.open("test.txt", "r")
  const stream = fileHandle.createReadStream()

  stream.on("data", (chunks) => {
    console.log(chunks)
  })
}) ()

