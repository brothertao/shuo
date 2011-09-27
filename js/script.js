$(document).ready(function() {
  searchReddit();
});
if (window.top != window.self) return;
var exclude = ['.xml', '.txt', '.jpg', '.png', '.avi', '.mp3', '.pdf', '.mpg'];
function searchReddit() {
  var curPath = window.location.href;
  var end = curPath.substr( - 4);
  for (x in exclude) {
    if (end == x) {
      return;
    }
  }
  var queryURL = "http://reddit.local/search.json?sort=top&q=url:" + escape(curPath);
  chrome.extension.sendRequest({
    'action': 'get',
    'url': queryURL
  },
  function(response) {
    var data = JSON.parse(response);
    var foundItem = data.data.children[0].data;
    if (foundItem.url == curPath) {
      createPanel(foundItem.title, 'http://reddit.local' + foundItem.permalink + '.compact?keep_extension=True');
    }
  });
}
function toggleElement(elemName) {
  var element = $(elemName);
  if (element.style.display == 'none') {
    element.style.display = 'block';
    return;
  }
  element.style.display = 'none';
}
function createPanel(panelTitle, HNurl) {
    console.log(HNurl);
  if ($(".RedditEmbed").length > 0) return;
  var RedditEmbed = $("<div />").attr({
    'id': 'RedditEmbed'
  });
  var RedditSite = $("<iframe />").attr({
    'id': 'RedditSite',
    'src': HNurl
  });
  var RedditTab = $("<div>Reddit</div>").attr({
    'id': 'RedditTab'
  });
  var panelTitle = ">>> <b>Reddit</b> >>>";
  var RedditTitle = $("<span>" + panelTitle + "</span>").attr({
    'id': 'RedditTitle'
  });
  var RedditHeader = $("<div/>").attr({
    'id': 'RedditHeader'
  });
  $(window).resize(fixIframeHeight);
  function fixIframeHeight() {
    RedditEmbed.height($(window).height());
    RedditSite.height(RedditEmbed.height() - 20);
  }
  function togglePanel() {
    var openPanel = RedditTab.is(":visible");
    var embedPosition = openPanel ? "0px": "-700px";
    var tabPosition = openPanel ? "-25px": "0px";
    if (openPanel) {
      fixIframeHeight();
      RedditTab.animate({
        right: tabPosition
      },
      150, "linear",
      function() {
        RedditEmbed.show();
        RedditTab.hide();
        RedditEmbed.animate({
          right: embedPosition
        },
        400, "linear");
      });
    } else {
      RedditEmbed.animate({
        right: embedPosition
      },
      400, "linear",
      function() {
        RedditTab.show();
        RedditEmbed.hide();
        RedditTab.animate({
          right: tabPosition
        },
        150, "linear");
      });
    }
  }
  RedditHeader.click(togglePanel);
  RedditTab.click(togglePanel);
  RedditHeader.append(RedditTitle);
  RedditEmbed.append(RedditHeader);
  RedditEmbed.append(RedditSite);
  RedditEmbed.hide();
  $('body').append(RedditTab);
  $('body').append(RedditEmbed);
}
function cuttoff(date, points) {
  var difference = new Date() - new Date(date);
  var months = difference / (1000 * 60 * 60 * 24 * 30);
  if (months > points) {
    return false;
  } else {
    return true;
  }
}
