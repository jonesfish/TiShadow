var TiShadow = {};
TiShadow.init = function (session, guest){
  var socket = io.connect();
  socket.on('connect', function(data) {
    socket.emit("join", {name: 'controller'});
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

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

$(document).ready(function() {
  TiShadow.init();

  //// Initialize Firebase.
  // var ref = new Firebase('<YOUR FIREBASE URL>');
  var firepadRef = getExampleRef();

  //// Create CodeMirror (with line numbers and the JavaScript mode).
  var codeMirror = CodeMirror(document.getElementById('editor'), {
    lineNumbers: true,
    mode: 'javascript'
  });

  var userColor = get_random_color();
  //// Create Firepad.
  firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {userColor: userColor});

  firepad.on('ready', function() {
    $('#colorpicker').minicolors({
          control: $(this).attr('data-control') || 'hue',
          defaultValue: $(this).attr('data-default-value') || '',
          inline: $(this).hasClass('inline'),
          letterCase: $(this).hasClass('uppercase') ? 'uppercase' : 'lowercase',
          opacity: $(this).hasClass('opacity'),
          position: $(this).attr('data-position') || 'default',
          styles: $(this).attr('data-style') || '',
          swatchPosition: $(this).attr('data-swatch-position') || 'left',
          textfield: !$(this).hasClass('no-textfield'),
          theme: $(this).attr('data-theme') || 'default',
          defaultValue: userColor,
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



