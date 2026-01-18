import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';


const app=express();
const port=3000;
var blogData={};

/*{"my day" : {text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis lobortis ex. Integer leo risus, faucibus id mi in, posuere ultricies felis. Duis tristique pretium quam et consequat. Nullam sed leo vel nunc vehicula pharetra. Integer auctor purus sit amet dapibus porta. Integer non turpis sed lectus porttitor laoreet sagittis.", image:"birthday-invite.png"},
    "my da" : {text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis lobortis ex. Integer leo risus, faucibus id mi in, posuere ultricies felis. Duis tristique pretium quam et consequat. Nullam sed leo vel nunc vehicula pharetra. Integer auctor purus sit amet dapibus porta. Integer non turpis sed lectus porttitor laoreet sagittis.", image:"birthday-invite.png"},
    "my d" : {text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis lobortis ex. Integer leo risus, faucibus id mi in, posuere ultricies felis. Duis tristique pretium quam et consequat. Nullam sed leo vel nunc vehicula pharetra. Integer auctor purus sit amet dapibus porta. Integer non turpis sed lectus porttitor laoreet sagittis.", image:"birthday-invite.png"}
};*/
const __dirname = import.meta.dirname;


app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(express.json({ limit: '1mb', type: 'application/json' }));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));


var original="";

app.get("/",(req,res)=>{
    original="";
    //console.log(blogData);
    if(blogData.length<1){
        console.log("in nothing");
        res.render("index.ejs");
    } else{
        console.log("in stuff");
        res.render("index.ejs",{blogData:blogData});
    }
});

app.get("/create",(req,res)=>{
    console.log("in create");
    res.render("index.ejs",{window:'create'});
});

app.get("/update",(req,res)=>{
    const title=req.query.title;
    original=title;
    const blog=blogData[title];
    //console.log(blogData)
    res.render("index.ejs",{ window:'update',title:title, text:blog.text, image:blog.image});
});

app.post("/upload",(req,res)=>{
    if(req.files){
        const uploadedFile=req.files.image;
        const uploadPath=__dirname +"/public/images/uploads/"+uploadedFile.name;
        uploadedFile.mv(uploadPath, function (err) {
        if (err) {
            console.log(err);
            res.send("Failed !!");
        }
        });
        blogData[`${req.body.title}`]={text:req.body.text,image:uploadedFile.name};
    }
    res.render("index.ejs",{blogData:blogData});
});

app.post("/",(req,res)=>{
    console.log("posting");
    res.render("index.ejs");
});

app.patch("/",(req,res)=>{
    if(original != req.body.title){
        //blogData=blogData.filter(item=>!(item.title===original));
        blogData[`${req.body.title}`]={text:req.body.text,image:blogData[`${original}`].image};
        delete blogData[`${original}`];
    }
    else{
        var blog=blogData[`${req.body.title}`];
         if(req.body.text!==blogData.text){
            blog.text=req.body.text;
         }
         
    }
    res.render("index.ejs",{blogData:blogData});
});

app.delete("/",(req,res)=>{
    delete blogData[`${req.body.title}`];
    res.render("index.ejs",{blogData:blogData});
});

app.get("/image/:name",(req,res)=>{
    try{
        //console.log("getting image");
        //console.log(path.join(__dirname, `/public/images/uploads/${req.params.name}`));
        res.sendFile(path.join(__dirname, `/public/images/uploads/${req.params.name}`));
    }catch(error){
        res.sendFile(path.join(__dirname, `/public/images/uploads/birthday-invite.png`));
    }
});

app.listen(port,()=>{
    console.log("connection made");
});