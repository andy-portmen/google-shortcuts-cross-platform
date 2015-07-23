var storage, popup, tab, version;

/**** wrapper (start) ****/
if (typeof require !== 'undefined') { /* Firefox */
  var firefox = require("./firefox/firefox");
  ["storage", "popup", "tab", "version"].forEach(function (id) {this[id] = firefox[id];});
}
else if (typeof safari !== 'undefined') {  /* Safari */
  ["storage", "popup", "tab", "version"].forEach(function (id) {this[id] = _safari[id];});
}
else {  /* Chrome */
  ["storage", "popup", "tab", "version"].forEach(function (id) {this[id] = _chrome[id];});
}
/**** wrapper (end) ****/

if (storage.read("version") != version()) {
  storage.write("version", version());
  tab.open("http://add0n.com/google-shortcuts.html?version=" + version());
}

/* Default Variables */
var mainTypes = ['search', 'youtube', 'maps', 'play', 'gmail', 'calender', 
                 'plus', 'drive', 'shopping', 'wallet', 'note', 'translate', 
                 'picasa', 'blogger', 'music', 'news', 'book', 'groups', 
                 'blog', 'print', 'alerts', 'analytics', 'hangouts', 'dashboard'];

var backupTypes = ['android', 'bookmarks', 'feedburner', 'fusion', 'offers', 'urlshortner', 
                   'webhistory', 'webmaster', 'chromebook', 'chromium', 'cloudeplatform', 'contacts', 
                   'correlate', 'currents', 'developersdashboard', 'inputtool', 'ideas', 'mars', 
                   'sky', 'transit', 'webpagetest', 'wdyl', 'adwords', 'adsense', 
                   'image', 'mobile', 'earth', 'panoramio', 'site', 'hotel',
                   'finance', 'code', 'scholar', 'patent', 'trends', 'sketchup', 
                   'video', 'voice', 'catalogs', 'authenticator', 'business', 'computeengine',
                   'coordinate', 'earthengine', 'fonts', 'forms', 'glass', 'goggles',
                   'help', 'partnerdash', 'photos', 'local', 'presentation', 'script',
                   'streetview', 'sync', 'tagmanager', 'tasks', 'webstore', 'mapsengine',
                   'chrome', 'slides', 'sheets', 'privacy', 'admin', 'apps', 'flights',
                   'domains', 'security', 'drawings', 'inbox', 'support', 'account', 
                   'admob', 'store'];

var closePanel = '';
var iconSize = "32";
var popupWidth = "10";
var panelColor = "FFFFFF";
var fontColor = "#444444";

if (!storage.read("mainTypes")) {storage.write("mainTypes", JSON.stringify(mainTypes));}
if (!storage.read("backupTypes")) {storage.write("backupTypes", JSON.stringify(backupTypes));}

function inits() {
  popup.send('request-inits', {
    mainTypes: JSON.parse(storage.read("mainTypes")),
    backupTypes: JSON.parse(storage.read("backupTypes")),
    popupWidth: storage.read("popupWidth") || popupWidth,
    iconSize: storage.read("iconSize") || iconSize,
    closePanel: storage.read("closePanel") || closePanel,
    panelColor: storage.read("panelColor") || panelColor,
    fontColor: storage.read("fontColor") || fontColor,
  });
}
popup.receive('request-inits', inits);

popup.receive('store-mainTypes', function (data) {
  storage.write("mainTypes", JSON.stringify(data));
});

popup.receive('store-backupTypes', function (data) {
  storage.write("backupTypes", JSON.stringify(data));
});

popup.receive('store-popup-width', function (data) {
  storage.write("popupWidth", data);
});

popup.receive('store-icon-size', function (data) {
  storage.write("iconSize", data);
});

popup.receive('store-panel-color', function (data) {
  storage.write("panelColor", data);
});

popup.receive('store-font-color', function (data) {
  storage.write("fontColor", data);
});

popup.receive('store-close-panel', function (data) {
  storage.write("closePanel", data);
});

popup.receive('reset-history', function () {
  storage.write("backupTypes", JSON.stringify(backupTypes));
  storage.write("mainTypes", JSON.stringify(mainTypes));
  storage.write("popupWidth", popupWidth);
  storage.write("closePanel", closePanel);
  storage.write("panelColor", panelColor);
  storage.write("fontColor", fontColor);
  storage.write("iconSize", iconSize);
  /* inits */
  inits();
});

popup.receive('open-tab-request', function (obj) {
  switch (obj.type) {
  case 'alerts':
    tab.open('https://www.google.com/alerts', obj.inBackground, !obj.inBackground);
    break;
  case 'analytics':
    tab.open('https://www.google.com/analytics/', obj.inBackground, !obj.inBackground);
    break;
   case 'blog':
    tab.open('https://www.google.com/blogsearch/', obj.inBackground, !obj.inBackground);
    break;
  case 'blogger':
    tab.open('https://www.blogger.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'book':
    tab.open('https://books.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'calender':
    tab.open('https://www.google.com/calendar/', obj.inBackground, !obj.inBackground);
    break;
  case 'code':
    tab.open('https://code.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'dashboard':
    tab.open('https://www.google.com/dashboard/', obj.inBackground, !obj.inBackground);
    break;
  case 'drive':
    tab.open('https://drive.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'earth':
    tab.open('https://earth.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'finance':
    tab.open('https://www.google.com/finance', obj.inBackground, !obj.inBackground);
    break;
  case 'gmail':
    tab.open('https://mail.google.com/mail/', obj.inBackground, !obj.inBackground);
    break;
  case 'groups':
    tab.open('https://groups.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'image':
    tab.open('http://images.google.com/imghp', obj.inBackground, !obj.inBackground);
    break;
  case 'maps':
    tab.open('https://www.google.com/maps/', obj.inBackground, !obj.inBackground);
    break;
  case 'mobile':
    tab.open('https://www.google.com/mobile/', obj.inBackground, !obj.inBackground);
    break;
  case 'music':
    tab.open('https://music.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'news':
    tab.open('https://news.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'note':
    tab.open('https://drive.google.com/keep', obj.inBackground, !obj.inBackground);
    break;
  case 'panoramio':
    tab.open('http://www.panoramio.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'picasa':
    tab.open('http://picasa.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'play':
    tab.open('https://play.google.com/store/', obj.inBackground, !obj.inBackground);
    break;
  case 'plus':
    tab.open('https://plus.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'print':
    tab.open('https://www.google.com/cloudprint/', obj.inBackground, !obj.inBackground);
    break;
  case 'scholar':
    tab.open('https://scholar.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'search':
    tab.open('https://www.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'site':
    tab.open('https://sites.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'sketchup':
    tab.open('http://www.sketchup.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'hangouts':
    tab.open('https://www.google.com/hangouts/', obj.inBackground, !obj.inBackground);
    break;
  case 'translate':
    tab.open('https://translate.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'trends':
    tab.open('https://www.google.com/trends/', obj.inBackground, !obj.inBackground);
    break;
  case 'wallet':
    tab.open('https://www.google.com/wallet/', obj.inBackground, !obj.inBackground);
    break;
  case 'youtube':
    tab.open('https://www.youtube.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'hotel':
    tab.open('https://www.google.com/hotelfinder/', obj.inBackground, !obj.inBackground);
    break;
  case 'patent':
    tab.open('https://www.google.com/patents/', obj.inBackground, !obj.inBackground);
    break;
  case 'shopping':
    tab.open('https://www.google.com/shopping/', obj.inBackground, !obj.inBackground);
    break;
  case 'android':
    tab.open('http://www.android.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'bookmarks':
    tab.open('https://www.google.com/bookmarks/', obj.inBackground, !obj.inBackground);
    break;
  case 'feedburner':
    tab.open('http://feedburner.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'fusion':
    tab.open('https://www.google.com/fusiontables/', obj.inBackground, !obj.inBackground);
    break;
  case 'offers':
    tab.open('https://www.google.com/offers/', obj.inBackground, !obj.inBackground);
    break;
  case 'urlshortner':
    tab.open('http://goo.gl/', obj.inBackground, !obj.inBackground);
    break;
  case 'webhistory':
    tab.open('https://history.google.com/history/', obj.inBackground, !obj.inBackground);
    break;
  case 'webmaster':
    tab.open('https://www.google.com/webmasters/', obj.inBackground, !obj.inBackground);
    break;
  case 'chromebook':
    tab.open('https://www.google.com/intl/en/chrome/devices/', obj.inBackground, !obj.inBackground);
    break;
  case 'chromium':
    tab.open('http://www.chromium.org/', obj.inBackground, !obj.inBackground);
    break;
  case 'cloudeplatform':
    tab.open('https://cloud.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'contacts':
    tab.open('https://www.google.com/contacts/', obj.inBackground, !obj.inBackground);
    break;
  case 'correlate':
    tab.open('https://www.google.com/trends/correlate/', obj.inBackground, !obj.inBackground);
    break;
  case 'currents':
    tab.open('http://www.google.com/producer/currents/', obj.inBackground, !obj.inBackground);
    break;
  case 'developersdashboard':
    tab.open('https://chrome.google.com/webstore/developer/dashboard/', obj.inBackground, !obj.inBackground);
    break;
  case 'inputtool':
    tab.open('http://www.google.com/inputtools/', obj.inBackground, !obj.inBackground);
    break;
  case 'ideas':
    tab.open('https://www.google.com/ideas/', obj.inBackground, !obj.inBackground);
    break;
  case 'mars':
    tab.open('https://www.google.com/mars/', obj.inBackground, !obj.inBackground);
    break;
  case 'sky':
    tab.open('https://www.google.com/sky/', obj.inBackground, !obj.inBackground);
    break;
  case 'transit':
    tab.open('https://www.google.com/intl/en/landing/transit/', obj.inBackground, !obj.inBackground);
    break;
  case 'webpagetest':
    tab.open('http://www.webpagetest.org/', obj.inBackground, !obj.inBackground);
    break;
  case 'wdyl':
    tab.open('http://www.wdyl.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'adwords':
    tab.open('https://www.google.com/adwords/', obj.inBackground, !obj.inBackground);
    break; 
  case 'adsense':
    tab.open('https://www.google.com/adsense/', obj.inBackground, !obj.inBackground);
    break;
  case 'video':
    tab.open('https://www.google.com/videohp', obj.inBackground, !obj.inBackground);
    break;
  case 'voice':
    tab.open('https://www.google.com/voice', obj.inBackground, !obj.inBackground);
    break;
  case 'catalogs':
    tab.open('https://www.google.com/catalogs/', obj.inBackground, !obj.inBackground);
    break;
  case 'authenticator':
    tab.open('https://support.google.com/accounts/answer/1066447/', obj.inBackground, !obj.inBackground);
    break;
  case 'business':
    tab.open('https://www.google.com/business/', obj.inBackground, !obj.inBackground);
    break;  
  case 'computeengine':
    tab.open('https://console.developers.google.com/project?getstarted/', obj.inBackground, !obj.inBackground);
    break;  
  case 'coordinate':
    tab.open('https://www.google.com/enterprise/mapsearth/products/coordinate.html', obj.inBackground, !obj.inBackground);
    break;
  case 'earthengine':
    tab.open('https://earthengine.google.org/', obj.inBackground, !obj.inBackground);
    break;
  case 'fonts':
    tab.open('https://www.google.com/fonts/', obj.inBackground, !obj.inBackground);
    break;
  case 'forms':
    tab.open('http://www.google.com/drive', obj.inBackground, !obj.inBackground);
    break;
  case 'glass':
    tab.open('https://www.google.com/glass/', obj.inBackground, !obj.inBackground);
    break;
  case 'goggles':
    tab.open('https://support.google.com/websearch/topic/25275?hl=en&ref_topic=1733205', obj.inBackground, !obj.inBackground);
    break;
  case 'help':
    tab.open('https://support.google.com/', obj.inBackground, !obj.inBackground);
    break;
  case 'partnerdash':
    tab.open('https://partnerdash.google.com/partnerdash/', obj.inBackground, !obj.inBackground);
    break;
  case 'photos':
    tab.open('https://plus.google.com/photos/', obj.inBackground, !obj.inBackground);
    break;
  case 'local':
    tab.open('https://plus.google.com/u/0/local/', obj.inBackground, !obj.inBackground);
    break;
  case 'presentation':
    tab.open('https://docs.google.com/presentation/', obj.inBackground, !obj.inBackground);
    break;
  case 'script':
    tab.open('https://developers.google.com/apps-script/', obj.inBackground, !obj.inBackground);
    break;
  case 'streetview':
    tab.open('https://www.google.com/maps/views/streetview/', obj.inBackground, !obj.inBackground);
    break;
  case 'sync':
    tab.open('https://www.google.com/sync/', obj.inBackground, !obj.inBackground);
    break;
  case 'tagmanager':
    tab.open('https://www.google.com/tagmanager/web/', obj.inBackground, !obj.inBackground);
    break;
  case 'tasks':
    tab.open('https://mail.google.com/tasks/canvas', obj.inBackground, !obj.inBackground);
    break;
  case 'webstore':
    tab.open('https://chrome.google.com/webstore/category/apps', obj.inBackground, !obj.inBackground);
    break;
  case 'mapsengine':
    tab.open('https://mapsengine.google.com/map/', obj.inBackground, !obj.inBackground);
    break;
  case 'chrome':
    tab.open('https://www.google.com/chrome/', obj.inBackground, !obj.inBackground);
    break;    
  case 'slides':
    tab.open('https://docs.google.com/presentation/', obj.inBackground, !obj.inBackground);
    break;    
  case 'sheets':
    tab.open('https://docs.google.com/spreadsheets/', obj.inBackground, !obj.inBackground);
    break;    
  case 'privacy':
    tab.open('https://myaccount.google.com/privacycheckup/', obj.inBackground, !obj.inBackground);
    break;    
  case 'admin':
    tab.open('https://admin.google.com/', obj.inBackground, !obj.inBackground);
    break;    
  case 'apps':
    tab.open('https://www.google.com/work/apps/business/', obj.inBackground, !obj.inBackground);
    break;    
  case 'flights':
    tab.open('https://www.google.com/flights/', obj.inBackground, !obj.inBackground);
    break;    
  case 'domains':
    tab.open('https://domains.google.com/', obj.inBackground, !obj.inBackground);
    break;    
  case 'security':
    tab.open('https://myaccount.google.com/security/', obj.inBackground, !obj.inBackground);
    break;    
  case 'drawings':
    tab.open('https://docs.google.com/drawings/', obj.inBackground, !obj.inBackground);
    break;    
  case 'inbox':
    tab.open('https://inbox.google.com/', obj.inBackground, !obj.inBackground);
    break;    
  case 'support':
    tab.open('https://support.google.com/', obj.inBackground, !obj.inBackground);
    break;    
  case 'account':
    tab.open('https://myaccount.google.com/', obj.inBackground, !obj.inBackground);
    break;    
  case 'admob':
    tab.open('https://www.google.com/admob/', obj.inBackground, !obj.inBackground);
    break;    
  case 'store':
    tab.open('https://store.google.com/', obj.inBackground, !obj.inBackground);
    break;     
  default:
    tab.open('https://www.google.com/about/products/', obj.inBackground, !obj.inBackground);
    break;
  }
});