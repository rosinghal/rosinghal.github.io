webpackJsonp([0,3],{

/***/ 256:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
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

var PouchDB = __webpack_require__(806);
var DbService = (function () {
    function DbService(zone) {
        this.zone = zone;
        this.db = new PouchDB('test');
        // this.username = 'DATABASE_KEY';
        // this.password = 'YOUR_PASSWORD';
        //
        // this.remote = 'https://YOU_ACCOUNT_NAME.cloudant.com/YOUR_DATABASE';
        //
        // let options = {
        //   live: true,
        //   retry: true,
        //   continuous: true,
        //   auth: {
        //     username: this.username,
        //     password: this.password
        //   }
        // };
        //
        // this.db.sync(this.remote, options);
    }
    DbService.prototype.addDoc = function (subject, body, _rev, _id) {
        if (_rev && _id) {
            return this.db.put({
                _id: _id,
                _rev: _rev,
                subject: subject,
                body: body
            });
        }
        else {
            return this.db.post({
                subject: subject,
                body: body
            });
        }
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
                var docs = result.rows.map(function (row) {
                    _this.data.push(row.doc);
                    resolve(_this.data);
                });
                if (result.rows.length === 0) {
                    resolve(_this.data);
                }
                _this.db.changes({
                    live: true,
                    since: 'now',
                    include_docs: true
                }).on('change', function (change) {
                    _this.handleChange(change);
                });
            }).catch(function (error) {
                console.log(error);
            });
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* NgZone */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* NgZone */]) === 'function' && _a) || Object])
    ], DbService);
    return DbService;
    var _a;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/db.service.js.map

/***/ },

/***/ 424:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__db_service__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap__ = __webpack_require__(823);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_material__ = __webpack_require__(238);
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
    function DetailComponent(db, router, route, snackBar) {
        this.db = db;
        this.router = router;
        this.route = route;
        this.snackBar = snackBar;
        this.form = {
            subject: null,
            body: null
        };
    }
    DetailComponent.prototype.addNote = function () {
        var vm = this;
        this.loading = true;
        vm.db.addDoc(vm.form.subject, vm.form.body, vm.form._rev, vm.form._id)
            .then(function (note) {
            vm.loading = false;
            if (vm.form._rev) {
                vm.snackBar.open('Note updated', 'Ok', {
                    duration: 2000
                });
                vm.form._id = note.id;
                vm.form._rev = note.rev;
            }
            else {
                vm.snackBar.open('Note created', 'Ok', {
                    duration: 2000
                });
                vm.router.navigate(['/note', note.id]);
            }
        });
    };
    DetailComponent.prototype.deleteNote = function () {
        var vm = this;
        if (vm.form._id && vm.form._rev) {
            vm.db.deleteDoc(vm.form._id, vm.form._rev)
                .then(function () {
                vm.snackBar.open('Note deleted', 'Ok', {
                    duration: 2000
                });
                vm.router.navigate(['']);
            });
        }
    };
    DetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (data) { return _this.noteId = data['id']; });
        if (this.noteId) {
            this.loading = true;
            this.route.params
                .switchMap(function (params) { return _this.db.getDoc(params['id']); })
                .subscribe(function (note) {
                _this.loading = false;
                _this.form = note;
            }, function (error) {
                _this.snackBar.open('Note : ' + error.message, 'Ok', {
                    duration: 2000
                });
                _this.router.navigate(['']);
            });
        }
    };
    DetailComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_2" /* Component */])({
            selector: 'app-detail',
            template: __webpack_require__(811),
            styles: [__webpack_require__(808)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__db_service__["a" /* DbService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__db_service__["a" /* DbService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* ActivatedRoute */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__angular_material__["MdSnackBar"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__angular_material__["MdSnackBar"]) === 'function' && _d) || Object])
    ], DetailComponent);
    return DetailComponent;
    var _a, _b, _c, _d;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/detail.component.js.map

/***/ },

/***/ 479:
/***/ function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 479;


/***/ },

/***/ 480:
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(646);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(609);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(645);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_module__ = __webpack_require__(640);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/main.js.map

/***/ },

/***/ 638:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(252);
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
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

/***/ 639:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
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
    function AppComponent() {
        this.title = 'app works!';
    }
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_2" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(810),
            styles: [__webpack_require__(807)]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/app.component.js.map

/***/ },

/***/ 640:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(639);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_material__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_hammerjs__ = __webpack_require__(802);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_hammerjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__db_service__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_common__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__safe_html_pipe__ = __webpack_require__(644);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__app_routing_module__ = __webpack_require__(638);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__detail_detail_module__ = __webpack_require__(642);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__list_list_component__ = __webpack_require__(643);
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
                // LayoutComponent,
                __WEBPACK_IMPORTED_MODULE_9__safe_html_pipe__["a" /* SafeHtmlPipe */],
                __WEBPACK_IMPORTED_MODULE_12__list_list_component__["a" /* ListComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["MaterialModule"].forRoot(),
                __WEBPACK_IMPORTED_MODULE_8__angular_common__["a" /* CommonModule */],
                __WEBPACK_IMPORTED_MODULE_11__detail_detail_module__["a" /* DetailModule */],
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

/***/ 641:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__detail_component__ = __webpack_require__(424);
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
    { path: '', component: __WEBPACK_IMPORTED_MODULE_2__detail_component__["a" /* DetailComponent */] },
    { path: 'note/:id', component: __WEBPACK_IMPORTED_MODULE_2__detail_component__["a" /* DetailComponent */] }
];
var DetailRoutingModule = (function () {
    function DetailRoutingModule() {
    }
    DetailRoutingModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
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

/***/ 642:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__detail_routing_module__ = __webpack_require__(641);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__detail_component__ = __webpack_require__(424);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_material__ = __webpack_require__(238);
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["a" /* CommonModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2__detail_routing_module__["a" /* DetailRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["MaterialModule"].forRoot()
            ],
            declarations: [__WEBPACK_IMPORTED_MODULE_3__detail_component__["a" /* DetailComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], DetailModule);
    return DetailModule;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/detail.module.js.map

/***/ },

/***/ 643:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__db_service__ = __webpack_require__(256);
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
    function ListComponent(db) {
        this.db = db;
        this.getNotes();
    }
    ListComponent.prototype.getNotes = function () {
        var _this = this;
        this.db.getDocuments()
            .then(function (notes) {
            _this.notes = notes;
        });
    };
    ListComponent.prototype.ngOnInit = function () {
    };
    ListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_2" /* Component */])({
            selector: 'app-list',
            template: __webpack_require__(812),
            styles: [__webpack_require__(809)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__db_service__["a" /* DbService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__db_service__["a" /* DbService */]) === 'function' && _a) || Object])
    ], ListComponent);
    return ListComponent;
    var _a;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/list.component.js.map

/***/ },

/***/ 644:
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
        return this.sanitizer.sanitize(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* SecurityContext */].HTML, style);
    };
    SafeHtmlPipe = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["H" /* Pipe */])({
            name: 'safeHtml'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* Sanitizer */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* Sanitizer */]) === 'function' && _a) || Object])
    ], SafeHtmlPipe);
    return SafeHtmlPipe;
    var _a;
}());
//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/safe-html.pipe.js.map

/***/ },

/***/ 645:
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

/***/ 646:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(661);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(654);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(650);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(656);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(655);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(653);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(652);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(649);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(648);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(658);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(651);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(659);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(657);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(662);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(847);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=/Users/rosinghal/Documents/www/comp/secure-note/src/polyfills.js.map

/***/ },

/***/ 807:
/***/ function(module, exports) {

module.exports = ".spacer {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n\n.github-link {\n  color: white;\n}\n\nmd-sidenav {\n  width: 180px;\n}\n\n.content {\n  min-height: 300px;\n}\n"

/***/ },

/***/ 808:
/***/ function(module, exports) {

module.exports = ".example-h2 {\n  margin: 10px;\n}\n\n.example-section {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  height: 60px;\n}\n\n.example-margin {\n  margin: 0 10px;\n}\n\n.example-fab {\n  position: absolute;\n  right: 20px;\n  bottom: 10px;\n}\n\n.example-full-width {\n  width: 100%;\n}\n\nmd-card {\n  margin: 10px;\n}\n\ntextarea {\n  resize:vertical;\n}\n\n.example-spacer {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n"

/***/ },

/***/ 809:
/***/ function(module, exports) {

module.exports = "md-list-item {\n  text-decoration: none;\n  color: black;\n  cursor: pointer;\n}\n\nmd-list-item.active {\n  background-color: gray;\n}\n"

/***/ },

/***/ 810:
/***/ function(module, exports) {

module.exports = "<md-toolbar color=\"primary\">\n  <md-icon (click)=\"sidenav.toggle()\">list</md-icon>\n  <span>Secure Note</span>\n  <span class=\"spacer\"></span>\n  <a href=\"https://github.com/rosinghal/secure-note\" class=\"github-link\"><md-icon>cloud_download</md-icon></a>\n</md-toolbar>\n\n<md-sidenav-container>\n  <md-sidenav #sidenav mode=\"side\" opened=\"true\">\n    <app-list></app-list>\n  </md-sidenav>\n\n  <div class=\"content\">\n    <router-outlet></router-outlet>\n  </div>\n</md-sidenav-container>\n\n<md-toolbar>\n  &copy; Secure Note\n</md-toolbar>\n"

/***/ },

/***/ 811:
/***/ function(module, exports) {

module.exports = "<md-progress-bar mode=\"indeterminate\" *ngIf=\"loading\"></md-progress-bar>\n\n<form (submit)=\"addNote()\" #heroForm=\"ngForm\">\n  <md-card>\n    <md-card-content>\n      <md-input-container class=\"example-full-width\">\n        <input md-input required [(ngModel)]=\"form.subject\" name=\"subject\" placeholder=\"Subject\"\n               #subject=\"ngModel\">\n      </md-input-container>\n      <md-input-container class=\"example-full-width\">\n        <textarea md-input required [(ngModel)]=\"form.body\" name=\"body\" placeholder=\"Body\"\n                  #body=\"ngModel\"></textarea>\n      </md-input-container>\n    </md-card-content>\n    <md-card-actions>\n      <button type=\"submit\" md-raised-button>Submit</button>\n      <span class=\"example-spacer\"></span>\n      <button type=\"button\" md-raised-button mdTooltip=\"Delete this note?\" (click)=\"deleteNote()\" *ngIf=\"form._id && form._rev\">\n        <md-icon>delete</md-icon>\n      </button>\n    </md-card-actions>\n  </md-card>\n</form>\n\n<button md-mini-fab class=\"example-fab\" routerLink=\"\">\n  <md-icon>add</md-icon>\n</button>\n"

/***/ },

/***/ 812:
/***/ function(module, exports) {

module.exports = "<md-list>\n  <md-list-item *ngFor=\"let note of notes\" [routerLink]=\"['/note', note._id]\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\">{{note.subject}}</md-list-item>\n  <md-list-item *ngIf=\"!notes?.length\">\n    No notes found.\n  </md-list-item>\n</md-list>\n"

/***/ },

/***/ 848:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(480);


/***/ }

},[848]);
//# sourceMappingURL=main.bundle.map