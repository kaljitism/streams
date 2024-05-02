const fs = require("node:fs/promises");

(async ()=> {
  console.time("selectiveReading")

  const readFileHandler = await fs.open("src.txt", "r")
  const writeFileHandler = await fs.open("dst.txt", "w")

  const readStream = readFileHandler.createReadStream({highWaterMark: 64 * 1024})
  const writeStream = writeFileHandler.createWriteStream({highWaterMark: 64 * 1024})

  let splitEnd;
  let splitStart;

  let isSplit = false;

  readStream.on("data", chunk => {
    const numbers = chunk.toString('utf8').split("  ")

    let concatenatedNumber;

    if (isSplit === true) {
      splitStart = numbers[0]
      concatenatedNumber = splitStart + splitEnd
      numbers[0] = concatenatedNumber
      isSplit = false
    }

    if (Number(numbers[numbers.length - 1]) - 1 !== Number(numbers[numbers.length - 2])) {
      splitEnd = numbers.pop()
      isSplit = true
    }

    for (let i = 0; i < numbers.length; i++) {
      if (Number(numbers[i]) % 2 === 0) {
        numbers.splice(i, 1)
      }
    }

    writeStream.write(numbers.join("  "))
  })

  writeStream.on("drain", () => {
    readStream.resume()
  })

  writeStream.on("end", () => {
    readFileHandler.close()
    writeFileHandler.close()
    console.timeEnd("selectiveReading")
  })
}) ()