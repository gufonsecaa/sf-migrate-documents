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
exports.uploadContentVersion = exports.fetchSalesforceContentVersion = exports.fetchSalesforceAttachment = exports.getOriginContentDocumentLinkRecords = exports.getOriginAttachmentRecords = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var request_1 = __importDefault(require("request"));
function getOriginAttachmentRecords(orgInstance, originParentId) {
    return __awaiter(this, void 0, void 0, function () {
        var query, queryResult, attachmentsRecords, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "\n    SELECT Id, Name, ParentId, Body, ContentType\n    FROM Attachment\n    WHERE ParentId = '" + originParentId + "'\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, orgInstance.query(query)];
                case 2:
                    queryResult = _a.sent();
                    attachmentsRecords = queryResult.records.map(function (_a) {
                        var Id = _a.Id, Name = _a.Name, ParentId = _a.ParentId, Body = _a.Body;
                        return ({ Id: Id, Name: Name, ParentId: ParentId, Body: Body });
                    });
                    return [2 /*return*/, attachmentsRecords];
                case 3:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getOriginAttachmentRecords = getOriginAttachmentRecords;
function getOriginContentDocumentLinkRecords(orgInstance, originParentId) {
    return __awaiter(this, void 0, void 0, function () {
        var query, queryResult, contentVersions, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "\n  SELECT\n    Id,\n    ContentDocument.LatestPublishedVersion.Id,\n    ContentDocument.LatestPublishedVersion.PathOnClient,\n    ContentDocument.LatestPublishedVersion.VersionData,\n    ContentDocument.LatestPublishedVersion.Title,\n    ContentDocument.LatestPublishedVersion.FileExtension\n  FROM ContentDocumentLink\n  WHERE LinkedEntityId = '" + originParentId + "'\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, orgInstance.query(query)];
                case 2:
                    queryResult = _a.sent();
                    if (queryResult.records.length == 0) {
                        console.log('Nenhum documento encontrado para o Id origem:', originParentId);
                    }
                    contentVersions = queryResult.records.map(function (record) {
                        var fileName = record.ContentDocument.LatestPublishedVersion.PathOnClient;
                        return {
                            Id: record.ContentDocument.LatestPublishedVersion.Id,
                            Title: fileName,
                            PathOnClient: fileName,
                            FileExtension: record.ContentDocument.LatestPublishedVersion.FileExtension,
                            VersionData: record.ContentDocument.LatestPublishedVersion.VersionData
                        };
                    });
                    return [2 /*return*/, contentVersions];
                case 3:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getOriginContentDocumentLinkRecords = getOriginContentDocumentLinkRecords;
function fetchSalesforceAttachment(orgInstance, attachment, attachmentsPath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var fileOut = fs_1.default.createWriteStream(path_1.default.resolve(attachmentsPath, attachment.Name));
                    orgInstance
                        .sobject('Attachment')
                        .record(attachment.Id)
                        .blob('Body')
                        .pipe(fileOut)
                        .on('open', function (err, result) {
                        // console.log('Download started => ', attachment.Name)
                    })
                        .on('finish', function (err, result) {
                        if (err) {
                            reject(err);
                            console.log('not downloaded => ', attachment.Name);
                        }
                        else {
                            resolve(attachment);
                        }
                    });
                })];
        });
    });
}
exports.fetchSalesforceAttachment = fetchSalesforceAttachment;
function fetchSalesforceContentVersion(orgInstance, documentVersion, documentsPath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var fileOut = fs_1.default.createWriteStream(path_1.default.resolve(documentsPath, documentVersion.PathOnClient));
                    orgInstance
                        .sobject('ContentVersion')
                        .record(documentVersion.Id)
                        .blob('VersionData')
                        .pipe(fileOut)
                        .on('open', function (err, result) {
                        // console.log('Download started => ', attachment.Name)
                    })
                        .on('finish', function (err, result) {
                        if (err) {
                            reject(err);
                            console.log('not downloaded => ', documentVersion.Title);
                        }
                        else {
                            resolve(documentVersion);
                        }
                    });
                })];
        });
    });
}
exports.fetchSalesforceContentVersion = fetchSalesforceContentVersion;
var uploadContentVersion = function (orgInstance, metadata, file) {
    return new Promise(function (resolve, reject) {
        request_1.default.post({
            url: orgInstance.instanceUrl + '/services/data/v49.0/sobjects/ContentVersion',
            auth: {
                bearer: orgInstance.accessToken
            },
            formData: {
                entity_content: {
                    value: JSON.stringify(metadata),
                    options: {
                        contentType: 'application/json'
                    }
                },
                VersionData: {
                    value: file,
                    options: {
                        filename: metadata.PathOnClient,
                        contentType: 'application/octet-stream'
                    }
                }
            }
        }, function (err, response) {
            if (err)
                reject(err);
            resolve(JSON.parse(response.body));
        });
    });
};
exports.uploadContentVersion = uploadContentVersion;
