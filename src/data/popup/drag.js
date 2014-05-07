var MT, BT, startId_G, startType_G;
var dragIconContent = './icons/emptyCell.png';
var dragIcon = document.createElement('img');
dragIcon.src = dragIconContent;
function setDragIcon(dragIconContent) {dragIcon.src = dragIconContent;}

$('main-div').addEventListener('mouseover', function (e) {
  var target = e.target || e.originalTarget;
  $('status-td').textContent = target.getAttribute('title') || 'Google Shortcuts';
}, false);

$('main-div').addEventListener('mousedown', function (e) {
  var target = e.target || e.originalTarget;
  var type = target.getAttribute('type');
  if (target.localName == 'td' && type) {
    dragIconContent = './icons/' + target.getAttribute('type') + '.png';
    setDragIcon(dragIconContent);
  }
}, false);

function onDragStart(e) {
  isDraging = true;
  var target = e.target || e.originalTarget;
  
  MT = mainTypes.concat();
  BT = backupTypes.concat();
  e.dataTransfer.effectAllowed = 'move';
  startId_G = target.getAttribute('id');
  
  startType_G = target.getAttribute('type');
  e.dataTransfer.setDragImage(dragIcon, 15, 15);  
  if (startId_G.charAt(0) == 'm') {
    MT.splice(parseInt(startId_G.substring(1)), 1);
  }
  if (startId_G.charAt(0) == 'b') {
    BT.splice(parseInt(startId_G.substring(1)), 1);
  }
  e.dataTransfer.setData('gshortcuts/x-application', startId_G);
  tempDrop(e);
}

function onDragEnter(e) {
  if (!isDraging) return;
  var target = e.target || e.originalTarget;
  if (e.preventDefault) {e.preventDefault();}
  tempDrop(e);
}

function onDragOver(e) {
  if (!isDraging) return;
  var target = e.target || e.originalTarget;
  if (e.preventDefault) {e.preventDefault();}
  e.dataTransfer.dropEffect = 'move';
}

function onDragLeave(e) {}

function onDrop(e) {
  if (!e.dataTransfer.getData("gshortcuts/x-application")) return;
  handleDrop(e, mainTypes, backupTypes);
  if (e.stopPropagation) {e.stopPropagation();}
}

function onDragend(e) {
  isDraging = false;
  if (e.preventDefault) {e.preventDefault();}
  init(mainTypes, 'shortcuts-table');
  init(backupTypes, 'backup-table');
}

function tempDrop(e) {
  MT = MT.filter(function (e) {return e && e != 'emptyCell'});
  BT = BT.filter(function (e) {return e && e != 'emptyCell'});
  
  var target = e.target || e.originalTarget;
  var endId = target.getAttribute('id');
  if (endId.charAt(0) == 'm') {
    MT.splice(parseInt(endId.substring(1)), 0, 'emptyCell');
  }
  if (endId.charAt(0) == 'b') {
    BT.splice(parseInt(endId.substring(1)), 0, 'emptyCell');
  }
  init(MT, 'shortcuts-table');
  init(BT, 'backup-table');
}

function handleDrop(e, mainTypes, backupTypes) {
  var startId = startId_G; startId_G = '';
  var startType = startType_G; startType_G = '';
  
  var target = e.target || e.originalTarget;
  var endId = target.getAttribute('id');
  var endType = target.getAttribute('type');
  
  var condition_1 = (startId.charAt(0) == 'm' && endId.charAt(0) == 'm'); // for main drag
  var condition_2 = (startId.charAt(0) == 'b' && endId.charAt(0) == 'b'); // for main drag
  var condition_3 = (startId.charAt(0) == 'm' && endId.charAt(0) == 'b'); // for total drag
  var condition_4 = (startId.charAt(0) == 'b' && endId.charAt(0) == 'm'); // for total drag

  if (condition_1 || condition_2) {
    startId = parseInt(startId.substring(1));
    endId = parseInt(endId.substring(1));
    if (startId >= 0 && endId >= 0 && startId != endId) {
      if (startId < endId) {
        if (condition_1) {
          mainTypes.splice(endId + 1, 0, startType);
          mainTypes.splice(startId, 1);
        } else {
          backupTypes.splice(endId + 1, 0, startType);
          backupTypes.splice(startId, 1);
        }
      } 
      else {
        if (condition_1) {
          mainTypes.splice(startId, 1);
          mainTypes.splice(endId, 0, startType);
        } else {
          backupTypes.splice(startId, 1);
          backupTypes.splice(endId, 0, startType);
        }
      }  
    }
  }
  else if (condition_3 || condition_4) {
    if (startType && startId != endId) {
      if (startId.charAt(0) == 'm' && endId.charAt(0) == 'b' && mainTypes.length > 1) {
        var endId = parseInt(endId.substring(1));
        if (!endType) endId = backupTypes.length - 1;
        var startId = parseInt(startId.substring(1));
        backupTypes.splice(endId, 0, startType);       // insert
        mainTypes.splice(startId, 1);                  // delete
      }
      else if (startId.charAt(0) == 'b' && endId.charAt(0) == 'm' && backupTypes.length > 1) {
        var endId = parseInt(endId.substring(1));
        if (!endType) endId = mainTypes.length - 1;
        var startId = parseInt(startId.substring(1));
        mainTypes.splice(endId, 0, startType);         // insert
        backupTypes.splice(startId, 1);                // delete
      }
    }
  }
  background.send('store-mainTypes', mainTypes);
  background.send('store-backupTypes', backupTypes);
}

$('shortcuts-table').addEventListener('dragstart', onDragStart, false);
$('shortcuts-table').addEventListener('dragenter', onDragEnter, false);
$('shortcuts-table').addEventListener('dragover', onDragOver, false);
$('shortcuts-table').addEventListener('dragleave', onDragLeave, false);
$('shortcuts-table').addEventListener('drop', onDrop, false);
$('shortcuts-table').addEventListener('dragend', onDragend, false);

$('backup-table').addEventListener('dragstart', onDragStart, false);
$('backup-table').addEventListener('dragenter', onDragEnter, false);
$('backup-table').addEventListener('dragover', onDragOver, false);
$('backup-table').addEventListener('dragleave', onDragLeave, false);
$('backup-table').addEventListener('drop', onDrop, false);
$('backup-table').addEventListener('dragend', onDragend, false);