"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var app_1 = require("./app");
// ====== //
// import { origin, target } from './config/salesforce-connections'
// import { jsForceConnection } from './shared/JSForceProvider'
// import { createTempDirectories } from './useCases/createTempDirectories'
// import { getAttachmentRecords } from './useCases/GetAttachmentRecords'
// import { Download } from './engine/Download'
// import { Upload } from './engine/Upload'
//async function run() {
// const originOrg = await jsForceConnection.createInstance(origin)
// const targetOrg = await jsForceConnection.createInstance(target)
//   const tempPath = path.resolve(__dirname, '..', 'tmp')
//   const mappingIds = [
//     { originParentId: '0016100001eFErFAAW', targetParentId: '0017f00000f6kHqAAI' },
//     { originParentId: '0013B00000fo4uAQAQ', targetParentId: '0017f00000f5dkkAAA' }
//   ]
//   const { originParentId, targetParentId } = mappingIds[0]
//   const attachmentsPath = path.resolve(__dirname, '..', 'tmp', originParentId, 'downloads', 'attachments')
//   createTempDirectories(tempPath, originParentId)
//   const attachmentRecords = await getAttachmentRecords(originOrg, originParentId)
//   const downloadEngine = new Download(attachmentRecords, attachmentsPath, originOrg)
//   downloadEngine.subscribe(( downloadState ) => {
//     console.log('Download =>', downloadState)
//     console.log(`
//       ====================================
//     `)
//     console.log('Start upload')
//     const uploadEngine = new Upload(attachmentsPath, targetOrg, targetParentId)
//     uploadEngine.subscribe((uploadState) => {
//       console.log('Upload =>', uploadState)
//     })
//     uploadEngine.start()
//   })
//   downloadEngine.start()
// }
var application = new app_1.App();
application.init();
