var background = {}, doResize;

/**** wrapper (start) ****/
if (typeof chrome !== 'undefined') {  /* Chrome */
  background.send = function (id, data) {
    chrome.runtime.sendMessage({path: 'popup-to-background', method: id, data: data});
  }
  background.receive = function (id, callback) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.path == 'background-to-popup') {
        if (request.method == id) {
          callback(request.data);
        }
      }
    });
  }
  window.setTimeout(function () {}, 100);
  doResize = function () {}
}
else if (typeof safari !== 'undefined') { /* Safari */
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
    window.setTimeout(function () {}, 100);
  }, false);
}
else { /* Firefox */
  background.send = function (id, data) {
    self.port.emit(id, data);
  };
  background.receive = function (id, callback) {
    self.port.on(id, callback);
  };
  doResize = function () {
    self.port.emit("resize", { /* (+1) is for a bug in Firefox for Mac */
      w: document.body.getBoundingClientRect().width + 1,
      h: document.body.getBoundingClientRect().height + 1
    });
  };
  window.addEventListener("resize", doResize, false);
  self.port.on("hide", function () {
    /* close more section */
    if ($('backup-table').style.display && $('backup-table').style.display !== "none") {
      showMore({
        target: $('more-td')
      });
    }
  });
}
/**** wrapper (end) ****/

function $ (id) {return document.getElementById(id);}
var mainTypes, iconSize, popupWidth, closePanel, panelColor, fontColor, backupTypes, Titles = {}, total_drag = false, isDraging = false, toggle = true;
var height_1 = 0, height_2 = 0, width = 0, iconPadding = 10;
var isFirefox = (typeof self !== 'undefined' && self.port);
var isSafari = (typeof safari !== 'undefined');

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
Titles['catalogs'] = 'Google Catalogs';                 Titles['authenticator'] = 'Google Authenticator';
Titles['business'] = 'Google Business';                 Titles['computeengine'] = 'Google Compute Engine';
Titles['coordinate'] = 'Google Maps Coordinate';        Titles['earthengine'] = 'Google Earth Engine';
Titles['fonts'] = 'Google Fonts';                       Titles['forms'] = 'Google Forms';
Titles['glass'] = 'Google Glass';                       Titles['goggles'] = 'Google Goggles';
Titles['help'] = 'Google Help';                         Titles['partnerdash'] = 'Google Partnerdash';
Titles['photos'] = 'Google Photos';                     Titles['local'] = 'Google Local';
Titles['presentation'] = 'Google Presentation';         Titles['script'] = 'Google App Script';
Titles['streetview'] = 'Google Street View';            Titles['sync'] = 'Google Sync';
Titles['tagmanager'] = 'Google Tag Manager';            Titles['tasks'] = 'Google Tasks';
Titles['webstore'] = 'Chrome Web Store';                Titles['mapsengine'] = 'Google Maps Engine';
Titles['chrome'] = 'Google Chrome';                     Titles['slides'] = 'Google Slides';
Titles['sheets'] = 'Google Sheets';                     Titles['privacy'] = 'Google Privacy Checkup';
Titles['admin'] = 'Google Admin';                       Titles['apps'] = 'Google Apps for Work';
Titles['flights'] = 'Google Flights';                   Titles['domains'] = 'Google Domains';
Titles['security'] = 'Google Security Checkup';         Titles['docs'] = 'Google Docs';
Titles['drawings'] = 'Google Drawings';                 Titles['inbox'] = 'Inbox by Gmail';
Titles['support'] = 'Google Support';                   Titles['account'] = 'Google My Account';
Titles['admob'] = 'Google AdMob';                       Titles['store'] = 'Google Store';
Titles['meet'] = 'Google Meet';                         Titles[''] = '';
Titles[''] = '';                                        Titles['emptyCell'] = '';

function init(data, name) {
  var id_pref, count = 0;
  if (name == 'shortcuts-table') id_pref = 'm';
  if (name == 'backup-table') id_pref = 'b';
  var nc = parseInt($('panel-size-input').value);
  var table = document.getElementById(name);
  var trs = table.getElementsByTagName('tr');
  document.body.style.color = fontColor;
  document.body.style.backgroundColor = '#' + panelColor;
  if (fontColor == '#444444') {
    $('more-td').setAttribute('type', 'black');
    $('settings-td').setAttribute('type', 'black');
  }
  else {
    $('more-td').setAttribute('type', 'white');
    $('settings-td').setAttribute('type', 'white');
  }
  var inputs = document.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].style.color = fontColor;
  }
  for (var i = 0; i < trs.length; i++) {
    var tds = trs[i].getElementsByTagName('td');
    for (var k = 0; k < tds.length; k++) { // first reset icons
      tds[k].draggable = false;
      tds[k].removeAttribute('id');
      tds[k].removeAttribute('type');
      tds[k].removeAttribute('title');
      tds[k].setAttribute('status', 'empty');
    }
  }
  for (var i = 0; i < trs.length; i++) {
    var tds = trs[i].getElementsByTagName('td');
    for (var j = 0; j < nc; j++) {
      var id = id_pref + count.toString();
      var td = tds[j];
      td.setAttribute('id', id);
      if (count < data.length && data[count]) {
        td.draggable = true;
        td.removeAttribute('status');
        td.setAttribute('type', data[count]);
        td.setAttribute('title', Titles[data[count]]);
        var wIC = parseInt($('icon-size-input').value) + "px";
        var wTD = parseInt($('icon-size-input').value) + iconPadding + "px";
        td.style.width = wTD;
        td.style.minWidth = wTD;
        td.style.maxWidth = wTD;
        td.style.height = wTD;
        td.style.minHeight = wTD;
        td.style.maxHeight = wTD;
        td.style.backgroundSize = wIC;
      }
      count++;
    }
  }
  var width = nc * (parseInt($('icon-size-input').value) + iconPadding);
  var height_1 = $('shortcuts-table').getBoundingClientRect().height;
  var height_2 = $('backup-table').getBoundingClientRect().height;
  var height_3 = $('status-div').getBoundingClientRect().height;
  var height_4 = $('settings-div').getBoundingClientRect().height;
  var height_5 = $('separator-table').getBoundingClientRect().height;
  var height = height_1 + height_2 + height_3 + height_4 + height_5 + 20;
  /* for panel width bug in safari and firefox */
  if (isFirefox && height_4) height += 3;
  if (isSafari && height_4) height += 2;
  document.body.style.height = height + 'px';
  document.body.style.width = width + 'px';
  doResize();
}

function initAll() {
  init(mainTypes, 'shortcuts-table');
  init(backupTypes, 'backup-table');
}

background.receive('request-inits', function (data) {
  mainTypes = data.mainTypes;
  backupTypes = data.backupTypes;
  iconSize = data.iconSize;
  popupWidth = data.popupWidth;
  closePanel = data.closePanel;
  panelColor = data.panelColor;
  fontColor = data.fontColor;
  $('icon-size-input').value = iconSize;
  $('panel-size-input').value = popupWidth;
  $('panel-color-input').value = panelColor;
  $('close-panel').setAttribute('state', closePanel);
  initAll();
});
background.send('request-inits');

function showMore(e) {
  var target = e.target || e.originalTarget;
  if (toggle) {
    total_drag = true;
    $('backup-table').style.display = 'table';
    $('separator-table').style.display = 'table';
    target.setAttribute('status', 'active');
    target.setAttribute("title", "Click to collapse hidden section");
    toggle = false;
  }
  else {
    total_drag = false;
    $('backup-table').style.display = 'none';
    $('separator-table').style.display = 'none';
    target.removeAttribute('status');
    target.setAttribute("title", "Click to see all products");
    toggle = true;
  }
  initAll();
}

$('more-td').addEventListener('click', showMore, false);

function onMouseup(e) {
  if (isDraging) return;
  var target = e.target || e.originalTarget;
  var type = target.getAttribute('type');
  if (type) {
    background.send('open-tab-request', {
      type: type,
      inBackground: (e.ctrlKey && e.button == 0) || (e.metaKey && e.button == 0) || e.button == 1
    });
    /* close the panel after clicking on any icon */
    if (closePanel === 'close') {
      if (isFirefox) background.send('close-panel');
      else if (isSafari) safari.extension.popovers[0].hide();
      else window.close();
    }
  }
}

/* onClick does not fire (e.button == 1) on Firefox */
$('shortcuts-table').addEventListener('mouseup', onMouseup, false);
$('backup-table').addEventListener('mouseup', onMouseup, false);
$('shortcuts-table').addEventListener("click", function (e) {  //prevent post-click on ubuntu
    e.preventDefault();
}, true);
$('backup-table').addEventListener("click", function (e) { //prevent post-click on ubuntu
    e.preventDefault();
}, true);
$('settings-td').addEventListener('click', function (e) {
  if (!$('settings-table').style.display || $('settings-table').style.display == "none") {
    $('settings-table').style.display = "block";
  }
  else {
    $('settings-table').style.display = "none";
  }
  initAll();
});

$('reset-button').addEventListener('click', function (e) {
  background.send('reset-history');
});

$('close-panel').addEventListener('click', function (e) {
  var target = e.target || e.originalTarget;
  var state = target.getAttribute('state');
  if (state === 'close') state = '';
  else state = 'close';
  closePanel = state;
  target.setAttribute('state', state);
  background.send('store-close-panel', state);
});

$('panel-size-input').addEventListener('change', function (e) {
  var target = e.target || e.originalTarget;
  var nc = parseInt(target.value) || 10;
  target.value = nc;
  popupWidth = nc;
  background.send('store-popup-width', nc);
  initAll();
});

$('icon-size-input').addEventListener('change', function (e) {
  var target = e.target || e.originalTarget;
  var is = parseInt(target.value) || 32;
  target.value = is;
  iconSize = is;
  background.send('store-icon-size', is);
  initAll();
});

$('panel-color-input').addEventListener('change', function (e) {
  var target = e.target || e.originalTarget;
  var pc = target.value || 'FFFFFF';
  target.value = pc;
  panelColor = pc;
  fontColor = window.getComputedStyle(target).color;
  if (fontColor == 'rgb(0, 0, 0)' || fontColor == '000000' || fontColor == '#000000' ||
      fontColor == '000' || fontColor == '#000' || fontColor == 'black') {
    fontColor = '#444444';
  }
  else {
    fontColor = '#FFFFFF';
  }
  background.send('store-panel-color', pc);
  background.send('store-font-color', fontColor);
  initAll();
});

document.body.addEventListener('mouseover', function (e) {
  var target = e.target || e.originalTarget;
  $('status-td').textContent = target.getAttribute('title') || 'Google Shortcuts';
}, false);
