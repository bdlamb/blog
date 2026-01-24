function doCreate(){
    /*let content = {
        title: blogForm.TitleTextbox.value,
        text: blogForm.BlogText.value,
        image:blogForm.imageInput.files[0]
    };*/
    console.log("creating");
    const formData=new FormData();
    formData.append('title',blogForm.TitleTextbox.value);
    formData.append('text',blogForm.BlogText.value);
    formData.append('image',blogForm.imageInput.files[0])
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

function doPatch(id){
    if(blogForm.TitleTextbox.value.length==0){
        nameError.style.display = "block";
        //nameInput.classList.add("error-border");
        return;
    }
    let content = {
            title: blogForm.TitleTextbox.value,
            text: blogForm.BlogText.value
    };
        fetch("/id",{
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
            title: blogForm.TitleTextbox.value,
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
                console.log('PATCH Response.status: ', response.status);
                window.location.href = "/";
            });
        }
    }
