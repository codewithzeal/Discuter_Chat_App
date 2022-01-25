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
                if(response=="N")
                alert("Invalid login credential");
                else
                window.location="http://localhost:3000/chat/"+response
            }
        });
}
