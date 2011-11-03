chrome.extension.onRequest.addListener(function(msg, sender, sendResponse) {
  $.extend(true, user_info, msg.user_info);
  if (msg.show) {
    if ($("#ViewFrame").length<1) {
      build_vf(!!msg.isLogin);
      link.permalink ? init_comments() : build_submit();
    }
    $("#ViewFrame").show();
  } else {
    $("#ViewFrame").hide();
  }
  if ($("#ViewFrame").length > 0) {
      $("#ViewFrame").draggable({handle:"p"});
  }
});
function login(username, password) {
  $.ajax({
    type: 'POST',
    url: config.host + '/api/login/' + username,
    data: 'api_type=json&user=' + username + '&passwd=' + password,
    success: 
      function(result) {
        console.log(result);
      },
    dataType: 'json'
  });
}
function build_vf(isLogin) {
  //主框架
  var ViewFrame = $("<div />").attr({
    'id': 'ViewFrame',
    "class": "vf"
  });
  //拖动条
  ViewFrame.append('<div class="ui-widget-content ui-draggable"><p class="ui-widget-header">Drag me around</p></div>');
  //评论树
  var cTree = $('<ul></ul>').attr({
    'id': 'ctree',
    'class': 'ztree'
  });
  //登录
  if (!isLogin) {
    var login = $('<div id="login">'
                  + '<span class="login">请输入您的密码：</span>'
                  + '<input name="username" type="text" class="login">'
                  + '<span class="login">请输入您的密码：</span>'
                  + '<input name="pswd" type="password" class="login">'
                  + '</div>');
    ViewFrame.append(login);
  }
  //用户信息
  var user_info = $('<div id="user_info">'
                    + '<span>username</span>'
                    + '</div>');
  ViewFrame.append(user_info);
  ViewFrame.append(cTree);
  ViewFrame.hide();
  $('html').append(ViewFrame);
  console.log('finish build view');
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
