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

Types = ['search', 'youtube', 'maps', 'play', 'gmail', 'calender', 'plus', 'drive', 'shopping', 
         'wallet', 'note', 'translate', 'picasa', 'image', 'blogger', 'mobile', 'music', 'news',
         'earth', 'book', 'panoramio', 'groups', 'blog', 'print', 'alerts', 'analytics', 'site',
         'sketchup', 'hangouts', 'hotel', 'trends', 'finance', 'patent', 'scholar', 'code', 'dashboard'];

if (!storage.read("Types")) {storage.write("Types", JSON.stringify(Types));}

popup.receive('request-inits', function () {
  var lStorage = storage.read("Types");
  var lStorage_arr = JSON.parse(lStorage);
  popup.send('request-inits', lStorage_arr);
});

popup.receive('store-types', function (data) {
  storage.write("Types", JSON.stringify(data));
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
  default:
    tab.open('https://www.google.com/about/products/', obj.inBackground, !obj.inBackground);
    break;
  }
});