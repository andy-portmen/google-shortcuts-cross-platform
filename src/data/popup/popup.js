/********/
var background = {};
if (typeof chrome !== 'undefined') {
  background.send = function (id, data) {
    chrome.extension.sendRequest({method: id, data: data});
  }
  background.receive = function (id, callback) {
    chrome.extension.onRequest.addListener(function(request, sender, callback2) {
      if (request.method == id) {
        callback(request.data);
      }
    });
  }
}
else {
  background.send = function (id, data) {
    self.port.emit(id, data);
  }
  background.receive = function (id, callback) {
    self.port.on(id, callback);
  }
}
/********/

function $ (id) {
  return document.getElementById(id);
}
$('shortcuts-table').addEventListener('mouseover', function (e) {
  var target = e.target || e.originalTarget;
  $('status-div').textContent = target.getAttribute('title') || 'Google Shortcuts';
}, false);

$('shortcuts-table').addEventListener('click', function (e) {
  var target = e.target || e.originalTarget;
  var type = target.getAttribute('type');
  if (type) {
    background.send('open-tab-request', type);
  }
}, false);