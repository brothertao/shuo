$(function() {
  console.log('path_prefix');
  function fixcsspath(rules, folder) {
    var path_prefix = chrome.extension.getURL('') + 'css/';
    console.log('path_prefix');
    console.log(path_prefix);
    var lookfor = 'url(';
    var ss = document.styleSheets;

    for (var j = 0; j < rules.length; j++) {
      var b = rules[j].style['background-image'];
      var s;
      if (b && (s = b.indexOf(lookfor)) >= 0) {
        s = s + lookfor.length;
        rules[j].style['background-image'] = b.replace(b.substr(s, b.indexOf(folder) - s), path_prefix);
      }

      var b2 = rules[j].style['background'];
      var s2;
      if (b2 && (s2 = b2.indexOf(lookfor)) >= 0) {
        s2 = s2 + lookfor.length;
        rules[j].style['background'] = b2.replace(b2.substr(s, b2.indexOf(folder) - s2), path_prefix);
        console.log(rules[j].style['background']);
      }
    }
  };

  var ss = document.styleSheets;

  for (var i = 0; i < ss.length; i++) {
    var rules = ss[i].rules || ss[i].cssRules;
    if (rules[0].selectorText != "#chrome-extention-relative-paths") continue;
    fixcsspath(ss[i].rules, 'images/');
  }
});

