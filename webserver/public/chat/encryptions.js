function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  
  function ab2b64(arrayBuffer) {
    v=new Uint8Array(arrayBuffer)
    var binary=''
    for (var i = 0; i < v.length; i++) {
      binary += String.fromCharCode( v[ i ] );
  }
    return window.btoa(binary);
  }
  
  function encryptKeys(content,toid)
  {
    return new Promise((s,r)=>{
    $.ajax(
      {
        url:'/getPublicKey',
        method:'POST',
        contentType:'application/json',
        data:JSON.stringify(
          {
            id:toid,
            uid:uid
          }
        ),
        success:function(res)
        {
          if(res=="empty")
          alert("error occured please contact namangns1@gmail.com")
          else if(res=="ae"){
          alert("User does not exists")
            r("ae")
        }
          else if(res.status=="ok")
          {
            const pem =res.pubKey
            const pemHeader = "-----BEGIN PUBLIC KEY-----";
            const pemFooter = "-----END PUBLIC KEY-----";
            const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
            // base64 decode the string to get the binary data
            const binaryDerString = window.atob(pemContents);
            const binaryDer = str2ab(binaryDerString);
  
            return window.crypto.subtle.importKey(
              "spki",
              binaryDer,
              {
                name: "RSA-OAEP",
                hash: "SHA-256"
              },
              true,
              ["encrypt"]
            ).then((key)=>{
                
                let message = content
                let enc = new TextEncoder();
                enc= enc.encode(message);
                return window.crypto.subtle.encrypt(
                    {
                      name: "RSA-OAEP"
                    },
                    key,
                    enc
                  ).then((data)=>{
                    
                    s(ab2b64(data))
                    
                  });
            });
          }
          else
          {
            alert("error in encryption of keys beacuse of server")
          }
        },
        error:function(res)
        {
          alert("error in encryption of keys request")
          console.log(JSON.stringify(res))
        }
      }
    )
    }
    );
  }
  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }
  
  function getKeys(uid,fid)
  {
  return new Promise((s,r)=>{
    window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      true,
      ["encrypt", "decrypt"]
    ).then((key)=>{



         window.crypto.subtle.exportKey(
            "raw",
            key
          ).then((exported)=>{


            const exportedKeyBuffer = new Uint8Array(exported);
            const exportedAsString = ab2str(exportedKeyBuffer);
            const exportedAsBase64 = window.btoa(exportedAsString);
            localStorage.setItem(uid+fid,exportedAsBase64)
            encryptKeys(exportedAsBase64,fid).then((data)=>{
                s(data)
            }).catch((data)=>{
              r()
            })


          });
          

    });
  
    
  });
}