"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTempParentDirectory = exports.createTempParentDirectory = exports.refreshDirectory = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function refreshDirectory(tempPath) {
    if (fs_1.default.existsSync(tempPath)) {
        fs_1.default.rmdirSync(tempPath, { recursive: true });
    }
    fs_1.default.mkdirSync(tempPath);
}
exports.refreshDirectory = refreshDirectory;
function createTempParentDirectory(tempPath, parentId) {
    var parentDir = path_1.default.resolve(tempPath, parentId);
    var logsDir = path_1.default.resolve(parentDir, 'logs');
    var downloadsDir = path_1.default.resolve(parentDir, 'downloads');
    var attatchmentsDir = path_1.default.resolve(downloadsDir, 'attachments');
    var documentsDir = path_1.default.resolve(downloadsDir, 'documents');
    if (!fs_1.default.existsSync(parentDir)) {
        fs_1.default.mkdirSync(parentDir);
        fs_1.default.mkdirSync(logsDir);
        fs_1.default.mkdirSync(downloadsDir);
        fs_1.default.mkdirSync(attatchmentsDir);
        fs_1.default.mkdirSync(documentsDir);
    }
}
exports.createTempParentDirectory = createTempParentDirectory;
function deleteTempParentDirectory(tempPath, parentId) {
    var parentDir = path_1.default.resolve(tempPath, parentId);
    var downloadsDir = path_1.default.resolve(parentDir, 'downloads');
    if (fs_1.default.existsSync(downloadsDir)) {
        fs_1.default.rmdirSync(downloadsDir, { recursive: true });
    }
}
exports.deleteTempParentDirectory = deleteTempParentDirectory;
