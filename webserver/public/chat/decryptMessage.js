function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  function b642ab(base64string){
    return Uint8Array.from(window.atob(base64string), c => c.charCodeAt(0));
  }
  

  


function decryptMessage(content,uid,fid,i)
  {
    
    return new Promise((s,r)=>{
        key=localStorage.getItem(uid+fid)
    
        importKey(key).then((key)=>{
           
          let encoded = b642ab(content);
          //iv = window.crypto.getRandomValues(new Uint8Array(12));
          window.crypto.subtle.decrypt(
            {
              name: "AES-GCM",
              iv: Uint8Array.from("helo123456789999", c => c.charCodeAt(0))
            },
            key,
            encoded
          ).then((data)=>{
              
            let dec = new TextDecoder();
            rtValue=dec.decode(data);
            s({data:rtValue,index:i})
          }).catch((err)=>{
              console.log(err)
          }) ;
      
        })
      })
  }
  
  