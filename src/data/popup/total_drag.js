$('main-div').addEventListener('dragstart', function (e) {
  if (main_drag) return;
  var target = e.target || e.originalTarget;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', target.getAttribute('id'));
  var tds = document.getElementsByTagName('td');
  for (var i = 0; i < tds.length; i++) {
    tds[i].style.opacity = 0.2;
  }
}, false);

$('main-div').addEventListener('dragenter', function (e) {
  if (main_drag) return;
  var target = e.target || e.originalTarget;
  if (e.preventDefault) {e.preventDefault();}
  if (parseInt(target.getAttribute('id').substring(1)) >= 0) {
    target.style.opacity = 1.0;
  }
}, false);

$('main-div').addEventListener('dragover', function (e) {
  if (main_drag) return;
  var target = e.target || e.originalTarget;
  if (e.preventDefault) {e.preventDefault();}
  e.dataTransfer.dropEffect = 'move';
}, false);

$('main-div').addEventListener('dragleave', function (e) {
  if (main_drag) return;
  var target = e.target || e.originalTarget;
  if (parseInt(target.getAttribute('id').substring(1)) >= 0) {
    target.style.opacity = 0.2;
  }
}, false);

$('main-div').addEventListener('drop', function (e) {
  if (main_drag) return;
  handleDropTotal(e, mainTypes, backupTypes);
  if (e.stopPropagation) {e.stopPropagation();}
}, false);

$('main-div').addEventListener('dragend', function (e) {
  if (main_drag) return;
  if (e.preventDefault) {e.preventDefault();}
  var tds = document.getElementsByTagName('td');
  for (var i = 0; i < tds.length; i++) {
    tds[i].style.opacity = 1.0;
  }
  init(mainTypes, 'shortcuts-table');
  init(backupTypes, 'backup-table');
}, false);