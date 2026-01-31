var selected="";

function doCreate(){
    if(createForm.createTitleInput.value&&createImageInput.files[0]){
        console.log("creating");
        var title=createForm.createTitleInput.value;
        var imageFile=createImageInput.files[0];
        title=title.trim();
        if(title && isValid()){
            if(isValidMimeType(imageFile)){
                const formData=new FormData();
                formData.append('title',createForm.createTitleInput.value);
                formData.append('text',createForm.createContentInput.value);
                formData.append('image',createForm.createImageInput.files[0]);
                //var file=blogForm.imageInput.files[0];
                fetch("/",{
                    method:'POST',
                        body: formData,
                    }).then((response) => {
                        if(response.status=="404"){
                            alert("Blog with that title already exists");
                        }
                        else{
                            alert("blog created");
                            window.location.href = "/";
                        }
                    });
            }
            else{
                alert("Invalid image");
                return;
            }

        }
        else{
            alert("The tile must contain at least one character and must only indicated values.")
            return;
        }
    }
    else{
        alert("title and image must be filled out");
        return;
    }
}

function doPatch(id){
    if(!editForm.editTitleInput.value || ededitForm.editTitleInput.value.trim()==0 || !isValid()){
        alert("Issue with title");
        //nameInput.classList.add("error-border");
        return;
    }
    if(!editForm.editImageInput.value || !isValidMimeType(editForm.editImageInput.files[0]) ){
        alert("Issue with image");
        return;
    }
    let content = {
            title: editForm.editTitleInput.value,
            text: editForm.editContentInput.value,
            //image: createForm.image.files[0],
    };
        fetch(`/${id}`,{
            method:'PATCH',
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            },
            body: JSON.stringify(content)
        }).then((response) => {
            if(response.status=="404"){
                alert("Blog with that title already exists");
            }
            else{
                alert("Blog updated");
                window.location.href = "/";
            }
        });
}
    /*async function validate(){
        console.log("in validate")
          let content = {
            title: blogForm.TitleTextbox.value,
        };
        var response=await fetch("/validate",{
            method:'GET',
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            },
            body: JSON.stringify(content)
        });
        if(response.body.okay){
            console.log('New blog Created');
            return true;
        }
        else{
            alert("Title already used choose another.");
            return false;
        }
    }*/

    function isValidMimeType(file) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
        return allowedMimeTypes.includes(file.type);
    }

    function isValid(){
        const regex=/^[a-zA-Z_0-9 ]+$/;
        if(!regex.test(titleText.value)){
            return false;
        }
        else{
            return true;
        }
    }
     function validateInput(){
        var titleText=document.querySelector("#TitleTextbox");
        const regex=/^[a-zA-Z_0-9 ]+$/;
        //console.log(titleText.value);
        //console.log(titleText.value.match(regex));
        if(!regex.test(titleText.value)){
            titleText.value=titleText.value.slice(0,titleText.value.length-1);
        }
    }
    function fixInput(){
        var theInput=document.querySelector("#TitleTextbox").value;
        var theInput=theInput.trim();
        document.querySelector("#TitleTextbox").value=theInput;
    }

    function doDelete(blogid){
        let content = {
            title: editForm.editTitleInput.value,
            id:blogid
        };
        if(confirm(`Are you sure you want to delete blog titled: ${content.title}`)){
            fetch("/",{
            method:'DELETE',
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            },
                body: JSON.stringify(content)
            }).then((response) => {
                alert("Blog removed");
                window.location.href = "/";
            });
        }
    }

    function hideMe(){
        document.querySelector("#blogExpandedContainer").style.display="none";
        //send get  "/"
    }

    function expandBlog(id){
        fetch(`/${id}`,{
            method:'GET',
            headers:{
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            },
        }).then((response) => {
            response.json().then(res =>{
                selected=res.id;
                document.querySelector("#editButton").style.visibility="visible";
                document.querySelector("#deleteButton").style.visibility="visible";
                document.querySelector("#blogInformationJustText").style.display="block";
                //document.querySelector("#blogInformationTitle").style.display="contents";
                //document.querySelector("#textPanel").style.display="contents";
                document.querySelector("#editForm").style.display="none";
                document.querySelector("#createForm").style.display="none";
                document.querySelector("#blogExpandedContainer").style.display="flex";
                document.querySelector("#editTitleInput").value=res.title;
                document.querySelector("#editContentInput").innerHTML=res.content;
                document.querySelector("#blogInformationTitle").innerHTML=res.title;
                document.querySelector("#blogInformationText").innerHTML=res.content;
                document.querySelector("#blogExpandedContainer").style.display="flex";
            });
        });
        //send get\id
        //input stuff into screen
    }

    function showCreate(){
        document.querySelector("#editButton").style.visibility="hidden";
        document.querySelector("#deleteButton").style.visibility="hidden";
        document.querySelector("#blogInformationJustText").style.display="none";
        //document.querySelector("#blogInformationTitle").style.display="none";
        //document.querySelector("#textPanel").style.display="none";
        document.querySelector("#editForm").style.display="none";
        document.querySelector("#createForm").style.display="contents";
        document.querySelector("#blogExpandedContainer").style.display="flex";
    }

    function editBlog(){
        document.querySelector("#editButton").classList.toggle("clicked");
        if(document.querySelector("#blogInformationJustText").style.display!="none"){
            document.querySelector("#blogInformationJustText").style.display="none";
            //document.querySelector("#blogInformationTitle").style.display="none";
            //document.querySelector("#blogInformationText").style.display="none";
            document.querySelector("#editForm").style.display="contents";
        }else{
            document.querySelector("#blogInformationJustText").style.display="block";
            //document.querySelector("#blogInformationTitle").style.display="block";
            //document.querySelector("#blogInformationText").style.display="block";
            document.querySelector("#editForm").style.display="none";
        }
        
    }
