import path from 'path'
import fs from 'fs'

export class Upload {
  fileErrors = []
  totalFiles: number = 0
  totalSuccess: number = 0
  totalErrors: number = 0

  orgInstance = null
  localAttachmentsURL = null
  targetParentId = null

  observers: ((obj)=>{})[] = null

  constructor(localAttachmentsURL, orgInstance, targetParentId) {
    this.localAttachmentsURL = localAttachmentsURL
    this.targetParentId = targetParentId
    this.orgInstance = orgInstance

    this.observers = []
  }

  start() {
    const fileNames = fs.readdirSync(this.localAttachmentsURL)

    this.totalFiles = fileNames.length

    fileNames.forEach(async fileName => {
      // console.log('Upload file started => ' + fileName)
      const file = fs.readFileSync(path.resolve(this.localAttachmentsURL, fileName))

      const body = Buffer.from(file).toString('base64')

      this.orgInstance.sobject('Attachment').create({
        Name: fileName,
        ParentId: this.targetParentId,
        Body: body
      })
      .then(res => {
        // console.log('file sent => ', fileName)
        this.completed()
      })
      .catch(err => {
        this.error(fileName)
      })
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
