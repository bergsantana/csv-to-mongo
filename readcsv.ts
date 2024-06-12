import mongoose, { mongo } from "mongoose"
require('dotenv').config()

const { Schema } = mongoose
 
const fs = require("fs")
const { parse } = require("csv-parse")
 

const JobProfitCenterSchema = new Schema({
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: false,
    },
    id: {
      type: Number,
    },
    description: {
      type: String,
    },
    directorate: {
      type: String,
    }
})
  

const ProfitCenter = mongoose.model('JobProfitCenter', JobProfitCenterSchema)

const readCsvAndUpdate = async () => {

    
    await mongoose.connect(process.env.DB_CONN_BONDY, { dbName: 'matchbox-v2' })
    
 
    let notfoundCount = 0

    fs.createReadStream("./cl-data.csv")
        .pipe(parse({   delimiter: ',', from_line: 2 }))
        .on("data", async (row) => {
            
            const obj = {
                cl: row[0] ?? '',
                description : `${row[0]} - ${row[1]}`  ?? '',
                economic_group: row[2] ?? ''
            }
 
            try{
                const regularExp  = new RegExp(obj.cl, 'i')
                const found = await ProfitCenter.findOne({description: regularExp})
                if (found) {
                    found.$set('directorate', row[5] ?? '')
                    console.log('found', found)
                    await found.save()
                }
                if(!found) console.log('not found'), notfoundCount++
                
            }catch(err){
                console.log(err)
            }
 

        })
        .on('end', () =>{
            console.log('Finished')
        })
        .on('error', (error) => {
            console.log(error.message)
        })
    
        console.log('Not found documents', notfoundCount)
}   

readCsvAndUpdate()