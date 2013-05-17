var TiShadow = {};
TiShadow.init = function (room){
  console.log(room);
  var socket = io.connect();
  socket.on('connect', function(data) {
    socket.emit("join", {name: 'controller', room: room});
  });
  socket.on('device_connect', function(e){
      $(".device_list").append('<li id="'+ e.id + '">' + e.name + '</li>');
  });
  socket.on('device_disconnect', function(e){
    $("li#" + e.id).remove();
  });
  socket.on('device_log', function(e) {
    var now = new Date();
    var log = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + " [" + e.level + "] [" + e.name + "]    " + (e.message === undefined ? 'undefined' : e.message.toString().replace("\n","<br/>"));
    var style = e.level === "ERROR"  || e.level === "FAIL" ? " error" : e.level === "WARN" ? "" : " success"
    $(".console").append("<div class='alert-message" + style + "'>" + log + "</div>");
    $(".console").scrollTop($(".console")[0].scrollHeight);
  });
  TiShadow.socket = socket;
};

var firepad;
var sentData = function(){
    var code = firepad.getText();
    TiShadow.socket.emit("snippet", {code: code});
  }

var killApp = function(){
   TiShadow.socket.emit("snippet", {code: 'this'});
}

var clearConsole = function(){
  $('.console').html('');
}

function sentCodeInit() {
  var lastKey;
  $(window).bind('keydown',function(e){
    if( lastKey && (lastKey == 91 && e.keyCode == 83) || (lastKey == 83 && e.keyCode == 91) ){
      e.preventDefault();
      console.log('ctrl+s');
      sentData();
      return false;
    }
    
    if( lastKey && (lastKey == 91 && e.keyCode == 75) || (lastKey == 75 && e.keyCode == 91) ){
      e.preventDefault();
      console.log('ctrl+k');
      killApp();
      return false;
    }
    
    lastKey = e.keyCode;
  });
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

$(document).ready(function() {

  //// Initialize Firebase.
  var firepadRef = getFirepadRef(function(hash){
    TiShadow.init(hash);
    $('#hostname').attr({"value": window.location.hostname});
    $('#port').attr({"value": window.location.port});
    $('#room').attr({"value": window.location.hash.substr(2)});
  });

  //// Create CodeMirror (with line numbers and the JavaScript mode).
  var codeMirror = CodeMirror(document.getElementById('editor'), {
    lineNumbers: true,
    mode: 'javascript'
  });

  // Create a random ID to use as our user ID (we must give this to firepad and FirepadUserList).
    var userId = Math.floor(Math.random() * 9999999999).toString();

  var userColor = get_random_color();
  //// Create Firepad.
  firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {userId:userId, userColor: userColor});

  var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
          document.getElementById('user_list'), userId);

  firepad.on('ready', function() {
    sentCodeInit();
    $('#colorpicker').minicolors({
          control: $(this).attr('data-control') || 'hue',
          defaultValue: $(this).attr('data-default-value') || '',
          inline: false,
          letterCase: $(this).hasClass('uppercase') ? 'uppercase' : 'lowercase',
          opacity: $(this).hasClass('opacity'),
          position: $(this).attr('data-position') || 'default',
          styles: $(this).attr('data-style') || '',
          swatchPosition: $(this).attr('data-swatch-position') || 'left',
          textfield: false,
          theme: $(this).attr('data-theme') || 'default',
          defaultValue: userColor,
          show: function(){
            $('.firepad-userlist-user:eq(0)').height('180px');
          },
          hide: function(){
            $('.firepad-userlist-user:eq(0)').height('40px');
          },
          change: function(hex, opacity) {
              firepad.setUserColor(hex);
              console.log(hex);
          }
      });
    $('#colorpicker').show();
    if (firepad.isHistoryEmpty()) {
        firepad.setText('alert("Hello from your Titanium Code.");');
      }
  });
});



