# AngularJS Dynamic Module Register
Ever wondered, if you can insert module into AngularJS application where you don't have to write the name of module into the root module.

Check demo at https://rosinghal.github.io/angularjs-dynamic-module-register.

This repository solves that problem. All you have to do is paste your module's javscript files and insert them in html files (or it can be done using grunt task) and you are good to go.

You have to follow this syntax, while initializing the module.

```
(function (app) {
  'use strict';

  app.registerModule('modulename', []);
}(ApplicationConfiguration));
```

Here replace 'modulename' with name of your module.

To check whether a module is present in HTML use this

```
ng-if="$root.checkModule('modulename')"
```

and use this to check in controller, service or anywhere in angular where you have access to $rootScope
```
$rootScope.checkModule('modulename')
```