var zNodes = [];
chrome.extension.onRequest.addListener(function(action, sender, sendResponse) {
  console.log('action');
  console.log('action: '+action.toString());
  if ('show' === action) {
    if ($("#RedditEmbed").length<1) {
      get_comments();
      me_info();
      setTimeout("build_view()", 10000);
      //build_view();
    }
    setTimeout("$('#RedditEmbed').show()", 11000);
    //$("#RedditEmbed").show();
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
    view: {
      expandSpeed: "",
      addHoverDom: addHoverDom,
      removeHoverDom: removeHoverDom,
      selectedMulti: false
    },
    edit: {
      enable: true
    },
    data: {
      simpleData: {
        enable: true
      }
    },
    callback: {
      beforeAsync: beforeAsync,
      beforeRemove: beforeRemove,
      beforeRename: beforeRename
    }
  };
  function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i = 0, l = childNodes.length; i < l; i++) {
      childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
  }
  function beforeAsync(treeId, treeNode) {
    return treeNode ? treeNode.level < 5: true;
  }
  function beforeRemove(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("ctree");
    zTree.selectNode(treeNode);
    return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
  }
  function beforeRename(treeId, treeNode, newName) {
    if (newName.length == 0) {
      alert("节点名称不能为空.");
      return false;
    }
    return true;
  }

  var newCount = 1;
  function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if ($("#addBtn_" + treeNode.id).length > 0) return;
    var addStr = "<button type='button' class='add2' id='addBtn_" + treeNode.id + "' title='add node' onfocus='this.blur();'></button>";
    sObj.append(addStr);
    var btn = $("#addBtn_" + treeNode.id);
    if (btn) btn.bind("click", function() {
      var zTree = $.fn.zTree.getZTreeObj("ctree");
      zTree.addNodes(treeNode, {
        id: (100 + newCount),
        pId: treeNode.id,
        name: "new node" + (newCount++)
      });
    });
  };
  function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.id).unbind().remove();
  };
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
  $.fn.zTree.init($("#ctree"), setting, zNodes);
  console.log('finish build view');
};
