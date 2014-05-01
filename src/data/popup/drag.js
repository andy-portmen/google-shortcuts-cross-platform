function onDragStart(e) {
  isDraging = true;
  var target = e.target || e.originalTarget;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('gshortcuts/x-application', target.getAttribute('id'));
  var tds = document.getElementsByTagName('td');
  for (var i = 0; i < tds.length; i++) {
    tds[i].style.opacity = 0.2;
  }
}

function onDragEnter(e) {
  if (!isDraging) return;
  var target = e.target || e.originalTarget;
  if (e.preventDefault) {e.preventDefault();}
  if (target.getAttribute('id'))
    if (parseInt(target.getAttribute('id').substring(1)) >= 0)
      target.style.opacity = 1.0;
}

function onDragOver(e) {
  if (!isDraging) return;
  var target = e.target || e.originalTarget;
  if (e.preventDefault) {e.preventDefault();}
  e.dataTransfer.dropEffect = 'move';
}

function onDragLeave(e) {
  if (!isDraging) return;
  var target = e.target || e.originalTarget;
  if (target.getAttribute('id'))
    if (parseInt(target.getAttribute('id').substring(1)) >= 0)
    target.style.opacity = 0.2;
}

function onDrop(e) {
  if (!e.dataTransfer.getData("gshortcuts/x-application")) return;
  handleDrop(e, mainTypes, backupTypes);
  if (e.stopPropagation) {e.stopPropagation();}
}

function onDragend(e) {
  isDraging = false;
  if (e.preventDefault) {e.preventDefault();}
  var tds = document.getElementsByTagName('td');
  for (var i = 0; i < tds.length; i++) {
    tds[i].style.opacity = 1.0;
  }
  init(mainTypes, 'shortcuts-table');
  init(backupTypes, 'backup-table');
}

function handleDrop(e, mainTypes, backupTypes) {
  var target = e.target || e.originalTarget;
  var startId = e.dataTransfer.getData("gshortcuts/x-application");
  var endId = target.getAttribute('id');
  var startType = $(startId).getAttribute('type');
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
      if (startId.charAt(0) == 'm' && endId.charAt(0) == 'b') {
        var endId = parseInt(endId.substring(1));
        if (!endType) endId = backupTypes.length - 1;
        var startId = parseInt(startId.substring(1));
        backupTypes.splice(endId, 0, startType);       // insert
        mainTypes.splice(startId, 1);                  // delete
      }
      else if (startId.charAt(0) == 'b' && endId.charAt(0) == 'm') {
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