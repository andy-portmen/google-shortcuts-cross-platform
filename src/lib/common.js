var storage, get, popup, window, Deferred, content_script, tab, version;
/*
Storage Items:
  "history"
  "from"
  "to"
  "isTextSelection"
  "isDblclick"
  "enableHistory"
  "numberHistoryItems"
*/
/********/
if (typeof require !== 'undefined') {
  var firefox = require("./firefox.js");
  storage = firefox.storage;
  popup = firefox.popup;
  window = firefox.window;
  tab = firefox.tab;
  version = firefox.version;
  Deferred = firefox.Promise.defer;
}
else {
  storage = _chrome.storage;
  popup = _chrome.popup;
  tab = _chrome.tab;
  version = _chrome.version;
  Deferred = task.Deferred;
}
/********/
if (storage.read("version") != version()) {
  storage.write("version", version());
  tab.open("http://add0n.com/google-shortcuts.html?version=" + version());
}

mainTypes = ['search', 'youtube', 'maps', 'play', 'gmail', 'calender', 
             'plus', 'drive', 'shopping', 'wallet', 'note', 'translate', 
             'picasa', 'blogger', 'music', 'news', 'book', 'groups', 
             'blog', 'print', 'alerts', 'analytics', 'hangouts', 'dashboard'];

backupTypes = ['android', 'bookmarks', 'feedburner', 'fusion', 'offer', 'urlshortner', 
               'webhistory', 'webmaster', 'chromebook', 'chromium', 'cloudeplatform', 'contacts', 
               'correlate', 'currents', 'developersdashboard', 'inputtool', 'ideas', 'mars', 
               'sky', 'transit', 'webpagetest', 'wdyl', 'adwords', 'adsense', 
               'image', 'mobile', 'earth', 'panoramio', 'site', 'hotel',
               'finance', 'code', 'scholar', 'patent', 'trends', 'sketchup', 'video'];
             
if (!storage.read("mainTypes")) {storage.write("mainTypes", JSON.stringify(mainTypes));}
if (!storage.read("backupTypes")) {storage.write("backupTypes", JSON.stringify(backupTypes));}

popup.receive('request-inits', function () {
  var lStorage = storage.read("mainTypes");
  var lStorage_arr = JSON.parse(lStorage);
  popup.send('request-inits', lStorage_arr);
});

popup.receive('request-backup-inits', function () {
  var lStorage = storage.read("backupTypes");
  var lStorage_arr = JSON.parse(lStorage);
  popup.send('request-backup-inits', lStorage_arr);
});

popup.receive('store-mainTypes', function (data) {
  storage.write("mainTypes", JSON.stringify(data));
});

popup.receive('store-backupTypes', function (data) {
  storage.write("backupTypes", JSON.stringify(data));
});

popup.receive('open-tab-request', function (obj) {
  switch (obj.type) {
  case 'alerts':
    tab.open('https://www.google.com/alerts/', obj.inBackground, !obj.inBackground);
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
  case 'offer':
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
  default:
    tab.open('https://www.google.com/about/products/', obj.inBackground, !obj.inBackground);
    break;
  }
});