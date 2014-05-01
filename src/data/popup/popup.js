/********/
var doResize;
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
  doResize = function () {}
}
else {
  background.send = function (id, data) {
    self.port.emit(id, data);
  }
  background.receive = function (id, callback) {
    self.port.on(id, callback);
  }
  
  doResize = function () {
    self.port.emit("resize", {
      w: document.body.getBoundingClientRect().width, 
      h: document.body.getBoundingClientRect().height}
    );
  }
  window.addEventListener("resize", doResize, false);
}
/********/
function $ (id) {return document.getElementById(id);}
var mainTypes, backupTypes, Titles = {}, total_drag = false, isDraging = false, toggle = true;
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
  var id_pref, count = 0;;
  if (name == 'shortcuts-table') {mainTypes = data; id_pref = 'm';}
  if (name == 'backup-table')    {backupTypes = data; id_pref = 'b';}
  var table = document.getElementById(name); emptyTable(table);
  var trs = table.getElementsByTagName('tr');
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
  doResize();
}

background.send('request-inits');
background.send('request-backup-inits');
background.receive('request-inits', function (data) {init(data, 'shortcuts-table');});
background.receive('request-backup-inits', function (data) {init(data, 'backup-table');});

$('more-td').addEventListener('click', function (e) {
  var target = e.target || e.originalTarget;
  if (toggle) {
    total_drag = true;
    $('backup-table').style.display = 'table';
    $('separator-table').style.display = 'table';
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
  doResize();
}, false);

$('main-div').addEventListener('mouseover', function (e) {
  var target = e.target || e.originalTarget;
  var type = target.getAttribute('type');
  $('status-td').textContent = target.getAttribute('title') || 'Google Shortcuts';
}, false);

$('shortcuts-table').addEventListener('click', function (e) {
  if (isDraging) return;
  var target = e.target || e.originalTarget;  
  var type = target.getAttribute('type');
  if (type) {background.send('open-tab-request', {
    type: type, 
    inBackground: e.button == 1 || (e.ctrlKey && e.button == 0)
  });} 
})

$('backup-table').addEventListener('click', function (e) {
  if (isDraging) return;
  var target = e.target || e.originalTarget;  
  var type = target.getAttribute('type');
  if (type) {background.send('open-tab-request', {
    type: type, 
    inBackground: e.button == 1 || (e.ctrlKey && e.button == 0)
  });} 
})