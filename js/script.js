chrome.extension.onRequest.addListener(function(action, sender, sendResponse) {
  console.log(action);
  if ('show' === action) {
    //get_comments();
    build_view();
  }
  });
function build_view() {
  if ($(".RedditEmbed").length > 0) return;

		var setting = {
			async: {
				enable: true,
				url:"http://localhost/ztree/demo/asyncData/getNodes.php",
				autoParam:["id", "name=n"],
				otherParam:{"otherParam":"zTreeAsyncTest"},
				dataFilter: filter
			},
			view: {expandSpeed:"",
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
			for (var i=0, l=childNodes.length; i<l; i++) {
				childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
			}
			return childNodes;
		}
		function beforeAsync(treeId, treeNode) {
			return treeNode ? treeNode.level < 5 : true;
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
			if ($("#addBtn_"+treeNode.id).length>0) return;
			var addStr = "<button type='button' class='add2' id='addBtn_" + treeNode.id
				+ "' title='add node' onfocus='this.blur();'></button>";
			sObj.append(addStr);
			var btn = $("#addBtn_"+treeNode.id);
			if (btn) btn.bind("click", function(){
				var zTree = $.fn.zTree.getZTreeObj("ctree");
				zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
			});
		};
		function removeHoverDom(treeId, treeNode) {
			$("#addBtn_"+treeNode.id).unbind().remove();
		};
  var RedditEmbed = $("<div />").attr({
    'id': 'RedditEmbed',
    "class": "ui-widget-content ui-draggable"
  });
  RedditEmbed.append('<p class="ui-widget-header">Drag me around</p>');
  var cTree = $("<ul>").attr({'id':'ctree', 'class': 'ztree'});
  RedditEmbed.append(cTree);
  $('body').append(RedditEmbed);
  $.fn.zTree.init($("#ctree"), setting);
  console.log('finish build view');
};



function toggleElement(elemName) {
  var element = $(elemName);
  if (element.style.display == 'none') {
    element.style.display = 'block';
    return;
  }
  element.style.display = 'none';
};
function createPanel(panelTitle, HNurl) {
    console.log(HNurl);
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
};
function cuttoff(date, points) {
  var difference = new Date() - new Date(date);
  var months = difference / (1000 * 60 * 60 * 24 * 30);
  if (months > points) {
    return false;
  } else {
    return true;
  }
};
