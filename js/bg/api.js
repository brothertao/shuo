//API
function check_login(msg) {
  var url = config.host + "/api/me.json";
  $.get(url, 
      function(result) {
        console.log(result);
        msg.isLogin = result.data ? true : false;
        msg.user_info.modhash = msg.isLogin ? result.data.modhash : null;
      }
  );
}
