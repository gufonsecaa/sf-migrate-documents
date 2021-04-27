"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadContentVersion = void 0;
var SalesforceRepository_1 = require("../modules/SalesforceRepository");
var DownloadContentVersion = /** @class */ (function () {
    function DownloadContentVersion(recordFiles, localContentVersionURL, orgInstance) {
        this.files = [];
        this.fileErrors = [];
        this.totalFiles = null;
        this.totalSuccess = null;
        this.totalErrors = null;
        this.orgInstance = null;
        this.localContentVersionURL = null;
        this.observers = null;
        this.files = recordFiles;
        this.fileErrors = [];
        this.totalFiles = recordFiles.length;
        this.totalSuccess = 0;
        this.totalErrors = 0;
        this.localContentVersionURL = localContentVersionURL;
        this.orgInstance = orgInstance;
        this.observers = [];
    }
    DownloadContentVersion.prototype.start = function () {
        var _this = this;
        this.files.forEach(function (file) {
            SalesforceRepository_1.fetchSalesforceContentVersion(_this.orgInstance, file, _this.localContentVersionURL)
                .then(function (res) {
                _this.completed();
            })
                .catch(function (err) {
                _this.error(file);
            });
        });
    };
    DownloadContentVersion.prototype.error = function (file) {
        this.totalErrors++;
        this.fileErrors.push(file);
        console.log(this.totalErrors + this.totalSuccess + " de " + this.totalFiles + " | erros: " + this.totalErrors);
        if ((this.totalSuccess + this.totalErrors) === this.totalFiles) {
            this.notifyObservers();
        }
    };
    DownloadContentVersion.prototype.completed = function () {
        this.totalSuccess++;
        console.log(this.totalErrors + this.totalSuccess + " de " + this.totalFiles + " | erros: " + this.totalErrors);
        if ((this.totalSuccess + this.totalErrors) === this.totalFiles) {
            this.notifyObservers();
        }
    };
    DownloadContentVersion.prototype.subscribe = function (observer) {
        this.observers.push(observer);
    };
    DownloadContentVersion.prototype.notifyObservers = function () {
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer({
                totalFiles: this.totalFiles,
                totalSuccess: this.totalSuccess,
                totalErrors: this.totalErrors,
            });
        }
    };
    return DownloadContentVersion;
}());
exports.DownloadContentVersion = DownloadContentVersion;
