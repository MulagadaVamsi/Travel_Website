const mongoose=require("mongoose");

const initdata=require("./data.js");

const listing=require("../models/listing.js");

main()
.then((result)=>{
    console.log("Connection successful to db");
})
.catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initdb= async ()=>{
    await listing.insertMany(initdata.data);
}

initdb();