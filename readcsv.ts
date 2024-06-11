const fs = require("fs")
const { parse } = require("csv-parse")
 
fs.createReadStream("./cl-data.csv")
    .pipe(parse({   delimiter: ',', from_line: 2 }))
    .on("data", (row) => {
        const obj = {
            description : row[0] ?? '',
            directors_board: row[4] ?? '',
        }
        console.log(obj)
    })
    .on('end', () =>{
        console.log('Finished')
    })
    .on('error', (error) => {
        console.log(error.message)
    })
    .on('close', () => {
        console.log('Closing')
    })