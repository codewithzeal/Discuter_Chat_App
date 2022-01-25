function validate()
{
    uname=document.getElementById('uname').value.toString()
    password=document.getElementById('password').value.toString()
    if(!uname||!password)
    {
        alert("details are needed")
        return
    }
    $.ajax(
        {
            url:'/signup',
            method:'POST',
            contentType:'application/json',
            data:JSON.stringify({un:uname,pwd:password}),
            success:function(response)
            {
                if(response=="ok")
                alert("registered")
                {
                    generateKeys(uname)
                }
                if(response=="ae")
                alert("User already exixts")
            },
            error:function(response)
            {
                alert(response)
            }
        }
    )
}

function arrayBufferToBase64( buffer ) {
	var binary = '';
	var bytes = new Uint8Array( buffer );
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
	return window.btoa( binary );
}
function base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


function generateKeys(uname)
{
    /* var KeyHelper = libsignal.KeyHelper;
    store=new SignalProtocolStore()
    var registrationId = KeyHelper.generateRegistrationId();
    localStorage.setItem(uname+'rid',registrationId)
    KeyHelper.generateIdentityKeyPair().then(function(identityKeyPair) {
        localStorage.setItem(uname+'ikp',JSON.stringify({pubKey:arrayBufferToBase64(identityKeyPair.pubKey),privKey:arrayBufferToBase64(identityKeyPair.privKey)}))
        KeyHelper.generateSignedPreKey(identityKeyPair, registrationId).then(function(signedPreKey) {
        store.storeSignedPreKey(signedPreKey.keyId, signedPreKey);
        });
    });
    KeyHelper.generatePreKey(registrationId).then(function(preKey) {
    store.storePreKey(preKey.keyId, preKey.keyPair);
    }); */
}