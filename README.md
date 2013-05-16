TiShadow
========

This is @lis186 fork of [TiShadow](https://github.com/dbankier/TiShadow)

TiShadow is the most powerful rapid prototyping tools for Appcelerator Titanium.
This fork is focused on providing collaborative prototyping realtied functions.


Collaborative coding in the browser
===================================
<img width="550px" src="https://www.evernote.com/shard/s1/sh/24d080a5-ffa2-47cb-b2e4-1673ec142e54/b79403cc68cf7294693dde9e47d894e7/deep/0/TiShadow.png">

Try the demo before host your own
---------------------------------
http://www.tisnippet.com:3000/


Start the TiShadow Server
---------------------
The server can be started by typing the following command:

```
./cli/tishadow server 

```

Start the TiShadow App
----------------------

Once the server is running launch the app. For example, to launch the
app in the iPhone simulator using the Titanium CLI:

```
  cd ~/tishadowapp
  titanium build -p iphone
```

From the app just enter the ip address or hostname of the computer running the
server and hit connect. (There are also more advanced connection settings
that can be used for remote server connections.)

Code Snippets Via Webpage
-------------------------
 
Enter the following address in a browser window:

```
    http://localhost:3000/
```
In the editor you can enter code and press Command+s to deploy the code
snippet to all connected devices.

Collaborative coding
---------------------
Each time you open the page without hash.(ex. http://192.168.1.5:3000/)
The page will generate a random hash for you. (ex. http://192.168.1.5:3000/#-IuaBTMt0IM-HOxaC9lC)
Sent the url to others who what to join.
When others get to the page, you will see him or her on the user list.
Both of you can edit the code at the same time.
Every one can change the name and color to represent themself.

note: Don't sent localhost:3000 or 127.0.0.1:3000 to others, it is not going to work.

Save code for later use
-----------------------
You can save the url to your bookmark, the code will be still there.

Credits
=======
The project is forked from dbankier's[TiShadow](https://github.com/dbankier/TiShadow)

The server code uses the following and are included:

 * [node.js](http://nodejs.org/)
 * [express](http://expressjs.com/)
 * [socket.io](http://socket.io)
 * [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
 * [Firepad](http://www.firepad.io/)

The app is built using [Appcelerator](http://www.appcelerator.com/)'s
Titanium.


<!---
TiShadow provides Titanium developers the ability to deploy apps, run tests or execute code snippets live across all running iOS and Android devices.

There are three parts to TiShadow: the TiShadow server, TiShadow app and TiShadow CLI
which are all need.

~~Have a look at this [presentation](http://www.slideshare.net/londontitanium/titanium-london-tishadow-july-2012) (July 2012) given at the TiLondon meetup for a look at most of what you can do with TiShadow.~~ (Outdated)

Join the discussion on the [Google Group](https://groups.google.com/forum/?fromgroups=#!forum/tishadow).
You can also find some TiShadow related blog posts
[here](http://www.yydigital.com/blog)


Getting Started
===============

TiShadow Install
----------------

### TiShadow NPM Package

TiShadow is built on [node.js](http://nodejs.org/) and is required.

TiShadow can be installed via npm using the following command:

```
  sudo npm install -g tishadow
```

### TiShadow App

To create a new titanium project use the following command:

```
  tishadow app -d [destination folder]
```

e.g.

```
  mkdir ~/tishadowapp
  tishadow app -d ~/tishadowapp
```

**NOTE**: In general upgrade the server side and app at
the same time (using the `tishadow app` command).


Start the TiShadow Server
---------------------

The server can be started by typing the following command:

```
  tishadow server
```

The following options are available:

```
    -h, --help          output usage information
    -p, --port <port>   server port
    -l, --long-polling  force long polling
```

### Remote Server Mode and Private Rooms

The TiShadow Server supports remote hosting with configurable http
ports. It also allow for private "rooms" (much like chat rooms) so that
the TiShadow server can be shared. 

The `tishadow log` command is
available to tail remote server logs (in the default or selected room).

The `tishadow config` command is available to set the default host, port
and room for all the relevant command below.


Start the TiShadow App
----------------------

Once the server is running launch the app. For example, to launch the
app in the iPhone simulator using the Titanium CLI:

```
  cd ~/tishadowapp
  titanium build -p iphone
```

From the app just enter the ip address or hostname of the computer running the
server and hit connect. (There are also more advanced connection settings
that can be used for remote server connections.)


What you can do with TiShadow
=============================

Full Application Deployment
---------------------------

Go to the root folder of your project and enter the following command to deploy an app:

```
  tishadow run
```

If the app has been deployed and you want to push minor updates, use the following command:

```
  tishadow run --update
```

Here are full list of options:

```
    -h, --help             output usage information
    -u, --update           Only send recently changed files
    -l, --locale <locale>  set the locale in in the TiShadow app
    -j, --jshint           analyse code with JSHint
    -t, --tail-logs        tail server logs on deploy
    -o, --host <host>      server host name / ip address
    -p, --port <port>      server port
    -r, --room <room>      server room
```


The app is then cached on the device. If need to clear the cache, use
the following command:

```
  tishadow clear
```

__Some notes and limitations__

 * CommonJS modules should be required with their full path.
 * `Ti.include` is partially supported and will work if included with the full path 
    i.e. slash leading.
 * Only files in the Resources directory will be sent to the device
   using TiShadow. That said, localisation files **are** supported. (see
   options above). 
 * Native modules _can_ be supported if built into the TiShadow app
   first. (I.e., add them to the tiapp.xml of the TiShadow app.)
 * Custom fonts will be loaded if placed in the `Resources/fonts`
   directory.
 * If there any errors about a Titanium SDK command not being found, add
   them to the Includes.js files and clean and build the TiShadow app. (I
   will gradually be adding commands.)
 * Any Ti.API logs will be redirected to the server logs and webpage.


### Keeping it Clean

If you want to make sure the previous app deployed is closed prior to
updating or launching the new one, include the following code snippet in your
`app.js` file:

```javascript
    try {
      exports.close = function() {
        // Your code to close, e.g, main_window.close();
      };
      Ti.API.info("Running in TiShadow");
    } catch (e) {
      Ti.API.info("Running stand-alone");
    }
```

If you are using [Alloy](https://github.com/appcelerator/alloy), you can
use the following [alloy.jmk](https://gist.github.com/dbankier/5087906) file instead.


Testing / Assertions
--------------------

TiShadow supports [Jasmine](http://pivotal.github.com/jasmine/) BDD tests. 
(Insipration taken from these two projects: [titanium-jasmine](https://github.com/guilhermechapiewski/titanium-jasmine/) and [jasmine-titanium](https://github.com/akahigeg/jasmine-titanium))

Include your specs in the `spec` path of your project. Ensure
the files are ending in `_spec.js`. (Note: simply write the spec without any including/requiring the jasmine library.)

To execute the tests enter the following command:

```bash
  tishadow spec
```

Here are a full list of options:

```
    -h, --help             output usage information
    -u, --update           Only send recently changed files
    -l, --locale <locale>  Set the locale in in the TiShadow app
    -o, --host <host>      server host name / ip address
    -p, --port <port>      server port
    -r, --room <room>      server room
    -j, --jshint           analyse code with JSHint
    -x, --junit-xml        output report as JUnit XML
```

The test results will be returned to the server/cli output:
![Spec Output](http://github.com/dbankier/TiShadow/raw/master/example/spec.png)

See the included example project or this [blog post](http://www.yydigital.com/blog/2013/2/14/Testing_Alloy_With_Jasmine_And_TiShadow).


_Alternatively (yet not preferred)_

TiShadow also supports the use of assertions and the results are
returned either to the browser or server logs.
 
For example:

```javascript
    assert.isNumber(6, "Testing if 6 is a number");
    assert.isArray([1,2,3,4], "Testing if it is an array");
```

The following assertion are supported:
'equal', 'strictEqual', 'deepEqual', 'isTrue', 'isFalse',
'isEmpty', 'isElement', 'isArray','isObject', 'isArguments', 'isFunction',
'isString', 'isNumber', 'isFinite', 'isBoolean', 'isDate', 'isRegExp', 'isNaN', 'isNull',
'isUndefined', 'lengthOf', 'match', 'has'

Also the equivalent not assertions are available as well, e.g.
'notEqual', 'isNotString', 'isNotNumber', etc.
 

Configurable Localisation
-------------------------
TiShadow supports dynamic localisation. You can also chose the locale 
you wish to use when launching your app/tests. Simply add the
two-letter language code to your command. For example:

```
  tishadow run --locale es
  tishadow spec --locale nl
```

TiShadow REPL
-------------

The TiShadow REPL is available and evaluates commands in a
persistent sand-boxed context. 

To Launch the REPL enter the following command:

```bash
  tishadow repl
```
With the following options: 

```
    -h, --help         output usage information
    -o, --host <host>  server host name / ip address
    -p, --port <port>  server port
    -r, --room <room>  server room
```


`launchApp(appName)`, `closeApp()` and `clearCache()` methods available
to interact with apps cached in the TiShadow app.

`require()`, `Ti.include()` and assets are relative the running app
inside the TiShadow app.


Code Snippets Via Webpage
-------------------------
 
Enter the following address in a browser window:

```
    http://localhost:3000/
```

In the editor you can enter code and press Command+s to deploy the code
snippet to all connected devices. Have a look at the demo [video](http://www.youtube.com/watch?v=xUggUXQArUM).

Coding from the webpage works much like the REPL and variables
are stored in a sand-boxed context. See the next section.


TiShadow Appify
---------------

The `tishadow appify` command can be used to create a
stand-alone app that is integrated with TiShadow. It automatically
launches the contained tishadow bundle and connects to a pre-configured
server. The allows connecting to the deployed app via the repl and/or
push upgrades.

```
  Usage: appify [options]

  Options:

    -h, --help                output usage information
    -d, --destination <path>  target path for generated project
    -o, --host <host>         set server host name / ip address
    -p, --port <port>         set server port
    -r, --room <room>         set server room
```

See the following [blog post](http://www.yydigital.com/blog/2013/2/19/TiShadow_Appify).


Launch From Web
---------------

_Currently only working on iOS_

You can also use TiShadow to bundle an app and launch it from a web
page. Use the command `tishadow bundle` to bundle the app for a
TiShadow distribution. Then include a link to the bundle in your webpage
using the following format, e.g. : `tishadow://mydomain.com/bundle.zip`.
Tapping on the link from your browser should launch the app in TiShadow.


VIM Shortcuts
-------------
Those using vim/gvim/mvim for development might want to add these
shortcuts (or similar) to the .vimrc/.gvimrc files. It add the shortcuts, F6
to save and do a tishadow update, and Shift+F6 to save and perform a full
tishadow deploy:

```
    :map <F6> <Esc>:w<CR>:!tishadow run --update<CR>a
    :imap <F6> <Esc>:w<CR>:!tishadow run --update<CR>a
    :map <S-F6> <Esc>:w<CR>:!tishadow run<CR>a
    :imap <S-F6> <Esc>:w<CR>:!tishadow run<CR>a 
```


Credits
=======

The server code uses the following and are included:

 * [node.js](http://nodejs.org/)
 * [express](http://expressjs.com/)
 * [socket.io](http://socket.io)
 * [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
 * [Ace](https://github.com/ajaxorg/ace)

The app is built using [Appcelerator](http://www.appcelerator.com/)'s
Titanium.

Third Party Modules
-------------------

### Websockets/Socket.IO
####iPhone/Android
Copyright 2012 jordi domenech jordi@iamyellow.net Apache License, Version 2.0

[Github Repo](https://github.com/iamyellow/tiws)


### ZIP Modules
####iPhone/Android

Now using ti.compression:
[titanium_modules](https://github.com/appcelerator/titanium_modules)


Feedback appreciated.

@davidbankier
-->




