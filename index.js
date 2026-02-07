import express from 'express';
import fileUpload from 'express-fileupload';
import pg from 'pg';
import path from 'path';
import os from 'os';
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config();

const app=express();
const port=3000;
const uploadFolder=process.env.UPLOAD_FOLDER;
const blogHost=process.env.HOST;
const user =process.env.USER;
const password=process.env.PASSWORD;

var blogData={}
/*{"my day" : {text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis lobortis ex. Integer leo risus, faucibus id mi in, posuere ultricies felis. Duis tristique pretium quam et consequat. Nullam sed leo vel nunc vehicula pharetra. Integer auctor purus sit amet dapibus porta. Integer non turpis sed lectus porttitor laoreet sagittis.", image:"path.png"},
    "my da" : {text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis lobortis ex. Integer leo risus, faucibus id mi in, posuere ultricies felis. Duis tristique pretium quam et consequat. Nullam sed leo vel nunc vehicula pharetra. Integer auctor purus sit amet dapibus porta. Integer non turpis sed lectus porttitor laoreet sagittis.", image:"path.png"},
    "my d" : {text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis lobortis ex. Integer leo risus, faucibus id mi in, posuere ultricies felis. Duis tristique pretium quam et consequat. Nullam sed leo vel nunc vehicula pharetra. Integer auctor purus sit amet dapibus porta. Integer non turpis sed lectus porttitor laoreet sagittis.", image:"path.png"}
};*/

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(express.json({ limit: '1mb', type: 'application/json' }));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

const db=new pg.Client({
    host: blogHost,
    port:process.env.PORT,
    database:process.env.DATABASE,
    user:user,
    password:password
});
await db.connect();

await db.query("create table if not exists blogs(id serial primary key,tile varchar(100),content text,image varchar(100))");

var original="";

app.get("/",async (req,res)=>{
    original="";
    try{
        let results=await db.query("select * from blogs");
        blogData=results.rows;
        blogData.forEach(row=>{ var extra="";if(row.content.length>100){extra="..."};row.content= row.content.slice(0,100)+extra; });
        if(blogData.length<1){
            console.log("in nothing");
            res.render("index.ejs");
        } else{
            console.log("in stuff");
            res.render("index.ejs",{blogData:blogData});
         }
    }catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

app.get("/:id",async (req,res) => {
    try{
    let results=await db.query("select * FROM blogs where id=$1",[req.params.id]);
    //console.log(results);
    if(results.rowCount>0){
        res.json({id:results.rows[0].id,title:results.rows[0].title,content:results.rows[0].content});
    }
    else{
        res.sendStatus(404);
    }
    }catch(error){
        console.log(error);
    }
});

app.get("/create",(req,res)=>{
    console.log("in create");
    res.render("index.ejs",{window:'create'});
});

/*app.get("/update",async(req,res)=>{
    console.log(req.params.blogid);
    var theBlog=((await db.query(`select * from blogs where id=${req.query.id}`)).rows)[0];
    console.log(theBlog);
    //const title=req.query.title;
    //original=title;
    //const blog=blogData[title];
    //console.log(blogData)
    res.render("index.ejs",{ window:'update',title:theBlog.title, text:theBlog.content, image:theBlog.image, id:theBlog.id});
});*/

/*app.get("/validate",(req,res)=>{
   if(blogData.contains(req.body.title)){
    res.send({okay:false});
   }
   else{
    res.send({okay:true});
   }
});*/

app.post("/",async(req,rest)=>{
    const results=await db.query("select * from blogs where title=$1",[req.body.title]);
    if(results.rowCount>0){
        rest.status(404).send(JSON.stringify({error:"Blog with that title already exists"}));
    }
    if(req.files.image){
        const uploadedFile=req.files.image;
        const uploadPath=uploadFolder+"\\"+uploadedFile.name;
        uploadedFile.mv(uploadPath, function (err) {
        if (err) {
            console.log(err);
            rest.send("Failed !!");
        }
        });
        db.query(`insert into blogs(title,content,image) values($1,$2,$3)`,[req.body.title,req.body.text,uploadedFile.name],(err,res)=>{
            if(err){
                console.log(err);
            }else{
                console.log("blog created");
            }
            //db.end();
            rest.status(202).send("Blog Created");
        });
    }
});

app.patch("/:id",async (req,res)=>{
    console.log("lllll");
    console.log(req.body);
    var selectedBlog=((await db.query(`select * from blogs where id=$1`,[req.params.id])).rows)[0];
    if(req.body.title!=selectedBlog.title){
        var otherBlog=await db.query(`select * from blogs where title=$1`,[req.body.title]);
        if(otherBlog.rowCount!=0){
            res.status(404).send(JSON.stringify({error:"Blog with that title already exists"}));
        }
    }
    await db.query(`update blogs set title=$1, content=$2, image=$3 where id=$4`,[req.body.title,req.body.text,selectedBlog.image,req.params.id]);
    res.status(202).send("Blog Created");
});

app.delete("/",(req,res)=>{
    db.query(`delete from blogs where id=$1`,[req.body.id]);
    res.sendStatus(200);
    //delete blogData[`${req.body.title}`];
    //res.render("index.ejs",{blogData:blogData});
});

app.get("/image/:name",(req,res)=>{
    try{
        //console.log("getting image");
        //console.log(path.join(__dirname, `/public/images/uploads/${req.params.name}`));
        res.sendFile(path.join(uploadFolder, `\\${req.params.name}`));
    }catch(error){
        res.sendFile(path.join(uploadFolder, `\\path.png`));
    }
});

app.listen(port,()=>{
    console.log("connection made");
});