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
function $ (id) {return document.getElementById(id);}
var Types, Titles = {}, dragSrcEl = null, drag = false; 

Titles['alerts'] = 'Google Alerts';         Titles['analytics'] = 'Google Analytics';
Titles['blog'] = 'Google Blog Search';      Titles['blogger'] = 'Google Blogger';
Titles['book'] = 'Google Book Search';      Titles['calender'] = 'Google Calender';
Titles['code'] = 'Google Code';             Titles['dashboard'] = 'Google Dashboard';
Titles['drive'] = 'Google Drive';           Titles['earth'] = 'Google Earth';
Titles['finance'] = 'Google Finance';       Titles['gmail'] = 'Google Mail';
Titles['groups'] = 'Google Groups';         Titles['image'] = 'Google Image';
Titles['maps'] = 'Google Maps';             Titles['mobile'] = 'Google Mobile';
Titles['music'] = 'Google Music';           Titles['news'] = 'Google News';
Titles['note'] = 'Google Keep';             Titles['panoramio'] = 'Panoramio - Photos of the World';
Titles['picasa'] = 'Picasa';                Titles['play'] = 'Google Play';
Titles['plus'] = 'Google+';                 Titles['print'] = 'Google Cloud Print';
Titles['scholar'] = 'Google Scholar';       Titles['search'] = 'Google Web Search';
Titles['site'] = 'Google Sites';            Titles['sketchup'] = 'SketchUp | 3D for Everyone';
Titles['hangouts'] = 'Google Hangouts';     Titles['translate'] = 'Google Translate';
Titles['trends'] = 'Google Trends';         Titles['wallet'] = 'Google Wallet';
Titles['youtube'] = 'YouTube';              Titles['shopping'] = 'Google Shopping';
Titles['patent'] = 'Google Patent Search';  Titles['hotel'] = 'Google Hotel Finder';

function init(data) {
  Types = data;
  var tds = document.getElementsByTagName('td');
  for (var i = 0; i < tds.length; i++) {
    var id = i.toString();
    $(id).draggable = true;
    $(id).setAttribute('type', Types[i]); 
    tds[i].setAttribute('title', Titles[Types[i]]);
  }
}
background.send('request-inits');
background.receive('request-inits', function (data) {init(data);});
  
function handleDrop(e) {
  var startId = e.dataTransfer.getData("text/plain");
  var startType = $(startId).getAttribute('type');
  startId = parseInt(startId);
  var target = e.target || e.originalTarget;
  var endType = target.getAttribute('type');
  var endId = parseInt(target.getAttribute('id'));
  if (startId >=0 && endId >=0 && startId != endId) {
    if (startId < endId) {
      Types.splice(endId + 1, 0, startType);
      Types.splice(startId, 1);
    }
    else {
      Types.splice(startId, 1);
      Types.splice(endId, 0, startType);
    }  
    background.send('store-types', Types);
  }
}

$('shortcuts-table').addEventListener('dragstart', function (e) {
  drag = true;
  var target = e.target || e.originalTarget;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', target.getAttribute('id'));
  var tds = document.getElementsByTagName('td');
  for (var i = 0; i < tds.length; i++) {
    var id = i.toString();
    $(id).style.border = '1px dashed rgba(0,0,0,0.2)';
    $(id).style.opacity = 0.2;
    $(id).style.cursor = 'url(closedhand.cur), move';
  }
}, false);

$('shortcuts-table').addEventListener('dragenter', function (e) {
  var target = e.target || e.originalTarget;
  if (e.preventDefault) {e.preventDefault();}
  if (parseInt(target.getAttribute('id')) >= 0) {
    target.style.opacity = 1.0;
  }
}, false);

$('shortcuts-table').addEventListener('dragover', function (e) {
  var target = e.target || e.originalTarget;
  if (e.preventDefault) {e.preventDefault();}
  e.dataTransfer.dropEffect = 'move';
}, false);

$('shortcuts-table').addEventListener('dragleave', function (e) {
  var target = e.target || e.originalTarget;
  if (parseInt(target.getAttribute('id')) >= 0) {
    target.style.opacity = 0.2;
  }
}, false);

$('shortcuts-table').addEventListener('drop', function (e) {
  handleDrop(e);
  var target = e.target || e.originalTarget;
  target.style.cursor = 'url(openhand.cur), move';
  if (e.stopPropagation) {e.stopPropagation();}
}, false);

$('shortcuts-table').addEventListener('dragend', function (e) {
  drag = false;
  if (e.preventDefault) {e.preventDefault();}
  var tds = document.getElementsByTagName('td');
  for (var i = 0; i < tds.length; i++) {
    var id = i.toString();
    $(id).style.border = '0';
    $(id).style.opacity = 1.0;
    $(id).style.cursor = 'pointer';
  }
  init(Types);
}, false);

$('shortcuts-table').addEventListener('mouseover', function (e) {
  var target = e.target || e.originalTarget;
  var type = target.getAttribute('type');
  $('status-div').textContent = target.getAttribute('title') || 'Google Shortcuts';
}, false);

$('shortcuts-table').addEventListener('mouseup', function (e) {
  if (drag) return;
  var target = e.target || e.originalTarget;
  var type = target.getAttribute('type');
  if (type) {background.send('open-tab-request', {
    type: type, 
    inBackground: e.button == 1 || (e.ctrlKey && e.button == 0)
  });} 
})