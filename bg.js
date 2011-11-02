function xhrCall(url, callback)
{
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
  console.log(xhr.responseText);
       callback(xhr.responseText);
    }
  }
    xhr.send();
};
function check_url(url){
  if (/^https?:\/\/chrome\.google\.com\/(extensions|webstore)/i.test(url)) {
    alert(chrome.i18n.getMessage("alertGallery"));
    return false;
  } else {
    return true;
  }
};

chrome.extension.onRequest.addListener(
  function(request, sender, callback) {
    xhrCall(request.url, callback);
});

//TODO:增加快捷键
var on = {}, has_insert = {};
chrome.tabs.onUpdated.addListener(function(id){
    on[id] = has_insert[id] = false;
});
chrome.browserAction.onClicked.addListener(function(tab) {
  check_url(tab.url);
  var id = tab.id;
  if(!has_insert[id]) {
    //styles
    chrome.tabs.insertCSS(id, {file: "css/zTreeStyle.css"});
    chrome.tabs.insertCSS(id, {file: "css/demo.css"});
    chrome.tabs.insertCSS(id, {file: "css/jquery-ui-1.8.16.custom.css"});

    //js
    //chrome.tabs.executeScript(id, {file: "js/jquery-1.6.2.js"});
    //chrome.tabs.executeScript(id, {file: "js/jquery.ztree.core-3.0.js"});
    //chrome.tabs.executeScript(id, {file: "js/jquery.ztree.excheck-3.0.js"});
    //chrome.tabs.executeScript(id, {file: "js/jquery.ztree.exedit-3.0.js"});
    //chrome.tabs.executeScript(id, {file: "js/ui/jquery-ui-1.8.16.custom.js"});
    //chrome.tabs.executeScript(id, {file: "js/jquery.jsPlumb-1.3.3-all.js"});
    //console.log('execute the script of fix-img-path.js for chrome plugin');
    //chrome.tabs.executeScript(id, {file: "js/fix-img-path.js"});
    //chrome.tabs.executeScript(id, {file: "fg.js"});
    //chrome.tabs.executeScript(id, {file: "js/ui/jquery.ui.widget.js"});
    //chrome.tabs.executeScript(id, {file: "js/ui/jquery.ui.mouse.js"});
    //chrome.tabs.executeScript(id, {file: "js/ui/jquery.ui.draggable.js"});
    //chrome.tabs.executeScript(id, {code: $("#dragpannel").draggable({ scroll: true })});
    has_insert[id] = true;
  } else {}
  if(!on[id]) {
    chrome.tabs.sendRequest(id, 'show');
    on[id] = true;
  } else {
    chrome.tabs.sendRequest(id, 'hide');
    on[id] = false;
  }
});
