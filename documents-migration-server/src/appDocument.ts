import path from 'path'

import { origin, target } from './config/salesforce-connections'

import { refreshDirectory, createTempParentDirectory, deleteTempParentDirectory } from './modules/Directory'
import { jsForceConnection } from './modules/JSForceProvider'
import { getMappingList } from './modules/CSV'
import { writeLogForProcessItem, writeLogForMainProcess } from './modules/Logs'

import { getOriginContentDocumentLinkRecords } from './modules/SalesforceRepository'

import { DownloadContentVersion } from './engine/DownloadContentVersion'
import { UploadContentVersion } from './engine/UploadContentVersion'

interface MappingRecord {
  OriginParentId: string
  TargetParentId: string
  finished: boolean
  error: boolean
}

export class AppDocument {
  importPath = path.resolve(__dirname, '..', '..', 'import')
  tempPath = path.resolve(__dirname, '..', 'temp')

  originOrgInstance = null
  targetOrgInstance = null

  mappingList: MappingRecord[] = null

  logFileName = Date.now() + '-log-completo.txt'

  async init() {
    refreshDirectory(this.tempPath)
    this.mappingList = await getMappingList(path.resolve(this.importPath, 'mapping.csv'))

    this.originOrgInstance = await jsForceConnection.createInstance(origin)
    this.targetOrgInstance = await jsForceConnection.createInstance(target)

    await this.startProcess()
  }

  getNextMappingRecord() {
    return this.mappingList.findIndex(item => !item.finished)
  }

  updateMappingRecord(index: number, data) {
    Object.assign(this.mappingList[index], data)
  }

  async startProcess() {
    const mappingIndex = this.getNextMappingRecord()

    if (mappingIndex === -1) {
      return this.finishProcess()
    }

    const { OriginParentId, TargetParentId } = this.mappingList[mappingIndex]
    console.log('')
    console.log('')
    console.log('==============================================')
    const msgLinhas = `Process (Linha ${(mappingIndex+1)} de ${this.mappingList.length}) ==> `
    console.log(msgLinhas, OriginParentId, 'x', TargetParentId)

    createTempParentDirectory(this.tempPath, OriginParentId)

    const documents = await getOriginContentDocumentLinkRecords(this.originOrgInstance, OriginParentId)
    if (documents.length === 0) {
      deleteTempParentDirectory(this.tempPath, OriginParentId)
      this.updateMappingRecord(mappingIndex, { finished: true })
      this.startProcess()
      return
    }

    const documentsPath = path.resolve(this.tempPath, OriginParentId, 'downloads', 'documents')

    console.log('')
    console.log('==> STARTING DOWNLOAD')

    const downloadEngine = new DownloadContentVersion(documents, documentsPath, this.originOrgInstance)
    downloadEngine.subscribe((downloadState) => {
      console.log('')
      // console.log(downloadState)
      console.log('==> STARTING UPLOAD')

      const uploadEngine = new UploadContentVersion(documentsPath, this.targetOrgInstance, TargetParentId)
      uploadEngine.subscribe((uploadState) => {

        writeLogForProcessItem(
          path.resolve(this.tempPath, OriginParentId, 'logs'),
          {
            originParentId: OriginParentId,
            targetParentId: TargetParentId,
            download: downloadState,
            upload: uploadState
          }
        )

        writeLogForMainProcess(
          path.resolve(__dirname, '..', '..', 'exports', this.logFileName),
          {
            mappingRecord: this.mappingList[mappingIndex],
            download: downloadState,
            upload: uploadState
          }
        )

        deleteTempParentDirectory(this.tempPath, OriginParentId)
        this.updateMappingRecord(mappingIndex, { finished: true })
        this.startProcess()
      })
      uploadEngine.start()
    })
    downloadEngine.start()
  }

  finishProcess() {
    console.log('')
    console.log('==============================================')
    console.log('Process completed!')
  }
}
