const express=require("express");
const app=express();
const port=8080;

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"public")));

const mongoose=require("mongoose");

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

const listing=require("./models/listing.js");

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/listings",async (req,res)=>{
    let listings=await listing.find({})
    res.render("listings",{listings})
})

app.get("/listings/:id/show",async (req,res)=>{
    let {id}=req.params;
    let listings_info=await listing.findById(id);
    res.render("show",{listings_info});
})

app.get("/listings/new_entry",(req,res)=>{
    res.render("new_entry.ejs");
})

app.post("/listings",async (req,res)=>{
    let {title,price,description,image,location,country}=req.body;
    await listing.insertOne({
        title:title,
        price:price,
        description:description,
        image:image,
        location:location,
        country:country
    })
    res.redirect("/listings");
})

app.get("/listings/:id/edit",async(req,res)=>{
    let {id}= req.params;
    let listings=await listing.findById(id);
    res.render("edit",{listings});
})

app.patch("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let {price,description,location,country}=req.body;
    await listing.findByIdAndUpdate(id,{price:price ,description:description ,
        location:location ,country:country
    },{new:true});
    res.redirect("/listings");
})

app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.get("/test", async (req,res)=>{
    let data = await listing.find({});
    console.log(data);
    res.send(data);
});

app.listen(port,(req,res)=>{
    console.log("App is listening");
})