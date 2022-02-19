function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  async function b642ab(base64string){
    return Uint8Array.from(window.atob(base64string), c => c.charCodeAt(0));
  }
  
  function decryptMessage(content,keyPerson)
  {
    rtvalue=""
    pem=localStorage.getItem(uid+'privatekey') 
     
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
      const pemFooter = "-----END PRIVATE KEY-----";
      const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
      // base64 decode the string to get the binary data
      const binaryDerString = window.atob(pemContents);
      // convert from a binary string to an ArrayBuffer
      const binaryDer = str2ab(binaryDerString);
    
       window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["decrypt"]
      ).then((data)=>{
          let enc = new TextEncoder();
          enc=b642ab(content)
          window.crypto.subtle.decrypt(
              {
                name: "RSA-OAEP",
                hash: "SHA-256",
              },
              data,
              enc
            ).then((data)=>{
              var enc = new TextDecoder("utf-8");
              var arr = new Uint8Array(data);
              rtvalue= enc.decode(arr)
              //return(enc.decode(arr))
            }).catch((res)=>{
                console.log(res)
            });
      });
  }
  

function getEncodedKeyValue(uid,fid)
{
  return new Promise((s,r)=>{
    $.ajax(
      {
          url:'/getTempKeys',
          method:'POST',
          contentType:'application/json',
          data:JSON.stringify(
              {
                  uid:uid,
                  f_id:fid
              }
          ),
          success:function(res)
          {
            if(res=="empty")
            r(res)
            else
            s(res)
          }
      }
  )
  })  
  
}

function loadKeys(uid,f_id)
{
    return new Promise((s,r)=>{
        pem=localStorage.getItem(uid+'privatekey') 
       // console.log(pem,keyPerson) 
        const pemHeader = "-----BEGIN PRIVATE KEY-----";
          const pemFooter = "-----END PRIVATE KEY-----";
          const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
          // base64 decode the string to get the binary data
          const binaryDerString = window.atob(pemContents);
          // convert from a binary string to an ArrayBuffer
          const binaryDer = str2ab(binaryDerString);
        
           window.crypto.subtle.importKey(
            "pkcs8",
            binaryDer,
            {
              name: "RSA-OAEP",
              hash: "SHA-256",
            },
            true,
            ["decrypt"]
          ).then((Mykey)=>{
              
              
              getEncodedKeyValue(uid,f_id).then(async (enc)=>{
                enc=await b642ab(enc)
                window.crypto.subtle.decrypt(
                    {
                      name: "RSA-OAEP",
                      hash: "SHA-256",
                    },
                    Mykey,
                    enc
                  ).then((data)=>{
                    var enc = new TextDecoder("utf-8");
                    var arr = new Uint8Array(data);
                    rtvalue= enc.decode(arr)
                    
                    s(rtvalue)
                    //return(enc.decode(arr))
                  }).catch((res)=>{
                      console.log(res)
                  });
            });

              }
              
              )
             
    });
}  