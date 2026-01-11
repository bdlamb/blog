import express from 'express';

const app=express();
const port=3000;
const blogData={};

app.use(express.json({ limit: '1mb', type: 'application/json' }));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    if(blogData.length<1){
        res.render("index.ejs");
    } else{
        res.render("index.ejs",{blogData:Object.keys(blogData)});
    }
});

app.get("/create",(req,res)=>{
    res.render("index.ejs",{window:'create'});
});

app.get("/update",(req,res)=>{
    const title=req.query.title;
    const text=blogData[title];
    res.render("index.ejs",{ window:'update',title:title, text:blogData[title].toString()});
});

app.post("/",(req,res)=>{
    blogData[`${req.body.title}`]=req.body.text;
    res.render("index.ejs",{blogData:Object.keys(blogData)});
});

app.patch("/",(req,res)=>{
    blogData[`${req.body.title}`]=req.body.text;
    res.render("index.ejs",{blogData:Object.keys(blogData)});
});

app.delete("/",(req,res)=>{
    delete blogData[`${req.body.title}`];
    res.render("index.ejs",{blogData:Object.keys(blogData)});
});

app.listen(port,()=>{
    console.log("connection made");
});