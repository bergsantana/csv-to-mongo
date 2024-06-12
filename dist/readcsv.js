"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const { Schema } = mongoose_1.default;
const fs = require("fs");
const { parse } = require("csv-parse");
const clSchema = new Schema({
    cl: { type: String, required: true },
    description: { type: String, required: true },
    economic_group: { type: String, required: true }
});
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
});
// const ProfitCenter = mongoose.model('ProfitCenter', clSchema)
// JobProfitCenterSchema.add({ directore: { type: String}})
const ProfitCenter = mongoose_1.default.model('JobProfitCenter', JobProfitCenterSchema);
const readCsvAndUpdate = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.DB_CONN_BONDY, { dbName: 'matchbox-v2' });
    let notfoundCount = 0;
    fs.createReadStream("./cl-data.csv")
        .pipe(parse({ delimiter: ',', from_line: 2 }))
        .on("data", (row) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const obj = {
            cl: (_a = row[0]) !== null && _a !== void 0 ? _a : '',
            description: (_b = `${row[0]} - ${row[1]}`) !== null && _b !== void 0 ? _b : '',
            //directors_board: row[4] ?? '',
            economic_group: (_c = row[2]) !== null && _c !== void 0 ? _c : ''
        };
        const profitcenter = new ProfitCenter({
            description: obj.description,
            //directorate: 'placeholder vlaue'
        });
        try {
            const regularExp = new RegExp(obj.cl, 'i');
            const found = yield ProfitCenter.findOne({ description: regularExp });
            if (found) {
                console.log('found', found);
                found.$set('directorate', (_d = row[5]) !== null && _d !== void 0 ? _d : '');
                yield found.save();
            }
            if (!found)
                console.log('not found'), notfoundCount++;
        }
        catch (err) {
            console.log(err);
        }
        //const cl  = new ProfitCenter(obj)
        //console.log(cl)
        // try{
        //     await cl.save()
        // }catch(e){
        //      console.log('error ', e)
        // // }
        // try {
        //     const regularExp = new RegExp(  obj.cl )
        //     const found = await ProfitCenter.findOne({ description: { $regex: obj.cl }}).exec()
        //     //const found = await ProfitCenter.find({ description: /BR061033/ }).exec()
        //     if(found) found.set("directorate", row[5] ?? '' ) , found.save()
        //     if(!found) console.log('not found ',  obj.description, obj), console.log('regex used', regularExp)
        //     console.log('Found entity', found)
        // } catch (err) {
        //     console.log(err)
        // }
    }))
        .on('end', () => {
        console.log('Finished');
    })
        .on('error', (error) => {
        console.log(error.message);
    });
    console.log('Not found documents', notfoundCount);
});
readCsvAndUpdate();
//# sourceMappingURL=readcsv.js.map