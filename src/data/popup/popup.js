var background = {};
var doResize;
/**** wrapper (start) ****/
if (typeof chrome !== 'undefined') {  // Chrome
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
  window.setTimeout(function () {
    $('more-td').focus();
    $('nc-input').blur();
  }, 100);
  doResize = function () {}
}
else if (typeof safari !== 'undefined') { // Safari
  background = (function () {
    var callbacks = {};
    return {
      send: function (id, data) {
        safari.extension.globalPage.contentWindow.popup.dispatchMessage(id, data);
      },
      receive: function (id, callback) {
        callbacks[id] = callback;
      },
      dispatchMessage: function (id, data) {
        if (callbacks[id]) {
          callbacks[id](data);
        }
      }
    }
  })();
  doResize = function () {
    safari.self.width = document.body.getBoundingClientRect().width;
    safari.self.height = document.body.getBoundingClientRect().height;
  }
  window.addEventListener("resize", doResize, false);
  safari.application.addEventListener("popover", function (){
    window.setTimeout(function () {
      $('more-td').focus();
      $('nc-input').blur();
    }, 100);
  }, false);
}
else {  // Firefox
  background.send = function (id, data) {
    self.port.emit(id, data);
  };
  background.receive = function (id, callback) {
    self.port.on(id, callback);
  };
  doResize = function () {
    self.port.emit("resize", {
      w: document.body.getBoundingClientRect().width,
      h: document.body.getBoundingClientRect().height
    });
  };
  self.port.on("show", function () {
    $('more-td').focus();
    $('nc-input').blur();
  });
  window.addEventListener("resize", doResize, false);
}
/**** wrapper (end) ****/

function $ (id) {return document.getElementById(id);}
var mainTypes, backupTypes, Titles = {}, total_drag = false, isDraging = false, toggle = true;
var height_1 = 0, height_2 = 0, width = 0;

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
Titles['offers'] = 'Google Offers';                     Titles['ideas'] = 'Google Ideas';
Titles['urlshortner'] = 'Google URL Shortner';          Titles['inputtool'] = 'Google Input Tool';
Titles['webhistory'] = 'Google Web History';            Titles['developersdashboard'] = 'Google Developement Dash';
Titles['webmaster'] = 'Google Webmaster';               Titles['currents'] = 'Google Currents';
Titles['chromebook'] = 'Google Chromebook';             Titles['correlate'] = 'Google Correlate';
Titles['chromium'] = 'Chromium';                        Titles['contacts'] = 'Google Contacts';
Titles['adwords'] = 'Google Adwords';                   Titles['adsense'] = 'Google Adsense';
Titles['video'] = 'Google Videos';                      Titles['voice'] = 'Google Voice'; 
Titles['catalogs'] = 'Google Catalogs';  
Titles[''] = '';                                        Titles['emptyCell'] = '';
 
function init(data, name) {
  var id_pref, count = 0;
  if (name == 'shortcuts-table') id_pref = 'm';
  if (name == 'backup-table') id_pref = 'b';
  var nc = parseInt($('nc-input').value);
  var table = document.getElementById(name);
  var trs = table.getElementsByTagName('tr');
  for (var i = 0; i < trs.length; i++) {
    var tds = trs[i].getElementsByTagName('td');
    for (var k = 0; k < tds.length; k++) { // first reset icons
      tds[k].draggable = false;
      tds[k].setAttribute('status', 'empty');
    }
    for (var j = 0; j < nc; j++) {
      var id = id_pref + count.toString();
      var td = tds[j];
      td.setAttribute('id', id);
      td.removeAttribute('status');
      td.removeAttribute('type'); 
      td.removeAttribute('title');
      if (count < data.length && data[count]) {
        td.draggable = true;
        td.setAttribute('type', data[count]); 
        td.setAttribute('title', Titles[data[count]]);
      }
      else {
        td.draggable = false;
        td.setAttribute('status', 'empty');
      }
      count++;
    }
  }
  
  width = $('shortcuts-table').getBoundingClientRect().width;
  height_1 = $('shortcuts-table').getBoundingClientRect().height;
  height_2 = $('backup-table').getBoundingClientRect().height;
  document.body.style.height = (height_1 + (height_2 ? height_2 + 23 : 0) + 45) + 'px';
  document.body.style.width = (nc * 40) + 'px';
  $('status-td').style.width = ((nc - 3) * 40) + 'px'; 
  $('status-td').style.minWidth = ((nc - 3) * 40) + 'px'; 
  $('status-td').style.maxWidth = ((nc - 3) * 40) + 'px'; 
  doResize();
}

background.receive('request-inits', function (data) {
  mainTypes = data; 
  init(mainTypes, 'shortcuts-table');
});
background.receive('popup-width', function (data) {
  $('nc-input').value = data;
});
background.send('request-inits');

background.receive('request-backup-inits', function (data) {
  backupTypes = data; 
  init(backupTypes, 'backup-table');
});
background.send('request-backup-inits');

$('more-td').addEventListener('click', function (e) {
  var target = e.target || e.originalTarget;
  if (toggle) {
    total_drag = true;
    $('backup-table').style.display = 'table';
    $('separator-table').style.display = 'table';
    target.setAttribute('status', 'active');
    target.setAttribute("title", "Click to hide more icons");
    toggle = false;
  }
  else {
    total_drag = false;
    $('backup-table').style.display = 'none';
    $('separator-table').style.display = 'none';
    target.removeAttribute('status');
    target.setAttribute("title", "Click to see hidden icons");
    toggle = true;
  }
  init(mainTypes, 'shortcuts-table');
  init(backupTypes, 'backup-table');
}, false);

function onMouseup (e) {
  if (isDraging) return;
  var target = e.target || e.originalTarget;  
  var type = target.getAttribute('type');
  if (type) {background.send('open-tab-request', {
    type: type, 
    inBackground: (e.ctrlKey && e.button == 0) || (e.metaKey && e.button == 0) || e.button == 1
  });} 
}
// onClick does not fire e.button == 1 on Firefox
$('shortcuts-table').addEventListener('mouseup', onMouseup, false);
$('backup-table').addEventListener('mouseup', onMouseup, false);

$('reset-td').addEventListener('click', function (e) {
  background.send('reset-history');
});

$('nc-input').addEventListener('change', function (e) {
  var target = e.target || e.originalTarget;  
  var nc = parseInt(target.value) || 6;
  if (nc > 19) nc = 19;
  if (nc < 5) nc = 5;
  target.value = nc;
  background.send('store-popup-width', nc);
  init(mainTypes, 'shortcuts-table');
  init(backupTypes, 'backup-table');
});

$('status-div').addEventListener('mouseover', function (e) {
  var target = e.target || e.originalTarget;
  $('status-td').textContent = target.getAttribute('title') || 'Google Shortcuts';
}, false);