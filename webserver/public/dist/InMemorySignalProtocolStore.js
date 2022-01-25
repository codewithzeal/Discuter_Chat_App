  function SignalProtocolStore() {
  this.store = {};
}

SignalProtocolStore.prototype = {
  Direction: {
    SENDING: 1,
    RECEIVING: 2,
  },

  getIdentityKeyPair: function() {
    ikp=JSON.parse(localStorage.getItem(sender+'ikp'))
    ikp.privKey=base64ToArrayBuffer(ikp.privKey)
    ikp.pubKey=base64ToArrayBuffer(ikp.pubKey)
    return Promise.resolve(ikp);
  },
  getLocalRegistrationId: function() {
    return Promise.resolve(parseInt(localStorage.getItem(sender+'rid')));
  },
  put: function(key, value) {
    if (key === undefined || value === undefined || key === null || value === null)
      throw new Error("Tried to store undefined/null");
    this.store[key] = value;
    localStorage.setItem(key,value)
  },
  get: function(key, defaultValue) {
    if (key === null || key === undefined)
      throw new Error("Tried to get value for undefined/null key");
    if (key in this.store) {
      return localStorage.getItem(key);
    } else {
      return defaultValue;
    }
  },
  remove: function(key) {
    if (key === null || key === undefined)
      throw new Error("Tried to remove value for undefined/null key");
    delete this.store[key];
    localStorage.removeItem(key)
  },

  isTrustedIdentity: function(identifier, identityKey, direction) {
    if (identifier === null || identifier === undefined) {
      throw new Error("tried to check identity key for undefined/null key");
    }
    if (!(identityKey instanceof ArrayBuffer)) {
      throw new Error("Expected identityKey to be an ArrayBuffer");
    }
    var trusted = base64ToArrayBuffer(JSON.parse(localStorage.getItem(sender+'ikp')).pubKey)
    if (trusted === undefined) {
      return Promise.resolve(true);
    }
    return Promise.resolve(identityKey.toString() === trusted.toString());
  },
  loadIdentityKey: function(identifier) {
    if (identifier === null || identifier === undefined)
      throw new Error("Tried to get identity key for undefined/null key");
      p=base64ToArrayBuffer(JSON.parse(localStorage.getItem(sender+'ikp')).pubKey)
    return Promise.resolve(p);
  },
  saveIdentity: function(identifier, identityKey) {
    if (identifier === null || identifier === undefined)
      throw new Error("Tried to put identity key for undefined/null key");

    var address = new libsignal.SignalProtocolAddress.fromString(identifier);

    var existing = ''//base64ToArrayBuffer(JSON.parse(localStorage.getItem(uname+'ikp')).pubKey)
    //this.put('identityKey' + address.getName(), identityKey)

    if (existing && util.toString(identityKey) !== util.toString(existing)) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }

  },

  /* Returns a prekeypair object or undefined */
  loadPreKey: function(keyId) {
    keyPair=JSON.parse(localStorage.getItem(sender+'pkey'))
    keyPair.pubKey=base64ToArrayBuffer(keyPair.pubKey)
    keyPair.privKey=base64ToArrayBuffer(keyPair.privKey)

  
      res = { pubKey: keyPair.pubKey, privKey: keyPair.privKey };
   
    return Promise.resolve(res);
  },
  storePreKey: function(keyId, keyPair) {
    keyPair.pubKey=arrayBufferToBase64(keyPair.pubKey)
    keyPair.privKey=arrayBufferToBase64(keyPair.privKey)
    keyPair=JSON.stringify(keyPair)
    return Promise.resolve(this.put(uname + 'pkey', keyPair));
  },
  removePreKey: function(keyId) {
    return Promise.resolve(this.remove('25519KeypreKey' + keyId));
  },

  /* Returns a signed keypair object or undefined */
  loadSignedPreKey: function(keyId) {
    keyPair=localStorage.getItem(sender+'spk')
    keyPair=JSON.parse(keyPair)
    keyPair.keyPair.pubKey=base64ToArrayBuffer(keyPair.keyPair.pubKey)
    keyPair.keyPair.privKey=base64ToArrayBuffer(keyPair.keyPair.privKey)
    keyPair.signature=base64ToArrayBuffer(keyPair.signature)
    if (keyPair !== undefined) {
      res = { pubKey: keyPair.keyPair.pubKey, privKey: keyPair.keyPair.privKey };
    }
    return Promise.resolve(res);
  },
  storeSignedPreKey: function(keyId, keyPair) {
    keyPair.keyPair.pubKey=arrayBufferToBase64(keyPair.keyPair.pubKey)
    keyPair.keyPair.privKey=arrayBufferToBase64(keyPair.keyPair.privKey)
    keyPair.signature=arrayBufferToBase64(keyPair.signature)
    keyPair=JSON.stringify(keyPair)
    return Promise.resolve(this.put(uname+'spk', keyPair));
  },
  removeSignedPreKey: function(keyId) {
    return Promise.resolve(this.remove('25519KeysignedKey' + keyId));
  },

  loadSession: function(identifier) {
    return Promise.resolve(this.get('session' + identifier));
  },
  storeSession: function(identifier, record) {
    return Promise.resolve(this.put('session' + identifier, record));
  },
  removeSession: function(identifier) {
    return Promise.resolve(this.remove('session' + identifier));
  },
  removeAllSessions: function(identifier) {
    for (var id in this.store) {
      if (id.startsWith('session' + identifier)) {
        delete this.store[id];
      }
    }
    return Promise.resolve();
  }
};
