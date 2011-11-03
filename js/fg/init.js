var link = {
  cur_url: window.location.href,
};
var user_info = {};
console.log(link);
function init_comments() {
  var setting = {
    edit: {
      enable: true
    },
    async: {
      enable: true,
      type: 'get',
      dataType: 'json',
      url: config.host + link.permalink + '.json',
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

    function convert_data(treeId, parentNode, childNodes) {
      if (!childNodes) return null;
      var tmpNodes = childNodes.data.children;
      for (var i=0, l=tmpNodes.length; i<l; i++) {
        parentNode[i] = tmpNodes[i].data;
        if (parentNode[i]['replies'] && parentNode[i]['replies'].data.children.length != 0) {
          parentNode[i]['childs']= new Array();
          convert_data(treeId, parentNode[i]['childs'], tmpNodes[i].data['replies']);
        }
      }
    }
    convert_data(treeId, nodes, childNodes);
    return nodes;
  }
  $.fn.zTree.init($("#ctree"), setting);
}
function url_info() {
  var url = config.host + "/api/info.json?url=" + link.cur_url;
  $.get(url, 
      function(result) {
        link.permalink = result.data.children[0] ? result.data.children[0].data.permalink : null;
      }
  );
}
function submit_link(title, text) {
  $.ajax({
    type: 'POST',
    url: config.host + '/api/submit',
    //将下面转为动态
    data: 'uh=' + user_info.modhash
          + '&kind=link'
          + '&url=' + link.cur_url
          + '&text=' + text
          + '&sr=reddit_test0'
          + '&title=' + title
          + '&r=reddit_test0',
    success: 
      function(result) {
        console.log('submit link success');
        console.log(result);
      },
    dataType: 'json'
  });
}
function build_submit() {
  var submitLink = 
    $('<div id="submit_link">'
    + '<p class="descr">赶紧提交这个网页吧，你是第一个哦，嘿嘿！</p>'
    + '<span class="title">整一个title吧，或许有用哦</span>'
    + '<textarea rows="2" cols="10" id="submit_title" name="title"></textarea>'
    + '<span class="title">说点啥？</span>'
    + '<textarea rows="2" cols="10" id="submit_text" name="text"></textarea>'
    + '<button class="btn" id="submit_link_btn">提交</button>'
    + '</div>');
  $('#ctree').hide();
  $('#ViewFrame').append(submitLink);
  $('#submit_link_btn').bind('click', function(){
    var title = $('#submit_title').val();
    var text = $('#submit_text').val();
    if (title.length < 4) alert('太短'); 
    submit_link(title, text);
    });
}

url_info();
