const fs = require("node:fs/promises");

(async ()=> {
  console.time("selectiveReading")

  const readFileHandler = await fs.open("src.txt", "r")
  const writeFileHandler = await fs.open("dst.txt", "w")

  const readStream = readFileHandler.createReadStream({highWaterMark: 10 * 1024 * 1024})
  const writeStream = writeFileHandler.createWriteStream({highWaterMark: 10 * 1024 * 1024})

  let split;

  readStream.on("data", chunk => {
    const numbers = chunk.toString('utf8').split("  ")

    let concatenatedNumber;

    if (Number(numbers[0]) + 1 !== Number(numbers[1])) {

        concatenatedNumber = split.trim() + numbers[0].trim()
        numbers[0] = concatenatedNumber

    }

    if (Number(numbers[numbers.length - 1]) - 1 !== Number(numbers[numbers.length - 2])) {
      split = numbers.pop()
    }

    for (let i = 0; i < numbers.length; i++) {
      let num = Number(numbers[i])

      if (num % 10 === 0) {
        if (!(writeStream.write(` ${num} `))) {
          readStream.pause()
        }
      }
    }
  })

  writeStream.on("drain", () => {
    readStream.resume()
  })

  readStream.on("end", () => {
    console.timeEnd("selectiveReading")
    readFileHandler.close()
  })
}) ()