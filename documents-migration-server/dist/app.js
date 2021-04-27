"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var path_1 = __importDefault(require("path"));
var salesforce_connections_1 = require("./config/salesforce-connections");
var Directory_1 = require("./modules/Directory");
var JSForceProvider_1 = require("./modules/JSForceProvider");
var CSV_1 = require("./modules/CSV");
var Logs_1 = require("./modules/Logs");
var SalesforceRepository_1 = require("./modules/SalesforceRepository");
var Download_1 = require("./engine/Download");
var Upload_1 = require("./engine/Upload");
var App = /** @class */ (function () {
    function App() {
        this.importPath = path_1.default.resolve(__dirname, '..', '..', 'import');
        this.tempPath = path_1.default.resolve(__dirname, '..', 'temp');
        this.originOrgInstance = null;
        this.targetOrgInstance = null;
        this.mappingList = null;
        this.logFileName = Date.now() + '-log-completo.txt';
    }
    App.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        Directory_1.refreshDirectory(this.tempPath);
                        _a = this;
                        return [4 /*yield*/, CSV_1.getMappingList(path_1.default.resolve(this.importPath, 'mapping.csv'))];
                    case 1:
                        _a.mappingList = _d.sent();
                        _b = this;
                        return [4 /*yield*/, JSForceProvider_1.jsForceConnection.createInstance(salesforce_connections_1.origin)];
                    case 2:
                        _b.originOrgInstance = _d.sent();
                        _c = this;
                        return [4 /*yield*/, JSForceProvider_1.jsForceConnection.createInstance(salesforce_connections_1.target)];
                    case 3:
                        _c.targetOrgInstance = _d.sent();
                        return [4 /*yield*/, this.startProcess()];
                    case 4:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.getNextMappingRecord = function () {
        return this.mappingList.findIndex(function (item) { return !item.finished; });
    };
    App.prototype.updateMappingRecord = function (index, data) {
        Object.assign(this.mappingList[index], data);
    };
    App.prototype.startProcess = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mappingIndex, _a, OriginParentId, TargetParentId, msgLinhas, attachments, attachmentsPath, downloadEngine;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mappingIndex = this.getNextMappingRecord();
                        if (mappingIndex === -1) {
                            return [2 /*return*/, this.finishProcess()];
                        }
                        _a = this.mappingList[mappingIndex], OriginParentId = _a.OriginParentId, TargetParentId = _a.TargetParentId;
                        console.log('');
                        console.log('');
                        console.log('==============================================');
                        msgLinhas = "Process (Linha " + (mappingIndex + 1) + " de " + this.mappingList.length + ") ==> ";
                        console.log(msgLinhas, OriginParentId, 'x', TargetParentId);
                        Directory_1.createTempParentDirectory(this.tempPath, OriginParentId);
                        return [4 /*yield*/, SalesforceRepository_1.getOriginAttachmentRecords(this.originOrgInstance, OriginParentId)];
                    case 1:
                        attachments = _b.sent();
                        if (attachments.length === 0) {
                            Directory_1.deleteTempParentDirectory(this.tempPath, OriginParentId);
                            this.updateMappingRecord(mappingIndex, { finished: true });
                            this.startProcess();
                            return [2 /*return*/];
                        }
                        attachmentsPath = path_1.default.resolve(this.tempPath, OriginParentId, 'downloads', 'attachments');
                        console.log('');
                        console.log('==> STARTING DOWNLOAD');
                        downloadEngine = new Download_1.Download(attachments, attachmentsPath, this.originOrgInstance);
                        downloadEngine.subscribe(function (downloadState) {
                            console.log('');
                            console.log('==> STARTING UPLOAD');
                            var uploadEngine = new Upload_1.Upload(attachmentsPath, _this.targetOrgInstance, TargetParentId);
                            uploadEngine.subscribe(function (uploadState) {
                                Logs_1.writeLogForProcessItem(path_1.default.resolve(_this.tempPath, OriginParentId, 'logs'), {
                                    originParentId: OriginParentId,
                                    targetParentId: TargetParentId,
                                    download: downloadState,
                                    upload: uploadState
                                });
                                Logs_1.writeLogForMainProcess(path_1.default.resolve(__dirname, '..', '..', 'exports', _this.logFileName), {
                                    mappingRecord: _this.mappingList[mappingIndex],
                                    download: downloadState,
                                    upload: uploadState
                                });
                                Directory_1.deleteTempParentDirectory(_this.tempPath, OriginParentId);
                                _this.updateMappingRecord(mappingIndex, { finished: true });
                                _this.startProcess();
                            });
                            uploadEngine.start();
                        });
                        downloadEngine.start();
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.finishProcess = function () {
        console.log('');
        console.log('==============================================');
        console.log('Process completed!');
    };
    return App;
}());
exports.App = App;
