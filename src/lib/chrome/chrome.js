var _chrome = {
  storage: (function () {
    var objs = {};
    chrome.storage.local.get(null, function (o) {
      objs = o;
      document.getElementById("common").src = "../common.js";
    });
    return {
      read : function (id) {
        return objs[id];
      },
      write : function (id, data) {
        objs[id] = data;
        var tmp = {};
        tmp[id] = data;
        chrome.storage.local.set(tmp, function () {});
      }
    }
  })(),
  
  popup: {
    send: function (id, data) {
      chrome.runtime.sendMessage({path: 'background-to-popup', method: id, data: data});
    },
    receive: function (id, callback) {
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.path == 'popup-to-background') {
          if (request.method == id) {
            callback(request.data);
          }
        }
      });
    }
  },
  
  tab: {
    open: function (url, inBackground, inCurrent) {
      if (inCurrent) {   
        chrome.tabs.update(null, {url: url});
      }
      else {
        chrome.tabs.create({
          url: url,
          active: typeof inBackground == 'undefined' ? true : !inBackground
        });
      }
    }
  },
  
  version: function () {
    return chrome[chrome.runtime && chrome.runtime.getManifest ? "runtime" : "extension"].getManifest().version;
  }
}