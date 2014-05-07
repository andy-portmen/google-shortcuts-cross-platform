/** version 4 **/

// Load Firefox based resources
var self          = require("sdk/self"),
    data          = self.data,
    sp            = require("sdk/simple-prefs"),
    Request       = require("sdk/request").Request,
    prefs         = sp.prefs,
    pageMod       = require("sdk/page-mod"),
    tabs          = require("sdk/tabs"),
    {Cc, Ci, Cu}  = require('chrome'),
    windows          = {
      get active () { // Chrome window
        return require('sdk/window/utils').getMostRecentBrowserWindow()
      }
    },
    isAustralis   = "gCustomizeMode" in windows.active,
    toolbarbutton = isAustralis ? require("./toolbarbutton/new") : require("./toolbarbutton/old");
    
Cu.import("resource://gre/modules/Promise.jsm");
 
// Load overlay styles
require("./userstyles").load(data.url("overlay.css"));
//Install toolbar button
var button = toolbarbutton.ToolbarButton({
  id: "igshortcuts",
  label: "Google Shortcuts",
  tooltiptext: "Shortcuts of Google Products",
  insert: true,
  onCommand: function () {
    popup.show(button.object);
  },
  onClick: function () {
  }
});
if (self.loadReason == "install") {
  button.moveTo({
    toolbarID: "nav-bar", 
    insertbefore: "home-button", 
    forceMove: false
  });
}

var popup = require("sdk/panel").Panel({
  width: 280,
  height: 220,
  contentURL: data.url("./popup/popup.html"),
  contentScriptFile: [data.url("./popup/popup.js"), data.url("./popup/drag.js")]
});
popup.port.on("resize", function(obj) {
  popup.resize(obj.w, obj.h + 2);
});

exports.storage = {
  read: function (id) {
    return (prefs[id] || prefs[id] + "" == "false") ? (prefs[id] + "") : null;
  },
  write: function (id, data) {
    data = data + "";
    if (data === "true" || data === "false") {
      prefs[id] = data === "true" ? true : false;
    }
    else if (parseInt(data) === data) {
      prefs[id] = parseInt(data);
    }
    else {
      prefs[id] = data + "";
    }
  }
}

exports.popup = {
  send: function (id, data) {
    popup.port.emit(id, data);
  },
  receive: function (id, callback) {
    popup.port.on(id, callback);
  }
}

exports.tab = {
  open: function (url, inBackground, inCurrent) {
    if (inCurrent) {
      tabs.activeTab.url = url;
    }
    else {
      tabs.open({
        url: url,
        inBackground: typeof inBackground == 'undefined' ? false : inBackground
      });
    }
  }
}

exports.version = function () {
  return self.version;
}

exports.window = require('sdk/window/utils').getMostRecentBrowserWindow();
exports.Promise = Promise;

/**************************************************************************************************/
var onCmd = function (url) {
  return function () {
    tabs.open(url);
  }
}
var onClk = function (url) {
  return function (e) {
    if (e.button == 1) {
      tabs.open({url: url, inBackground: true});
    }
  }
}

var icons = [
  {
    label: "Google Alerts",
    icon: "alerts",
    url: "https://www.google.com/alerts/"
  },
  {
    label: "Google Analytics",
    icon: "analytics",
    url: "https://www.google.com/analytics/"
  },
  {
    label: "Google Blog Search",
    icon: "blog",
    url: "https://www.google.com/blogsearch/"
  },
  {
    label: "Google Blogger",
    icon: "blogger",
    url: "https://www.blogger.com/"
  },
  {
    label: "Google Books",
    icon: "book",
    url: "https://books.google.com/"
  },
  {
    label: "Google Calendar",
    icon: "calender",
    url: "https://www.google.com/calendar/"
  },
  {
    label: "Google Code",
    icon: "code",
    url: "https://code.google.com/"
  },
  {
    label: "Google Dashboard",
    icon: "dashboard",
    url: 'https://www.google.com/dashboard/'
  },
  {
    label: "Google Drive",
    icon: "drive",
    url: 'https://drive.google.com/'
  },
  {
    label: "Google Earth",
    icon: "earth",
    url: 'https://earth.google.com/'
  },
  {
    label: "Google Finance",
    icon: "finance",
    url: 'https://www.google.com/finance'
  },
  {
    label: "Gmail",
    icon: "gmail",
    url: 'https://mail.google.com/mail/'
  },
  {
    label: "Google Groups",
    icon: "groups",
    url: 'https://groups.google.com/'
  },
  {
    label: "Google Image Search",
    icon: "image",
    url: 'http://images.google.com/imghp'
  },
  {
    label: "Google Maps",
    icon: "maps",
    url: 'https://www.google.com/maps/'
  },
  {
    label: "Google Mobile",
    icon: "mobile",
    url: 'https://www.google.com/mobile/'
  },
  {
    label: "Google Music",
    icon: "music",
    url: 'https://music.google.com/'
  },
  {
    label: "Google News",
    icon: "news",
    url: 'https://news.google.com/'
  },
  {
    label: "Google Keep (notes)",
    icon: "note",
    url: 'https://drive.google.com/keep'
  },
  {
    label: "Google Panoramio",
    icon: "panoramio",
    url: 'http://www.panoramio.com/'
  },
  {
    label: "Google Picasa",
    icon: "picasa",
    url: 'http://picasa.google.com/'
  },
  {
    label: "Google Play",
    icon: "play",
    url: 'https://play.google.com/store/'
  },
  {
    label: "Google Plus",
    icon: "plus",
    url: 'https://plus.google.com/'
  },
  {
    label: "Google Cloud Print",
    icon: "print",
    url: 'https://www.google.com/cloudprint/'
  },
  {
    label: "Google Scholar Search",
    icon: "scholar",
    url: 'https://scholar.google.com/'
  },
  {
    label: "Google Web Search",
    icon: "search",
    url: 'https://www.google.com/'
  },
  {
    label: "Google Sites",
    icon: "site",
    url: 'https://sites.google.com/'
  },
  {
    label: "Google SketchUp",
    icon: "sketchup",
    url: 'http://www.sketchup.com/'
  },
  {
    label: "Google SketchUp",
    icon: "hangouts",
    url: 'https://www.google.com/hangouts/'
  },
  {
    label: "Google Translate",
    icon: "translate",
    url: 'https://translate.google.com/'
  },
  {
    label: "Google Trends",
    icon: "trends",
    url: 'https://www.google.com/trends/'
  }, 
  {
    label: "Google Wallet",
    icon: "wallet",
    url: 'https://www.google.com/wallet/'
  },
  {
    label: "YouTube",
    icon: "youtube",
    url: 'https://www.youtube.com/'
  },
  {
    label: "Google Hotel Search",
    icon: "hotel",
    url: 'https://www.google.com/hotelfinder/'
  },
  {
    label: "Google Patent Search",
    icon: "patent",
    url: 'https://www.google.com/patents/'
  },
  {
    label: "Google Shopping",
    icon: "shopping",
    url: 'https://www.google.com/shopping/'
  },
  {
    label: "Android",
    icon: "android",
    url: 'http://www.android.com/'
  },
  {
    label: "Google Bookmarks",
    icon: "bookmarks",
    url: 'https://www.google.com/bookmarks/'
  },
  {
    label: "Google Feedburner",
    icon: "feedburner",
    url: 'http://feedburner.google.com/'
  },
  {
    label: "Google Fusion Tables",
    icon: "fusion",
    url: 'https://www.google.com/fusiontables/'
  },
  {
    label: "Google Offers",
    icon: "offer",
    url: 'https://www.google.com/offers/'
  },
  {
    label: "Google URL Shortner",
    icon: "urlshortner",
    url: 'http://goo.gl/'
  },
  {
    label: "Google Web History",
    icon: "webhistory",
    url: 'https://history.google.com/history/'
  },
  {
    label: "Google Webmaster Tools",
    icon: "webmaster",
    url: 'https://www.google.com/webmasters/'
  },
  {
    label: "Google Chromebook",
    icon: "chromebook",
    url: 'https://www.google.com/intl/en/chrome/devices/'
  },
  {
    label: "Chromium",
    icon: "chromium",
    url: 'http://www.chromium.org/'
  },
  {
    label: "Google Cloude Platform",
    icon: "cloudeplatform",
    url: 'https://cloud.google.com/'
  },
  {
    label: "Google Contacts",
    icon: "contacts",
    url: 'https://www.google.com/contacts/'
  },
  {
    label: "Google Correlate",
    icon: "correlate",
    url: 'https://www.google.com/trends/correlate/'
  },
  {
    label: "Google Currents",
    icon: "currents",
    url: 'http://www.google.com/producer/currents/'
  },
  {
    label: "Google Developement Dashboard",
    icon: "developersdashboard",
    url: 'https://chrome.google.com/webstore/developer/dashboard/'
  },
  {
    label: "Google Input Tool",
    icon: "inputtool",
    url: 'http://www.google.com/inputtools/'
  },
  {
    label: "Google Ideas",
    icon: "ideas",
    url: 'https://www.google.com/ideas/'
  },
  {
    label: "Google Mars",
    icon: "mars",
    url: 'https://www.google.com/mars/'
  },
  {
    label: "Google Sky",
    icon: "sky",
    url: 'https://www.google.com/sky/'
  },
  {
    label: "Google Transit",
    icon: "transit",
    url: 'https://www.google.com/intl/en/landing/transit/'
  },
  {
    label: "Google Webpage Test",
    icon: "webpagetest",
    url: 'http://www.webpagetest.org/'
  },
  {
    label: "What Do You Love",
    icon: "wdyl",
    url: 'http://www.wdyl.com/'
  },
  {
    label: "Google Adwords",
    icon: "adwords",
    url: 'https://www.google.com/adwords/'
  },
  {
    label: "Google Adsense",
    icon: "adsense",
    url: 'https://www.google.com/adsense/'
  },
  {
    label: "Google Videos",
    icon: "video",
    url: 'https://www.google.com/videohp'
  }
];


/* NEW ITEMS
  'android', 'bookmarks', 'feedburner', 'fusion', 'offer', 'urlshortner', 
  'webhistory', 'webmaster', 'chromebook', 'chromium', 'cloudeplatform', 'contacts', 
  'correlate', 'currents', 'developersdashboard', 'inputtool', 'ideas', 'mars', 
  'sky', 'transit', 'webpagetest', 'wdyl', 'adwords', 'adsense', 'video'
*/








icons.forEach(function (obj) {
  var button;
  if (prefs[obj.icon]) {
    button = toolbarbutton.ToolbarButton({
      id: "igshortcuts-" + obj.icon,
      label: obj.label,
      tooltiptext: obj.label,
      onCommand: new onCmd(obj.url),
      onClick: new onClk(obj.url)
    });
  }
});
  
  
