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
                alert(response)
                uid=document.getElementById("name")
                password=document.getElementById("password")
                if(!localStorage.getItem(response+'privatekey')&&response!='N')
                {
                    alert("Sorry the device isn't recognized.")
                    return
                }
                else if(response=="N")
                alert("Invalid login credential"); 
                else
                window.location="http://localhost:3000/chat/"+response
            }
        });
}
