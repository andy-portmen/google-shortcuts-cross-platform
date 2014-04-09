/** version 4 **/

// Load Firefox based resources
var self          = require("sdk/self"),
    data          = self.data,
    sp            = require("sdk/simple-prefs"),
    Request       = require("sdk/request").Request,
    prefs         = sp.prefs,
    pageMod       = require("sdk/page-mod"),
    tabs          = require("sdk/tabs"),
    toolbarbutton = require("./toolbarbutton"),
    {Cc, Ci, Cu}  = require('chrome');
    
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

// Load overlay styles
var workers = [], content_script_arr = [];
pageMod.PageMod({
  include: ["*"],
  contentScriptFile: data.url("./content_script/inject.js"),
  contentStyleFile : data.url("./content_script/inject.css"),
  onAttach: function(worker) {
    workers.push(worker);
    content_script_arr.forEach(function (arr) {
      worker.port.on(arr[0], arr[1]);
    })
  }
});

var popup = require("sdk/panel").Panel({
  width: 260,
  height: 302,
  contentURL: data.url("./popup/popup.html"),
  contentScriptFile: [data.url("./popup/popup.js")]
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

exports.get = function (url) {
  var d = new Promise.defer();
  Request({
    url: url,
    onComplete: function (response) {
      d.resolve(response.text);
    }
  }).get();
  return d.promise;
}

exports.popup = {
  send: function (id, data) {
    popup.port.emit(id, data);
  },
  receive: function (id, callback) {
    popup.port.on(id, callback);
  }
}

exports.content_script = {
  send: function (id, data) {
    workers.forEach(function (worker) {
      if (worker.tab != tabs.activeTab) return;
      if (!worker) return;
      worker.port.emit(id, data);
    });
  },
  receive: function (id, callback) {
    content_script_arr.push([id, callback]);
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
  }
];
icons.forEach(function (obj) {
  var button;
  if (prefs[obj.icon]) {
    button = toolbarbutton.ToolbarButton({
      id: "igshortcuts-" + obj.icon,
      label: obj.label,
      image: data.url("toolbar/" + obj.icon + ".png"),
      onCommand: new onCmd(obj.url),
      onClick: new onClk(obj.url)
    });
  }
});
  
  
