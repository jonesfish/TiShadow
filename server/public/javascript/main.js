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

  //// Create Firepad.
  firepad = Firepad.fromCodeMirror(firepadRef, codeMirror);

  if (firepad.isHistoryEmpty()) {
    firepad.setText('alert("Hello from your Titanium Code.");');
  }

});



