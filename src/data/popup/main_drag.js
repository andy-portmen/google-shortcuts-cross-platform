$('shortcuts-table').addEventListener('dragstart', function (e) {
  if (total_drag) return;
  main_drag = true;
  var target = e.target || e.originalTarget;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', target.getAttribute('id'));
  var table = document.getElementById('shortcuts-table');
  var tds = table.getElementsByTagName('td');
  for (var i = 0; i < tds.length; i++) {
    tds[i].style.opacity = 0.2;
  }
}, false);

$('shortcuts-table').addEventListener('dragenter', function (e) {
  if (total_drag) return;
  var target = e.target || e.originalTarget;
  if (e.preventDefault) {e.preventDefault();}
  if (parseInt(target.getAttribute('id').substring(1)) >= 0) {
    target.style.opacity = 1.0;
  }
}, false);

$('shortcuts-table').addEventListener('dragover', function (e) {
  if (total_drag) return;
  var target = e.target || e.originalTarget;
  if (e.preventDefault) {e.preventDefault();}
  e.dataTransfer.dropEffect = 'move';
}, false);

$('shortcuts-table').addEventListener('dragleave', function (e) {
  if (total_drag) return;
  var target = e.target || e.originalTarget;
  if (parseInt(target.getAttribute('id').substring(1)) >= 0) {
    target.style.opacity = 0.2;
  }
}, false);

$('shortcuts-table').addEventListener('drop', function (e) {
  if (total_drag) return;
  handleDrop(e, mainTypes, 'store-mainTypes');
  var target = e.target || e.originalTarget;
  target.style.cursor = 'url(openhand.cur), move';
  if (e.stopPropagation) {e.stopPropagation();}
}, false);

$('shortcuts-table').addEventListener('dragend', function (e) {
  if (total_drag) return;
  main_drag = false;
  if (e.preventDefault) {e.preventDefault();}
  var table = document.getElementById('shortcuts-table');
  var tds = table.getElementsByTagName('td');
  for (var i = 0; i < tds.length; i++) {
    tds[i].style.opacity = 1.0;
  }
  init(mainTypes, 'shortcuts-table');
}, false);