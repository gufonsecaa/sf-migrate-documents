import path from 'path'
import fs from 'fs'

import { uploadContentVersion } from '../modules/SalesforceRepository'

export class UploadContentVersion {
  fileErrors = []
  totalFiles: number = 0
  totalSuccess: number = 0
  totalErrors: number = 0

  orgInstance = null
  localContentVersionURL = null
  targetParentId = null

  observers: ((obj)=>{})[] = null

  constructor(localContentVersionURL, orgInstance, targetParentId) {
    this.localContentVersionURL = localContentVersionURL
    this.targetParentId = targetParentId
    this.orgInstance = orgInstance

    this.observers = []
  }

  start() {
    const fileNames = fs.readdirSync(this.localContentVersionURL)

    this.totalFiles = fileNames.length

    fileNames.forEach(async fileName => {
      // console.log('Upload file started => ' + fileName)
      const file = fs.readFileSync(path.resolve(this.localContentVersionURL, fileName))

      const uploadResult = await uploadContentVersion(
        this.orgInstance,
        { PathOnClient: fileName },
        file
      )

      const contentDocument = await this.orgInstance.sobject('ContentVersion').retrieve(uploadResult.id)

      const linkResult = await this.orgInstance.sobject('ContentDocumentLink').create({
        ContentDocumentId: contentDocument.ContentDocumentId,
        LinkedEntityId: this.targetParentId,
        ShareType: 'V'
      })

      if (!linkResult.success) {
        this.error(fileName)
      } else {
        this.completed()
      }
    })
  }

  error(fileName) {
    this.totalErrors++
    this.fileErrors.push(fileName)

    console.log(`${this.totalErrors + this.totalSuccess} de ${this.totalFiles} | erros: ${this.totalErrors}`)

    if ((this.totalSuccess + this.totalErrors) === this.totalFiles) {
      // console.log('Upload completed')
      this.notifyObservers()
    }
  }

  completed() {
    this.totalSuccess++

    console.log(`${this.totalErrors + this.totalSuccess} de ${this.totalFiles} | erros: ${this.totalErrors}`)

    if ((this.totalSuccess + this.totalErrors) === this.totalFiles) {
      // console.log('Upload completed')
      this.notifyObservers()
    }
  }

  subscribe(observer) {
    this.observers.push(observer)
  }

  notifyObservers() {
    for (const observer of this.observers) {
      observer({
        totalFiles: this.totalFiles,
        totalSuccess: this.totalSuccess,
        totalErrors: this.totalErrors,
      })
    }
  }
}
