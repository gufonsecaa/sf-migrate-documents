"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Download = void 0;
var SalesforceRepository_1 = require("../modules/SalesforceRepository");
var Download = /** @class */ (function () {
    function Download(recordFiles, localAttachmentsURL, orgInstance) {
        this.files = [];
        this.fileErrors = [];
        this.totalFiles = null;
        this.totalSuccess = null;
        this.totalErrors = null;
        this.orgInstance = null;
        this.localAttachmentsURL = null;
        this.observers = null;
        this.files = recordFiles;
        this.fileErrors = [];
        this.totalFiles = recordFiles.length;
        this.totalSuccess = 0;
        this.totalErrors = 0;
        this.localAttachmentsURL = localAttachmentsURL;
        this.orgInstance = orgInstance;
        this.observers = [];
    }
    Download.prototype.start = function () {
        var _this = this;
        this.files.forEach(function (file) {
            SalesforceRepository_1.fetchSalesforceAttachment(_this.orgInstance, file, _this.localAttachmentsURL)
                .then(function (res) {
                _this.completed();
            })
                .catch(function (err) {
                _this.error(file);
            });
        });
    };
    Download.prototype.error = function (file) {
        this.totalErrors++;
        this.fileErrors.push(file);
        console.log(this.totalErrors + this.totalSuccess + " de " + this.totalFiles + " | erros: " + this.totalErrors);
        if ((this.totalSuccess + this.totalErrors) === this.totalFiles) {
            this.notifyObservers();
        }
    };
    Download.prototype.completed = function () {
        this.totalSuccess++;
        console.log(this.totalErrors + this.totalSuccess + " de " + this.totalFiles + " | erros: " + this.totalErrors);
        if ((this.totalSuccess + this.totalErrors) === this.totalFiles) {
            this.notifyObservers();
        }
    };
    Download.prototype.subscribe = function (observer) {
        this.observers.push(observer);
    };
    Download.prototype.notifyObservers = function () {
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer({
                totalFiles: this.totalFiles,
                totalSuccess: this.totalSuccess,
                totalErrors: this.totalErrors,
            });
        }
    };
    return Download;
}());
exports.Download = Download;
