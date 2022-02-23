async function _base64ToArrayBuffer(base64) {
    return new Promise((s,r)=>{
      var binary_string = window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
      }
      s(bytes.buffer)
    })
  }  
  function getMessageEncoding(content) {
    let message = content;
    let enc = new TextEncoder();
    return enc.encode(message);
  }
  
  function importKey(key)
  {
    //console.log("the key to import is: ",key)
    return new Promise((s,r)=>{
      _base64ToArrayBuffer(key).then((data)=>{
        const rawKey = data
         window.crypto.subtle.importKey(
            "raw",
            rawKey,
            "AES-GCM",
            true,
            ["encrypt", "decrypt"]
          ).then((key)=>{
            s(key)
          });
      })
    })
    
  }
  async function encryptMessage(content,fid)
  {
    return new Promise((s,r)=>{
      key=localStorage.getItem(uid+fid)
  
      importKey(key).then((key)=>{
  
        let encoded = getMessageEncoding(content);
        //console.log(encoded)
        //iv = b642ab("aGVsbG8=")
        window.crypto.subtle.encrypt(
          {
            name: "AES-GCM",
            iv: Uint8Array.from("helo123456789999", c => c.charCodeAt(0))
          },
          key,
          encoded
        ).then((data)=>{
          s(_arrayBufferToBase64(data))
        }).catch((err)=>{
          alert("error 21 occured please refresh")
          console.log(err)
        });
    
      }).catch((err)=>{
        alert("error 22 occured please referesh")
      })
    })
    
  }
  
  
  
  