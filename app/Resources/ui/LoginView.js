/*globals, exports, require, mixin*/
var Styles = require('/ui/Styles').login;

function LoginView() {
  var window = Ti.UI.createWindow();
  var black = Ti.UI.createView({
     backgroundColor: 'black',
     opacity: 0.4
  });
  black.addEventListener('click', function() {
    window.hide();
  });
  window.add(black);
  
  //Container
  var container = Ti.UI.createView(Styles.container);
  
  // "Tabs"
  var leftTab = Ti.UI.createLabel(Styles.leftTab);
  var rightTab = Ti.UI.createLabel(Styles.rightTab);
  container.add(rightTab);
  container.add(leftTab);

  
  //views
  var header = Ti.UI.createLabel(Styles.header);

  var host   = Ti.UI.createTextField(Styles.host);
  var colon  = Ti.UI.createLabel(Styles.colon);
  var port   = Ti.UI.createTextField(Styles.port);
  var button = Ti.UI.createButton(Styles.button);
  var room   = Ti.UI.createTextField(Styles.room);

  var qrcodeButton = Ti.UI.createButton({
  	title: 'QR Code    ',
  	right: -15,
  	top: -5,
  	visible: false
  });
  
  ////
  
  	// load the Scandit SDK module
	var scanditsdk = require("com.mirasense.scanditsdk");
	 
	var scannerWindow = Ti.UI.createWindow({
		backgroundColor: '#fff'
	});
	
	var picker;
	 
	// Sets up the scanner and starts it in a new window.
	var openScanner = function() {
	    if(Ti.Platform.osname === 'android'){
			Ti.UI.Android.hideSoftKeyboard();
		}
		container.hide();
	    // Instantiate the Scandit SDK Barcode Picker view
	    picker = scanditsdk.createView({
	        width:"100%",
	        height:"100%"
	    });
	    // Initialize the barcode picker, remember to paste your own app key here.
	    picker.init("d5W+Tr8aEeKduW2TR4mL9bnB7moUgQV4Y19RCoOlJNU", 0);
	 
	    //picker.showSearchBar(true);
	    picker.setQrEnabled(true);
	    // add a tool bar at the bottom of the scan view with a cancel button (iphone/ipad only)
	    picker.showToolBar(true);
	 
	    // Set callback functions for when scanning succeedes and for when the
	    // scanning is canceled.
	    picker.setSuccessCallback(function(e) {
	    	if(e.symbology == 'QR'){
	    		host.value = e.barcode.split('http://')[1].split('/#')[0];
	    		port.value = 80;
	    		room.value = e.barcode.split('/#-')[1];
	    		if(typeof e.barcode.split(':')[2] != 'undefined'){
	    			port.value = e.barcode.split(':')[2].split('/#')[0];
	    		}
	    		host.fireEvent('change');
	    		port.fireEvent('change');
	    		room.fireEvent('change');
	    		button.fireEvent('click');
	    		closeScanner();
	    	}
	    });
	    picker.setCancelCallback(function(e) {
	    	container.show();
	        closeScanner();
	    });
	 
	    scannerWindow.add(picker);
	    scannerWindow.addEventListener('open', function(e) {
	        // Adjust to the current orientation.
	        // since window.orientation returns 'undefined' on ios devices
	        // we are using Ti.UI.orientation (which is deprecated and no longer
	        // working on Android devices.)
	        if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
	            picker.setOrientation(Ti.UI.orientation);
	        }
	        else {
	            picker.setOrientation(window.orientation);
	        }
	 
	        picker.setSize(Ti.Platform.displayCaps.platformWidth,
	                       Ti.Platform.displayCaps.platformHeight);
	        picker.startScanning();     // startScanning() has to be called after the window is opened.
	    });
	    scannerWindow.open();
	}
	 
	// Stops the scanner, removes it from the window and closes the latter.
	var closeScanner = function() {
	    if (picker != null) {
	        picker.stopScanning();
	        scannerWindow.remove(picker);
	    }
	    scannerWindow.close();
	}
	 
	// Changes the picker dimensions and the video feed orientation when the
	// orientation of the device changes.
	Ti.Gesture.addEventListener('orientationchange', function(e) {
	    scannerWindow.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT,
	                   Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT];
	    if (picker != null) {
	        picker.setOrientation(e.orientation);
	        picker.setSize(Ti.Platform.displayCaps.platformWidth,
	                Ti.Platform.displayCaps.platformHeight);
	        // You can also adjust the interface here if landscape should look
	        // different than portrait.
	    }
	});
  
  ////
  
  qrcodeButton.addEventListener('click', function(){
  	openScanner();
  });

  leftTab.addEventListener('click', function() {
    leftTab.backgroundColor = 'transparent';
    rightTab.backgroundColor = '#4377d2';
    port.visible = colon.visible = room.visible = false;
    qrcodeButton.visible = false;
    host.width = "280dp";
    container.height = "190dp";
  });

  rightTab.addEventListener('click', function() {
    host.width = "205dp";
    container.height = "230dp";
    rightTab.backgroundColor = 'transparent';
    leftTab.backgroundColor = '#4377d2';
    port.visible = colon.visible = room.visible = true;
    qrcodeButton.visible = true;
  });


  host.value = Ti.App.Properties.getString("address");
  host.addEventListener("change", function() {
    Ti.App.Properties.setString("address", host.value);
  });

  port.value = Ti.App.Properties.getString("port");
  port.addEventListener("change", function() {
    Ti.App.Properties.setString("port", port.value);
  });

  room.value = Ti.App.Properties.getString("room");
  room.addEventListener("change", function() {
    Ti.App.Properties.setString("room", room.value);
  });



  button.addEventListener('click', function() {
    if (Ti.App.Properties.getString("port","").length === 0) {
      port.value = "3000";
    }

    // If user unnecessarily enters full url in the host field
    // e.g. http://localhost:3000
    Ti.App.Properties.setString("port", port.value);
    if (host.value.match("^http://")) {
      host.value = host.value.substring(7);
      host.fireEvent("change");
    } else if (host.value.match("3000$")) {
      host.value = host.value.replace(/:3000$/,"");
      host.fireEvent("change");
      port.value = "3000";
      port.fireEvent("change");
    }

    if (host.value.indexOf("https://") === 0) { // attempt https
      host.value = host.value.substring(8);
      host.fireEvent("change");
      alert("https not (yet) supported");
    } else if (host.value.indexOf(":") > -1) { //managing full url again
      var parts = host.value.split(":");
      host.value = parts[0];
      host.fireEvent("change");
      port.value = parts[1];
      port.fireEvent("change");
      rightTab.fireEvent('click');
      alert("Please use advanced settings to configure port");
    } else if (Ti.App.Properties.getString("address","").length === 0) {
      alert("IP Address Required");
    } else {
      window.fireEvent("connect");
    }
  });

  container.add(header);
  container.add(host);
  container.add(button);
  container.add(colon);
  container.add(port);
  container.add(room);
  container.add(qrcodeButton);
  

  window.add(container);

  return window;
};

module.exports = LoginView;
