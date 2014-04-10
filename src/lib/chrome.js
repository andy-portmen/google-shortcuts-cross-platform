/** version 4 **/

var _chrome = {
  storage: {
    read: function (id) {
      return localStorage[id] || null;
    },
    write: function (id, data) {
      localStorage[id] = data + "";
    }
  },
  popup: {
    send: function (id, data) {
      chrome.extension.sendRequest({method: id, data: data});
    },
    receive: function (id, callback) {
      chrome.extension.onRequest.addListener(function(request, sender, callback2) {
        if (request.method == id) {
          callback(request.data);
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