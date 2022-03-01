function login()
{
        
    
    
    $.ajax({
            url: '/login',
            method: 'POST',
            contentType: 'application/json',
            data:JSON.stringify({
                uid: $('#name').val(),
                password: $('#password').val(),  
            }),
            success: function(response) {
                uid=document.getElementById("name")
                password=document.getElementById("password")
                if(response!='N'&&!localStorage.getItem(response+'privatekey'))
                {
                    alert("Sorry the device isn't recognized.")
                    return
                }
                else if(response=="N")
                alert("Invalid login credential"); 
                else
                window.location="https://discuterchat.namanprojects.com/chat/"+response
            }
        });
}
