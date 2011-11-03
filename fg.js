var zNodes = [];
chrome.extension.onRequest.addListener(function(action, sender, sendResponse) {
  console.log('action: '+action.toString());
  if ('show' === action) {
    if ($("#ViewFrame").length<1) {
      //get_comments();
      //check_login();
      //login('reddit', 'qwe123');
      //me_info();
      //comment();
      build_view();
    }
    $("#ViewFrame").show();
  } else if ('hide' === action) {
    $("#ViewFrame").hide();
  }
  if ($("#ViewFrame").length > 0) {
    $(function() {
      $("#ViewFrame").draggable({
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
function login(username, password) {
  var url = "http://reddit.local/api/login/" + username;
  console.log(url);
  $.ajax({
    type: 'POST',
    url: url,
    data: 'api_type=json&user=' + username + '&passwd=' + password,
    success: 
      function(result) {
        console.log(result);
      },
    dataType: 'json'
  });
}
function me_info() {
  var url = "http://reddit.local/api/me.json";
  $.get(url, 
      function(result) {
        $('#user_name').text(result.data.name);
        console.log('user info:');
        console.log(result);
      }
  );
}
function check_login() {
  var url = "http://reddit.local/api/me.json";
  $.get(url, 
      function(result) {
        if (result.data) {
          return true;
        } else {
          return false;
        }
      }
  );
}
function build_view() {
  var setting = {
    edit: {
      enable: true
    },
    async: {
      enable: true,
      type: 'get',
      dataType: 'json',
      url:"http://reddit.local/r/reddit_test0/comments/30/local_test/.json",
      dataFilter: filter
    },
    callback: {
      beforeRename: beforeRename,
    },
    data: {
      key: {
        name: "body",
        childs: "childs",
        title: "body"
      }
    },
    view: {
      addHoverDom: addHoverDom,
      removeHoverDom: removeHoverDom,
      selectedMulti: false
    }
  };

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
    if ($("#addBtn_"+treeNode.id).length>0) return;
    if ($("#cancelBtn_"+treeNode.id).length>0) return;
    var addStr = "<button type='button' class='add' id='addBtn_" + treeNode.id
      + "' title='reply' onfocus='this.blur();'></button>";
    sObj.append(addStr);
    var btn = $("#addBtn_"+treeNode.id);
    if (btn) btn.bind("click", function(){
      var zTree = $.fn.zTree.getZTreeObj("ctree");
      zTree.addNodes(treeNode, 
        {
          id:('c_'+ newCount++), 
          pId:treeNode.id,
          body: 'Please enter ...'
        }
      );
    });
  };
  function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.id).unbind().remove();
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
  var ViewFrame = $("<div />").attr({
    'id': 'ViewFrame',
    "class": "ui-widget-content ui-draggable"
  });
  ViewFrame.append('<p class="ui-widget-header">Drag me around</p>');
  ViewFrame.append('<span id="user_name" class="user_name">username</span>');
  var cTree = $("<ul></ul>").attr({
    'id': 'ctree',
    'class': 'ztree'
  });
  ViewFrame.append(cTree);
  ViewFrame.hide();
  $('html').append(ViewFrame);
  me_info();
  console.log(zNodes);
  $.fn.zTree.init($("#ctree"), setting);
  console.log('finish build view');
};
function submit_link() {
  var url = "http://reddit.local/api/submit";
  console.log(url);
  $.ajax({
    type: 'POST',
    url: url,
    //将下面转为动态
    data: 'uh=reddit&kind=link&url=yourlink1.com&text=哈哈&sr=reddit_test0&title=omg-look-at-this&r=reddit_test0',
    success: 
      function(result) {
        console.log(result);
      },
    dataType: 'json'
  });
}
function comment() {
  var url = "http://reddit.local/api/comment";
  console.log(url);
  $.ajax({
    type: 'POST',
    url: url,
    //将下面转为动态
    data: 'uh=reddit&thing_id=t6_30&text=哈哈',
    success: 
      function(result) {
        console.log(result);
      },
    dataType: 'json'
  });
}
