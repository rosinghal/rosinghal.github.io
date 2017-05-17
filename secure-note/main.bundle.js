webpackJsonp([0,3],{

/***/ 119:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(42);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return DbService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PouchDB = __webpack_require__(819);
var DbService = (function () {
    function DbService(zone, sanitizer) {
        this.zone = zone;
        this.sanitizer = sanitizer;
        this.createDB('Default');
    }
    DbService.prototype.createDB = function (dbName, remoteUrl, remoteUsername, remotePassword) {
        if (remoteUrl === void 0) { remoteUrl = null; }
        if (remoteUsername === void 0) { remoteUsername = null; }
        if (remotePassword === void 0) { remotePassword = null; }
        this.db = new PouchDB(dbName);
        // this.username = 'DATABASE_KEY';
        // this.password = 'YOUR_PASSWORD';
        //
        if (remoteUrl && remoteUsername && remotePassword) {
            this.remote = remoteUrl; //'https://YOU_ACCOUNT_NAME.cloudant.com/YOUR_DATABASE';
            this.username = remoteUsername;
            this.password = remotePassword;
            var options = {
                live: true,
                retry: true,
                continuous: true,
                auth: {
                    username: this.username,
                    password: this.password
                }
            };
            this.db.sync(this.remote, options);
        }
    };
    DbService.prototype.allDBNames = function () {
        // window.indexedDB.webkitGetDatabaseNames().onsuccess = (e) => {
        //   for(let i = 0; i < e.target.result.length; i++){
        //     let db = e.target.result[i];
        //     if(db.startsWith('_pouch_')){
        //       console.log(db.re);
        //     }
        //   }
        // };
    };
    DbService.prototype.deleteDb = function () {
        this.db.destroy();
    };
    DbService.prototype.uploadAttachment = function (_docId, _revId, fileObj) {
        var vm = this;
        // var attachment = new Blob(['Is there life on Mars?'], {type: 'text/plain'});
        var _attachmentId = fileObj.name + '~!@#$%^&*()_+' + Math.random();
        return this.db.putAttachment(_docId, _attachmentId, _revId, fileObj, fileObj.type)
            .then(function (note) {
            return { note: note, blob: vm.getAttachmentBlob(_docId, _attachmentId) };
        })
            .then(function (_a) {
            var note = _a.note, blob = _a.blob;
            return blob.then(function (blobOrBuffer) {
                return {
                    note: note,
                    file: vm.getBlobDetail(blobOrBuffer, _attachmentId)
                };
            });
        });
    };
    DbService.prototype.getAttachmentBlob = function (_docId, _attachmentId) {
        return this.db.getAttachment(_docId, _attachmentId);
    };
    DbService.prototype.getBlobDetail = function (blobOrBuffer, _attachmentId) {
        return {
            name: _attachmentId.substr(0, _attachmentId.indexOf('~!@#$%^&*()_+')),
            url: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blobOrBuffer)),
        };
    };
    DbService.prototype.addNote = function (defaultObj) {
        if (defaultObj === void 0) { defaultObj = { content: '' }; }
        return this.db.post(defaultObj);
    };
    DbService.prototype.updateNote = function (doc) {
        return this.db.put(doc);
    };
    DbService.prototype.getDoc = function (_id) {
        return this.db.get(_id, {
            include_docs: true,
            attachments: true
        });
    };
    DbService.prototype.deleteDoc = function (_id, _rev) {
        return this.db.remove(_id, _rev);
    };
    DbService.prototype.getDocuments = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.db.allDocs({
                include_docs: true,
                attachments: true
            }).then(function (result) {
                _this.data = [];
                result.rows.map(function (row) {
                    _this.data.push(row.doc);
                });
                resolve(_this.data);
                _this.db.changes({
                    live: true,
                    since: 'now',
                    include_docs: true
                }).on('change', function (change) {
                    _this.handleChange(change);
                });
            }).catch(console.log.bind(console));
        });
    };
    DbService.prototype.handleChange = function (change) {
        var _this = this;
        this.zone.run(function () {
            var changedDoc = null;
            var changedIndex = null;
            _this.data.forEach(function (doc, index) {
                if (doc._id === change.id) {
                    changedDoc = doc;
                    changedIndex = index;
                }
            });
            //A document was deleted
            if (change.deleted) {
                _this.data.splice(changedIndex, 1);
            }
            else {
                //A document was updated
                if (changedDoc) {
                    _this.data[changedIndex] = change.doc;
                }
                else {
                    _this.data.push(change.doc);
                }
            }
        });
    };
    DbService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["b" /* DomSanitizer */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["b" /* DomSanitizer */]) === 'function' && _b) || Object])
    ], DbService);
    return DbService;
    var _a, _b;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/db.service.js.map

/***/ },

/***/ 425:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__db_service__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap__ = __webpack_require__(476);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_material__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Subject__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_debounceTime__ = __webpack_require__(837);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_debounceTime___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_debounceTime__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_distinctUntilChanged__ = __webpack_require__(838);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_distinctUntilChanged___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_distinctUntilChanged__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ng2_file_upload__ = __webpack_require__(471);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ng2_file_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_ng2_file_upload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_platform_browser__ = __webpack_require__(42);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return DetailComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var DetailComponent = (function () {
    function DetailComponent(db, router, route, snackBar, sanitizer) {
        var _this = this;
        this.db = db;
        this.router = router;
        this.route = route;
        this.snackBar = snackBar;
        this.sanitizer = sanitizer;
        this.content$ = new __WEBPACK_IMPORTED_MODULE_5_rxjs_Subject__["Subject"]();
        this.uploader = new __WEBPACK_IMPORTED_MODULE_9_ng2_file_upload__["FileUploader"]({ url: '/api/' });
        this.doc = {};
        this.attachments = [];
        this.content$.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(function (body) { return _this.db.updateNote(_this.doc); })
            .subscribe(function (note) { return _this.handleResponse(note); });
    }
    DetailComponent.prototype.handleResponse = function (note) {
        this.doc._rev = note.rev;
    };
    DetailComponent.prototype.deleteNote = function () {
        var vm = this;
        if (vm.doc._id && vm.doc._rev) {
            vm.db.deleteDoc(vm.doc._id, vm.doc._rev)
                .then(function () {
                vm.snackBar.open('Note deleted', null, {
                    duration: 2000
                });
                vm.router.navigate(['']);
            });
        }
    };
    DetailComponent.prototype.getAttachments = function () {
        var vm = this;
        if (this.doc.hasOwnProperty('_attachments')) {
            Object.keys(this.doc._attachments).map(function (key) {
                vm.db.getAttachmentBlob(vm.doc._id, key)
                    .then(function (blobOrBuffer) {
                    var file = vm.db.getBlobDetail(blobOrBuffer, key);
                    vm.attachments.push(file);
                });
                return key;
            });
        }
    };
    DetailComponent.prototype.uploadAttachment = function (fileObj) {
        var vm = this;
        if (vm.doc._id && vm.doc._rev) {
            vm.db.uploadAttachment(vm.doc._id, vm.doc._rev, fileObj)
                .then(function (response) {
                vm.uploader.clearQueue();
                console.log(response);
                vm.handleResponse(response.note);
                vm.attachments.push(response.file);
            })
                .catch(console.log.bind(console));
        }
    };
    DetailComponent.prototype.fileOver = function (e) {
        if (this.uploader.getNotUploadedItems().length) {
            this.uploadAttachment(this.uploader.getNotUploadedItems()[0]._file);
        }
    };
    DetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loading = true;
        this.route.params
            .switchMap(function (params) { return _this.db.getDoc(params['id']); })
            .subscribe(function (note) {
            console.log(note);
            _this.attachments = [];
            _this.loading = false;
            _this.doc = note;
            _this.getAttachments();
        }, function (error) {
            console.log(error);
            _this.snackBar.open('Note : ' + error.message, 'Ok', {
                duration: 2000
            });
            _this.router.navigate(['']);
        });
    };
    DetailComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-detail',
            template: __webpack_require__(826),
            styles: [__webpack_require__(821)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__db_service__["a" /* DbService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__db_service__["a" /* DbService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__angular_material__["MdSnackBar"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__angular_material__["MdSnackBar"]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_10__angular_platform_browser__["b" /* DomSanitizer */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_10__angular_platform_browser__["b" /* DomSanitizer */]) === 'function' && _e) || Object])
    ], DetailComponent);
    return DetailComponent;
    var _a, _b, _c, _d, _e;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/detail.component.js.map

/***/ },

/***/ 426:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__db_service__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(89);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return HomeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HomeComponent = (function () {
    function HomeComponent(db, router) {
        this.db = db;
        this.router = router;
    }
    HomeComponent.prototype.addNote = function () {
        var vm = this;
        vm.db.addNote()
            .then(function (note) {
            vm.router.navigate(['/note', note.id]);
        });
    };
    HomeComponent.prototype.ngOnInit = function () {
    };
    HomeComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-home',
            template: __webpack_require__(827),
            styles: [__webpack_require__(822)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__db_service__["a" /* DbService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__db_service__["a" /* DbService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === 'function' && _b) || Object])
    ], HomeComponent);
    return HomeComponent;
    var _a, _b;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/home.component.js.map

/***/ },

/***/ 427:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_material__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__db_service__ = __webpack_require__(119);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ProductAddDialogComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ProductAddDialogComponent = (function () {
    function ProductAddDialogComponent(dialogRef, db) {
        this.dialogRef = dialogRef;
        this.db = db;
        this.newDb = {
            name: ''
        };
    }
    ProductAddDialogComponent.prototype.ngOnInit = function () {
    };
    ProductAddDialogComponent.prototype.onSubmit = function () {
        this.db.createDB(this.newDb.name);
        this.dialogRef.close(this.newDb.name);
    };
    ProductAddDialogComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-product-add-dialog',
            template: __webpack_require__(829),
            styles: [__webpack_require__(824)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_material__["MdDialogRef"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_material__["MdDialogRef"]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__db_service__["a" /* DbService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__db_service__["a" /* DbService */]) === 'function' && _b) || Object])
    ], ProductAddDialogComponent);
    return ProductAddDialogComponent;
    var _a, _b;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/product-add-dialog.component.js.map

/***/ },

/***/ 487:
/***/ function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 487;


/***/ },

/***/ 488:
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(656);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(617);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(655);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_module__ = __webpack_require__(648);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["enableProdMode"])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/main.js.map

/***/ },

/***/ 646:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(89);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppRoutingModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var routes = [
    {
        path: '',
        children: []
    }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* RouterModule */].forRoot(routes)],
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* RouterModule */]],
            providers: []
        }), 
        __metadata('design:paramtypes', [])
    ], AppRoutingModule);
    return AppRoutingModule;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/app-routing.module.js.map

/***/ },

/***/ 647:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_material__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__product_add_dialog_product_add_dialog_component__ = __webpack_require__(427);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = (function () {
    function AppComponent(dialog) {
        this.dialog = dialog;
        this.projects = [];
        this.selectedProject = 'Default';
    }
    AppComponent.prototype.onNotify = function (projects) {
        this.projects = projects;
    };
    AppComponent.prototype.newProject = function () {
        var dialogRef = this.dialog.open(__WEBPACK_IMPORTED_MODULE_2__product_add_dialog_product_add_dialog_component__["a" /* ProductAddDialogComponent */]);
        dialogRef.afterClosed().subscribe(function (result) {
            console.log(result);
        });
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(825),
            styles: [__webpack_require__(820)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_material__["MdDialog"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_material__["MdDialog"]) === 'function' && _a) || Object])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/app.component.js.map

/***/ },

/***/ 648:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(647);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_material__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_hammerjs__ = __webpack_require__(812);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_hammerjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__db_service__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_common__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__safe_html_pipe__ = __webpack_require__(654);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__app_routing_module__ = __webpack_require__(646);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__detail_detail_module__ = __webpack_require__(650);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__list_list_component__ = __webpack_require__(653);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__home_home_module__ = __webpack_require__(652);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__product_add_dialog_product_add_dialog_component__ = __webpack_require__(427);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
                // LayoutComponent,
                __WEBPACK_IMPORTED_MODULE_9__safe_html_pipe__["a" /* SafeHtmlPipe */],
                __WEBPACK_IMPORTED_MODULE_12__list_list_component__["a" /* ListComponent */],
                __WEBPACK_IMPORTED_MODULE_14__product_add_dialog_product_add_dialog_component__["a" /* ProductAddDialogComponent */]
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_14__product_add_dialog_product_add_dialog_component__["a" /* ProductAddDialogComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["MaterialModule"].forRoot(),
                __WEBPACK_IMPORTED_MODULE_8__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_11__detail_detail_module__["a" /* DetailModule */],
                __WEBPACK_IMPORTED_MODULE_13__home_home_module__["a" /* HomeModule */],
                __WEBPACK_IMPORTED_MODULE_10__app_routing_module__["a" /* AppRoutingModule */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__db_service__["a" /* DbService */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/app.module.js.map

/***/ },

/***/ 649:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__detail_component__ = __webpack_require__(425);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return DetailRoutingModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var routes = [
    { path: 'note/:id', component: __WEBPACK_IMPORTED_MODULE_2__detail_component__["a" /* DetailComponent */] }
];
var DetailRoutingModule = (function () {
    function DetailRoutingModule() {
    }
    DetailRoutingModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* RouterModule */].forChild(routes)],
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* RouterModule */]],
            providers: []
        }), 
        __metadata('design:paramtypes', [])
    ], DetailRoutingModule);
    return DetailRoutingModule;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/detail-routing.module.js.map

/***/ },

/***/ 650:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__detail_routing_module__ = __webpack_require__(649);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__detail_component__ = __webpack_require__(425);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_material__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng2_file_upload__ = __webpack_require__(471);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng2_file_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_ng2_file_upload__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return DetailModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var DetailModule = (function () {
    function DetailModule() {
    }
    DetailModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_4__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2__detail_routing_module__["a" /* DetailRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["MaterialModule"].forRoot()
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__detail_component__["a" /* DetailComponent */],
                __WEBPACK_IMPORTED_MODULE_6_ng2_file_upload__["FileSelectDirective"],
                __WEBPACK_IMPORTED_MODULE_6_ng2_file_upload__["FileDropDirective"]
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], DetailModule);
    return DetailModule;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/detail.module.js.map

/***/ },

/***/ 651:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_component__ = __webpack_require__(426);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return HomeRoutingModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var routes = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_2__home_component__["a" /* HomeComponent */] }
];
var HomeRoutingModule = (function () {
    function HomeRoutingModule() {
    }
    HomeRoutingModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* RouterModule */].forChild(routes)],
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* RouterModule */]],
            providers: []
        }), 
        __metadata('design:paramtypes', [])
    ], HomeRoutingModule);
    return HomeRoutingModule;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/home-routing.module.js.map

/***/ },

/***/ 652:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_routing_module__ = __webpack_require__(651);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_component__ = __webpack_require__(426);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return HomeModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var HomeModule = (function () {
    function HomeModule() {
    }
    HomeModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
                __WEBPACK_IMPORTED_MODULE_2__home_routing_module__["a" /* HomeRoutingModule */]
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_3__home_component__["a" /* HomeComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], HomeModule);
    return HomeModule;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/home.module.js.map

/***/ },

/***/ 653:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__db_service__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(89);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ListComponent = (function () {
    function ListComponent(db, router) {
        this.db = db;
        this.router = router;
        this.projects = [];
        this.notify = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.getNotes();
    }
    ListComponent.prototype.addNote = function () {
        var vm = this;
        vm.db.addNote()
            .then(function (note) {
            vm.router.navigate(['/note', note.id]);
        });
    };
    ListComponent.prototype.getNotes = function () {
        var _this = this;
        this.db.getDocuments()
            .then(function (notes) { return _this.notes = notes; });
        //noinspection TypeScriptUnresolvedFunction
        // window.indexedDB.webkitGetDatabaseNames().onsuccess = (e) => {
        //   for(let i = 0; i < e.target.result.length; i++){
        //     let db = e.target.result[i];
        //     if(db.startsWith('_pouch_')){
        //        indexedDB.deleteDatabase(db);
        //       console.log(db);
        //       this.projects.push(db);
        //     }
        //   }
        //   this.notify.emit(this.projects);
        // };
    };
    ListComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]) === 'function' && _a) || Object)
    ], ListComponent.prototype, "notify", void 0);
    ListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-list',
            template: __webpack_require__(828),
            styles: [__webpack_require__(823)]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__db_service__["a" /* DbService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__db_service__["a" /* DbService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === 'function' && _c) || Object])
    ], ListComponent);
    return ListComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/list.component.js.map

/***/ },

/***/ 654:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return SafeHtmlPipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SafeHtmlPipe = (function () {
    function SafeHtmlPipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SafeHtmlPipe.prototype.transform = function (style) {
        return this.sanitizer.sanitize(__WEBPACK_IMPORTED_MODULE_0__angular_core__["SecurityContext"].HTML, style);
    };
    SafeHtmlPipe = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
            name: 'safeHtml'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["Sanitizer"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["Sanitizer"]) === 'function' && _a) || Object])
    ], SafeHtmlPipe);
    return SafeHtmlPipe;
    var _a;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/safe-html.pipe.js.map

/***/ },

/***/ 655:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/environment.js.map

/***/ },

/***/ 656:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(671);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(664);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(666);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(665);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(663);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(662);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(670);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(659);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(658);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(668);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(661);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(669);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(667);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(672);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(872);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/polyfills.js.map

/***/ },

/***/ 820:
/***/ function(module, exports) {

module.exports = ".spacer {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n\n.github-link {\n  color: white;\n}\n\nmd-sidenav {\n  width: 180px;\n}\n\n.content {\n  height: calc(100vh - 75px);\n}\n\n.brand a {\n  text-decoration: none;\n  color: inherit;\n  margin-left: 5px;\n}\n"

/***/ },

/***/ 821:
/***/ function(module, exports) {

module.exports = ".example-h2 {\n  margin: 10px;\n}\n\n.example-section {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  height: 60px;\n}\n\n.example-margin {\n  margin: 0 10px;\n}\n\n.example-full-width {\n  width: 100%;\n}\n\nmd-card {\n  margin: 10px;\n}\n\ntextarea {\n  resize: none;\n  height: calc(100vh - 220px);\n}\n\n.delete-btn {\n  position: fixed;\n  right: 20px;\n}\n\nul.files {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  /* Below sets up your display method: flex-start|flex-end|space-between|space-around */\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  /* Below removes bullets and cleans white-space */\n  list-style: none;\n  padding: 0;\n  /* Bonus: forces no word-wrap */\n  white-space: nowrap;\n}\n\nul.files li + li:before {\n  content: ', ';\n}\n"

/***/ },

/***/ 822:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 823:
/***/ function(module, exports) {

module.exports = "md-list-item {\n  text-decoration: none;\n  color: black;\n  cursor: pointer;\n}\n\nmd-list-item.active {\n  background-color: gray;\n}\n\n.add-fab {\n  position: absolute;\n  top: auto;\n  left: auto;\n  right: 20px;\n  bottom: 20px;\n}\n"

/***/ },

/***/ 824:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 825:
/***/ function(module, exports) {

module.exports = "<md-toolbar color=\"primary\">\n  <md-icon (click)=\"sidenav.toggle()\">list</md-icon>\n  <span class=\"brand\"><a routerLink=\"\">Secure Notes</a></span>\n  <span class=\"spacer\"></span>\n  <button md-button [mdMenuTriggerFor]=\"menu\">Menu</button>\n  <md-menu #menu=\"mdMenu\">\n    <button md-menu-item>Default</button>\n    <button md-menu-item (click)=\"newProject()\">Create new project</button>\n  </md-menu>\n  <!--<md-select placeholder=\"Select Project\" [(ngModel)]=\"selectedProject\" name=\"project\">-->\n    <!--<md-option *ngFor=\"let project of projects\" [value]=\"project\">-->\n      <!--{{project}}-->\n    <!--</md-option>-->\n  <!--</md-select>-->\n  <a href=\"https://github.com/rosinghal/secure-note\" class=\"github-link\"><md-icon>cloud_download</md-icon></a>\n</md-toolbar>\n\n<md-sidenav-container>\n  <md-sidenav #sidenav mode=\"side\" opened=\"true\">\n    <app-list (notify)=\"onNotify($event)\"></app-list>\n  </md-sidenav>\n\n  <div class=\"content\">\n    <router-outlet></router-outlet>\n  </div>\n</md-sidenav-container>\n\n<!--<md-toolbar>-->\n  <!--&copy; Secure Note-->\n<!--</md-toolbar>-->\n"

/***/ },

/***/ 826:
/***/ function(module, exports) {

module.exports = "<md-progress-bar mode=\"indeterminate\" *ngIf=\"loading\"></md-progress-bar>\n\n<md-card\n  ng2FileSelect\n  ng2FileDrop\n  (fileOver)=\"fileOver($event)\"\n  [uploader]=\"uploader\"\n>\n  <md-card-content>\n    <md-input-container class=\"example-full-width\">\n      <textarea\n        md-input\n        required\n        (input)=\"content$.next($event.target.value)\"\n        [(ngModel)]=\"doc.content\"\n        name=\"content\"\n        placeholder=\"Content\"\n        #content=\"ngModel\"\n      ></textarea>\n    </md-input-container>\n  </md-card-content>\n  <!--<button class=\"delete-btn\" type=\"button\" md-mini-fab mdTooltip=\"Delete?\" (click)=\"deleteNote()\">-->\n    <!--<md-icon>delete</md-icon>-->\n  <!--</button>-->\n  <div *ngIf=\"attachments.length\">\n    <ul class=\"files\">\n      <li *ngFor=\"let attachment of attachments\">\n        <a [href]=\"attachment.url\" target=\"_blank\">\n          {{attachment.name}}\n        </a>\n      </li>\n    </ul>\n  </div>\n</md-card>\n"

/***/ },

/***/ 827:
/***/ function(module, exports) {

module.exports = "<button\n  type=\"button\"\n  md-button\n  (click)=\"addNote()\"\n>New Note</button>\n"

/***/ },

/***/ 828:
/***/ function(module, exports) {

module.exports = "<md-list>\n  <md-list-item *ngFor=\"let note of notes\" [routerLink]=\"['/note', note._id]\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\">\n    <span md-line>{{note.content ? note.content.split('\\n')[0] : note._id}}</span>\n  </md-list-item>\n  <md-list-item *ngIf=\"!notes?.length\">\n    No notes found.\n  </md-list-item>\n</md-list>\n\n<button md-mini-fab class=\"add-fab\" (click)=\"addNote()\">\n  <md-icon>add</md-icon>\n</button>\n"

/***/ },

/***/ 829:
/***/ function(module, exports) {

module.exports = "<form (ngSubmit)=\"onSubmit()\" #projectForm=\"ngForm\">\n  <md-input-container>\n    <input\n      required\n      md-input\n      [(ngModel)]=\"newDb.name\"\n      name=\"name\"\n      placeholder=\"Project Name\"\n      #name=\"ngModel\"\n    >\n  </md-input-container>\n  <button type=\"submit\" md-raised-button>Add</button>\n</form>\n"

/***/ },

/***/ 873:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(488);


/***/ }

},[873]);
//# sourceMappingURL=main.bundle.map