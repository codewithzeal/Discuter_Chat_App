user=""//this variable is used by signal protocol store in order to fetch data
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
                if(response=="empty")
                alert("fields were submitted empty")
                if(response=="ok")
                alert("registered")
                {
                    user=uname
                    generateKeys()
                }
                if(response=="ae")
                alert("User already exixts")
            },
            error:function(response)
            {
                alert("error occured")
            }
        }
    )
}
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }
  
async function exportCryptoKey(key) {
    const exported = await window.crypto.subtle.exportKey(
      "pkcs8",
      key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
  
    localStorage.setItem(user+'privatekey',pemExported)
  }
async function exportCryptoKey1(key) {
    const exported = await window.crypto.subtle.exportKey(
      "spki",
      key
    );
    const exportedKeyBuffer = new Uint8Array(exported);
    const exportedAsString = ab2str(exportedKeyBuffer);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
  
    //localStorage.setItem('publickey',pemExported)
    uploadPublicKey(pemExported)
  }
function generateKeys()
{
    window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          // Consider using a 4096-bit key for systems that require long-term security
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ['encrypt','decrypt']
      ).then((keyPair) => {
       
        exportCryptoKey1(keyPair.publicKey)  
        exportCryptoKey(keyPair.privateKey);
       
      
      });
}
function uploadPublicKey(value)
{
    $.ajax(
        {
            url:'storePublickey',
            method:'POST',
            contentType:'application/json',
            data:JSON.stringify(
                {
                    uname:user,
                    pubKey:value
                }
            ),
            success:function(response)
            {
                if(response=="empty")
                alert("error occured")
            },
            error:function(res)
            {
                alert("error occured")
            }
        }
    )
} 