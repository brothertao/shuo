var zNodes = [];
chrome.extension.onRequest.addListener(function(action, sender, sendResponse) {
  console.log('action: '+action.toString());
  if ('show' === action) {
    if ($("#RedditEmbed").length<1) {
      //get_comments();
      //me_info();
      //setTimeout("build_view()", 10000);
      build_view();
    }
    //setTimeout("$('#RedditEmbed').show()", 11000);
    $("#RedditEmbed").show();
  } else if ('hide' === action) {
    $("#RedditEmbed").hide();
  }
  if ($("#RedditEmbed").length > 0) {
    $(function() {
      $("#RedditEmbed").draggable({
        handle: "p"
      });
    });
  }
});
function get_comments() {
  query_url = "http://reddit.local/search.json?sort=top&q=url:" + escape(window.location.href);
  $.get(query_url, function(result) {
    permalink = 'http://reddit.local' + result.data.children[0].data.permalink + '.json';
    $.get(permalink, function(result) {
      //console.log(result);注意此处的数据结构，此数组共有两个Object，第一个是，第二个是评论数据
      obj2node(result[1]);
      console.log('total comments:'+zNodes.length.toString());
    });
  });
}
function obj2node(data) {
  for(var i=0; i<data.data.children.length; i++) {
    node = {
      id: data.data.children[i].data.id,
      pId: data.data.children[i].data.parent_id,
      name: data.data.children[i].data.body,
      open: true
    };
    zNodes.push(node);
    if(data.data.children[i].data.replies) {
      //console.log('replies');
      //console.log(data.data.children[i].data.replies);
      obj2node(data.data.children[i].data.replies);
    }
  }
}
function me_info() {
  var url = "http://reddit.local/api/me.json";
  console.log(url);
  $.get(url, 
      function(result) {
        console.log('result');
        console.log(result);
      }
  );
}
function build_view() {
  //TODO:在次点击时候，关闭面板
  var setting = {
    async: {
      enable: true,
      type: 'get',
      dataType: 'json',
      url:"http://reddit.local/r/reddit_test0/comments/30/local_test/.json",
      dataFilter: filter
    },
    data: {
      key: {
        name: "body",
        childs: "childs",
        title: "body"
      }
    }
  };

  function filter(treeId, parentNode, childNodes) {
    var childNodes = childNodes[1];
    var nodes = [];

    function filter1(treeId, parentNode, childNodes) {
      if (!childNodes) return null;
      var tmpNodes = childNodes.data.children;
      for (var i=0, l=tmpNodes.length; i<l; i++) {
        parentNode[i] = tmpNodes[i].data;
        if (parentNode[i]['replies'] && parentNode[i]['replies'].data.children.length != 0) {
          parentNode[i]['childs']= new Array();
          filter1(treeId, parentNode[i]['childs'], tmpNodes[i].data['replies']);
        }
      }
    }
    filter1(treeId, nodes, childNodes);
    return nodes;
  }
  var RedditEmbed = $("<div />").attr({
    'id': 'RedditEmbed',
    "class": "ui-widget-content ui-draggable"
  });
  RedditEmbed.append('<p class="ui-widget-header">Drag me around</p>');
  var cTree = $("<ul></ul>").attr({
    'id': 'ctree',
    'class': 'ztree'
  });
  RedditEmbed.append(cTree);
  RedditEmbed.hide();
  $('html').append(RedditEmbed);
  console.log(zNodes);
  $.fn.zTree.init($("#ctree"), setting);
  console.log('finish build view');
};
