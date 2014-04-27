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
var mainTypes, backupTypes, Titles = {}, main_drag = false, total_drag = false, toggle = true;
var height_1 = 0, height_2 = 0;

Titles['alerts'] = 'Google Alerts';                     Titles['analytics'] = 'Google Analytics';
Titles['blog'] = 'Google Blog Search';                  Titles['blogger'] = 'Google Blogger';
Titles['book'] = 'Google Book Search';                  Titles['calender'] = 'Google Calender';
Titles['code'] = 'Google Code';                         Titles['dashboard'] = 'Google Dashboard';
Titles['drive'] = 'Google Drive';                       Titles['earth'] = 'Google Earth';
Titles['finance'] = 'Google Finance';                   Titles['gmail'] = 'Google Mail';
Titles['groups'] = 'Google Groups';                     Titles['image'] = 'Google Image';
Titles['maps'] = 'Google Maps';                         Titles['mobile'] = 'Google Mobile';
Titles['music'] = 'Google Music';                       Titles['news'] = 'Google News';
Titles['note'] = 'Google Keep';                         Titles['panoramio'] = 'Panoramio';
Titles['picasa'] = 'Picasa';                            Titles['play'] = 'Google Play';
Titles['plus'] = 'Google+';                             Titles['print'] = 'Google Cloud Print';
Titles['scholar'] = 'Google Scholar';                   Titles['search'] = 'Google Web Search';
Titles['site'] = 'Google Sites';                        Titles['sketchup'] = 'SketchUp | 3D for Everyone';
Titles['hangouts'] = 'Google Hangouts';                 Titles['translate'] = 'Google Translate';
Titles['trends'] = 'Google Trends';                     Titles['wallet'] = 'Google Wallet';
Titles['youtube'] = 'YouTube';                          Titles['shopping'] = 'Google Shopping';
Titles['patent'] = 'Google Patent Search';              Titles['hotel'] = 'Google Hotel Finder';
Titles['android'] = 'Android';                          Titles['wdyl'] = 'What Do You Love';
Titles['bookmarks'] = 'Google Bookmarks';               Titles['webpagetest'] = 'Google Webpage Test';
Titles['cloudeplatform'] = 'Google Cloude Platform';    Titles['transit'] = 'Google Transit';
Titles['feedburner'] = 'Google Feedburner';             Titles['sky'] = 'Google Sky';
Titles['fusion'] = 'Google Fusion Tables';              Titles['mars'] = 'Google Mars';
Titles['offer'] = 'Google Offers';                      Titles['ideas'] = 'Google Ideas';
Titles['urlshortner'] = 'Google URL Shortner';          Titles['inputtool'] = 'Google Input Tool';
Titles['webhistory'] = 'Google Web History';            Titles['developersdashboard'] = 'Google Developement Dash';
Titles['webmaster'] = 'Google Webmaster';               Titles['currents'] = 'Google Currents';
Titles['chromebook'] = 'Google Chromebook';             Titles['correlate'] = 'Google Correlate';
Titles['chromium'] = 'Chromium';                        Titles['contacts'] = 'Google Contacts';
Titles['adwords'] = 'Google Adwords';                   Titles['adsense'] = 'Google Adsense';
Titles[''] = '';

function calculateHeight(name) {
  var nActiveTrs = 0;
  var table = document.getElementById(name);
  var trs = table.getElementsByTagName('tr');
  for (var i = 0; i < trs.length; i++) {
    var tds = trs[i].getElementsByTagName('td');
    if (tds[0].getAttribute('status') == 'empty') break;
    nActiveTrs++;
  }
  var height = nActiveTrs * 43;
  return height;
}
  
function emptyTable(table) { 
  var trs = table.getElementsByTagName('tr');
  for (var i = 0; i < trs.length; i++) {
  var tds = trs[i].getElementsByTagName('td');
  for (var j = 0; j < tds.length; j++) {
    var td = tds[j];
    var id = 'undefined';
    td.setAttribute('id', id);
    td.removeAttribute('type'); 
    td.removeAttribute('title');
    td.removeAttribute('status');
    }
  }
} 
 
function init(data, name) { 
  var id_pref;
  if (name == 'shortcuts-table') {mainTypes = data; id_pref = 'm';}
  if (name == 'backup-table')    {backupTypes = data; id_pref = 'b';}
  var table = document.getElementById(name); 
  emptyTable(table);
  var trs = table.getElementsByTagName('tr');
  var count = 0;
  for (var i = 0; i < trs.length; i++) {
    var tds = trs[i].getElementsByTagName('td');
    for (var j = 0; j < tds.length; j++) {
      var td = tds[j];
      var id = id_pref + count.toString();
      td.setAttribute('id', id);
      if (count < data.length && data[count]) {
        td.draggable = true;
        td.setAttribute('type', data[count]); 
        td.setAttribute('title', Titles[data[count]]);
        count++;
      }
      else {
        td.setAttribute('status', 'empty');
        td.removeAttribute('type'); 
        td.removeAttribute('title');
      }
    }
  }
  if (name == 'shortcuts-table') {height_1 = calculateHeight(name);}
  if (name == 'backup-table')    {height_2 = calculateHeight(name);}

  if (total_drag) { 
    $('main-div').style.height = height_1 + height_2 + 55 + 'px';
    document.body.style.height = height_1 + height_2 + 55 + 45 + 'px';
  }
  else {
    $('main-div').style.height = height_1 + 'px';
    document.body.style.height = height_1 + 45 + 'px';
  }
}

function handleDrop(e, types, name) {
  if (total_drag) return;
  var target = e.target || e.originalTarget;
  var startId = e.dataTransfer.getData("text/plain");
  var startType = $(startId).getAttribute('type');
  startId = parseInt(startId.substring(1));
  var endType = target.getAttribute('type');
  var endId = parseInt(target.getAttribute('id').substring(1));
  if (startId >= 0 && endId >= 0 && startId != endId) {
    if (startId < endId) {
      types.splice(endId + 1, 0, startType);
      types.splice(startId, 1);
    }
    else {
      types.splice(startId, 1);
      types.splice(endId, 0, startType);
    }  
    background.send(name, types);
  }
}

function handleDropTotal(e, mainTypes, backupTypes) {
  var target = e.target || e.originalTarget;
  var startId = e.dataTransfer.getData("text/plain");
  var endId = target.getAttribute('id');
  var startType = $(startId).getAttribute('type');
  var endType = target.getAttribute('type');
  if (startType && endType && startId != endId) {
    if (startId.charAt(0) == 'm' && endId.charAt(0) == 'b') {
      var endId = parseInt(endId.substring(1));
      var startId = parseInt(startId.substring(1));
      backupTypes.splice(endId + 1, 0, startType);   // insert
      mainTypes.splice(startId, 1);                  // delete
    }
    else if (startId.charAt(0) == 'b' && endId.charAt(0) == 'm') {
      var endId = parseInt(endId.substring(1));
      var startId = parseInt(startId.substring(1));
      mainTypes.splice(endId + 1, 0, startType);     // insert
      backupTypes.splice(startId, 1);                // delete
    }
  }
  background.send('store-mainTypes', mainTypes);
  background.send('store-backupTypes', backupTypes);
}

background.send('request-inits');
background.send('request-backup-inits');
background.receive('request-inits', function (data) {init(data, 'shortcuts-table');});
background.receive('request-backup-inits', function (data) {init(data, 'backup-table');});

$('more-td').addEventListener('click', function (e) {
  var target = e.target || e.originalTarget;
  if (toggle) {
    total_drag = true;
    $('backup-table').style.display = 'block';
    $('separator-table').style.display = 'block';
    target.setAttribute('status', 'active');
    toggle = false;
  }
  else {
    total_drag = false;
    $('backup-table').style.display = 'none';
    $('separator-table').style.display = 'none';
    target.removeAttribute('status');
    toggle = true;
  }
  init(mainTypes, 'shortcuts-table');
  init(backupTypes, 'backup-table');
}, false);

$('main-div').addEventListener('mouseover', function (e) {
  var target = e.target || e.originalTarget;
  var type = target.getAttribute('type');
  $('status-td').textContent = target.getAttribute('title') || '';
}, false);

$('shortcuts-table').addEventListener('mouseup', function (e) {
  if (main_drag || total_drag) return;
  var target = e.target || e.originalTarget;
  var type = target.getAttribute('type');
  if (type) {background.send('open-tab-request', {
    type: type, 
    inBackground: e.button == 1 || (e.ctrlKey && e.button == 0)
  });} 
})