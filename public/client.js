var selected="";
const regex=/^[a-zA-Z_0-9 ]+$/;

const toast = $('#liveToast');
const errorToast=$('#errorToast');


function displayToast(message,success){
    var toastBootstrap;
    if(success){
        toastBootstrap= bootstrap.Toast.getOrCreateInstance(toast);
        $("#liveToast > .toast-body").html(message);
    } 
    else{
        toastBootstrap = bootstrap.Toast.getOrCreateInstance(errorToast);
         $("#errorToast > .toast-body").html(message);
    }
    toastBootstrap.show();
}

function doCreate(){
    if(createForm.createTitleInput.value&&createImageInput.files[0]){
        var title=createForm.createTitleInput.value;
        var imageFile=createImageInput.files[0];
        title=title.trim();
        if(title && isValid(title)){
            if(isValidMimeType(imageFile)){
                const formData=new FormData();
                formData.append('title',createForm.createTitleInput.value);
                formData.append('text',createForm.createContentInput.value);
                formData.append('image',createForm.createImageInput.files[0]);
                fetch("/",{
                    method:'POST',
                    body: formData
                    }).then((response) => {
                        if(!response.ok){
                            displayToast("Issue creating blog.It is possible another blog with that same name already exists.",false);
                        }
                        else{
                            displayToast("Blog created",true);
                            window.location.href = "/";
                        }
                    });
            }
            else{
                displayToast("Given image is not valid.",false);
                return;
            }

        }
        else{
            displayToast("The tile must contain at least one character and must only indicated values.",false);
            return;
        }
    }
    else{
        displayToast("Title and image inputs must be filled out.",false);
        return;
    }
}

function doPatch(id){
    if(!editForm.editTitleInput.value || editForm.editTitleInput.value.trim()==0 || !isValid(editForm.editTitleInput.value)){
        displayToast("Issue with title.",false);
        return;
    }
    const formData=new FormData();
            formData.append('title',editForm.editTitleInput.value);
            formData.append('text',editForm.editContentInput.value);
            if(editForm.editImageInput.value){
                formData.append('image',editForm.editImageInput.files[0]);
            }
            formData.append('currentImage',editForm.editPictureCurrent.value)
        fetch(`/${id}`,{
            method:'PATCH',
            body: formData
        }).then((response) => {
            if(!response.ok){
                displayToast("Issue patching blog.It is possible another blog with that same name already exists.",false);
            }
            else{
                displayToast("Blog created.",true);
                window.location.href = "/";
            }
        });
}


    function isValidMimeType(file) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
        return allowedMimeTypes.includes(file.type);
    }

    function isValid(stringToTest){    
        if(!regex.test(stringToTest)){
            return false;
        }
        else{
            return true;
        }
    }
    
     function validateInput(){
        var titleText=$("#TitleTextbox");
        if(!regex.test(titleText.value)){
            titleText.value=titleText.value.slice(0,titleText.value.length-1);
        }
    }

    function fixInput(){
        $("#TitleTextbox").val($("#TitleTextbox").val().trim());
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
                if(response.ok){
                    displayToast("Blog removed",true);
                    window.location.href = "/";
                }else{
                    displayToast("Issue deleting blog.",false);
                }
            });
        }
    }

    function hideMe(){
        $("#blogExpandedContainer").css("display","none");
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
                displayToast("Blog loaded",true);
                $("#editButton").css("visibility","visible");
                $("#deleteButton").css("visibility","visible");
                $("#blogInformationJustText").css("display","block");
                $("#editForm").css("display","none");
                $("#createForm").css("display","none");
                $("#editTitleInput").val(res.title);
                $("#editContentInput").html(res.content);
                $("#editPictureCurrent").val(res.image);
                $("#blogInformationTitle").html(res.title);
                $("#blogInformationText").html(res.content);
                $("#blogExpandedContainer").css("display","flex");
            });
        });
    }

    function showCreate(){
        $("#editButton").css("visibility","hidden");
        $("#deleteButton").css("visibility","hidden");
        $("#blogInformationJustText").css("display","none");
        $("#editForm").css("display","none");;
        $("#createForm").css("display","contents");
        $("#blogExpandedContainer").css("display","flex");
    }

    function editBlog(){
        $("#editButton").toggleClass("clicked");
        if($("#blogInformationJustText").css("display")!="none"){
            $("#blogInformationJustText").css("display","none");
            $("#editForm").css("display","contents");
        }else{
            $("#blogInformationJustText").css("display","block");
            $("#editForm").css("display","none");
        }
        
    }
