import { fetchSalesforceAttachment } from '../modules/SalesforceRepository'

export class Download {
  files = []
  fileErrors = []
  totalFiles: number = null
  totalSuccess: number = null
  totalErrors: number = null

  orgInstance = null
  localAttachmentsURL = null

  observers: ((obj)=>{})[] = null

  constructor(recordFiles, localAttachmentsURL, orgInstance) {
    this.files = recordFiles
    this.fileErrors = []
    this.totalFiles = recordFiles.length

    this.totalSuccess = 0
    this.totalErrors = 0

    this.localAttachmentsURL = localAttachmentsURL
    this.orgInstance = orgInstance

    this.observers = []
  }

  start() {
    this.files.forEach(file => {
      fetchSalesforceAttachment(this.orgInstance, file, this.localAttachmentsURL)
      .then(res => {
        this.completed()
      })
      .catch(err => {
        this.error(file)
      })
    })
  }

  error(file) {
    this.totalErrors++
    this.fileErrors.push(file)

    console.log(`${this.totalErrors + this.totalSuccess} de ${this.totalFiles} | erros: ${this.totalErrors}`)

    if ((this.totalSuccess + this.totalErrors) === this.totalFiles) {
      this.notifyObservers()
    }
  }

  completed() {
    this.totalSuccess++

    console.log(`${this.totalErrors + this.totalSuccess} de ${this.totalFiles} | erros: ${this.totalErrors}`)

    if ((this.totalSuccess + this.totalErrors) === this.totalFiles) {
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
