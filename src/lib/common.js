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
  get = firefox.get;
  popup = firefox.popup;
  window = firefox.window;
  content_script = firefox.content_script;
  tab = firefox.tab;
  version = firefox.version;
  Deferred = firefox.Promise.defer;
}
else {
  storage = _chrome.storage;
  get = _chrome.get;
  popup = _chrome.popup;
  content_script = _chrome.content_script;
  tab = _chrome.tab;
  version = _chrome.version;
  Deferred = task.Deferred;
}
/********/
if (storage.read("version") != version()) {
  storage.write("version", version());
  tab.open("http://add0n.com/google-shortcuts.html");
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

popup.receive('open-tab-request', function (type) {
  switch (type) {
  case 'alerts':
    tab.open('https://www.google.com/alerts/');
    break;
  case 'analytics':
    tab.open('https://www.google.com/analytics/');
    break;
   case 'blog':
    tab.open('https://www.google.com/blogsearch/');
    break;
  case 'blogger':
    tab.open('https://www.blogger.com/');
    break;
  case 'book':
    tab.open('https://books.google.com/');
    break;
  case 'calender':
    tab.open('https://www.google.com/calendar/');
    break;
  case 'code':
    tab.open('https://code.google.com/');
    break;
  case 'dashboard':
    tab.open('https://www.google.com/dashboard/');
    break;
  case 'drive':
    tab.open('https://drive.google.com/');
    break;
  case 'earth':
    tab.open('https://earth.google.com/');
    break;
  case 'finance':
    tab.open('https://www.google.com/finance');
    break;
  case 'gmail':
    tab.open('https://mail.google.com/mail/');
    break;
  case 'groups':
    tab.open('https://groups.google.com/');
    break;
  case 'image':
    tab.open('http://images.google.com/imghp');
    break;
  case 'maps':
    tab.open('https://www.google.com/maps/');
    break;
  case 'mobile':
    tab.open('https://www.google.com/mobile/');
    break;
  case 'music':
    tab.open('https://music.google.com/');
    break;
  case 'news':
    tab.open('https://news.google.com/');
    break;
  case 'note':
    tab.open('https://drive.google.com/keep');
    break;
  case 'panoramio':
    tab.open('http://www.panoramio.com/');
    break;
  case 'picasa':
    tab.open('http://picasa.google.com/');
    break;
  case 'play':
    tab.open('https://play.google.com/store/');
    break;
  case 'plus':
    tab.open('https://plus.google.com/');
    break;
  case 'print':
    tab.open('https://www.google.com/cloudprint/');
    break;
  case 'scholar':
    tab.open('https://scholar.google.com/');
    break;
  case 'search':
    tab.open('https://www.google.com/');
    break;
  case 'site':
    tab.open('https://sites.google.com/');
    break;
  case 'sketchup':
    tab.open('http://www.sketchup.com/');
    break;
  case 'hangouts':
    tab.open('https://www.google.com/hangouts/');
    break;
  case 'translate':
    tab.open('https://translate.google.com/');
    break;
  case 'trends':
    tab.open('https://www.google.com/trends/');
    break;
  case 'wallet':
    tab.open('https://www.google.com/wallet/');
    break;
  case 'youtube':
    tab.open('https://www.youtube.com/');
    break;
  case 'hotel':
    tab.open('https://www.google.com/hotelfinder/');
    break;
  case 'patent':
    tab.open('https://www.google.com/patents/');
    break;
  case 'shopping':
    tab.open('https://www.google.com/shopping/');
    break;
  default:
    tab.open('https://www.google.com/about/products/');
    break;
  }
});