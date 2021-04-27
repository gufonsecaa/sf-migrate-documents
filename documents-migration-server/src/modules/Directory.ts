import fs from 'fs'
import path from 'path'

export function refreshDirectory(tempPath: string) {
  if (fs.existsSync(tempPath)) {
    fs.rmdirSync(tempPath, { recursive: true })
  }
  fs.mkdirSync(tempPath)
}

export function createTempParentDirectory(tempPath: string, parentId: string) {
  const parentDir = path.resolve(tempPath, parentId)
  const logsDir = path.resolve(parentDir, 'logs')
  const downloadsDir = path.resolve(parentDir, 'downloads')
  const attatchmentsDir = path.resolve(downloadsDir, 'attachments')
  const documentsDir = path.resolve(downloadsDir, 'documents')

  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir)
    fs.mkdirSync(logsDir)
    fs.mkdirSync(downloadsDir)
    fs.mkdirSync(attatchmentsDir)
    fs.mkdirSync(documentsDir)
  }
}

export function deleteTempParentDirectory(tempPath: string, parentId: string) {
  const parentDir = path.resolve(tempPath, parentId)
  const downloadsDir = path.resolve(parentDir, 'downloads')

  if (fs.existsSync(downloadsDir)) {
    fs.rmdirSync(downloadsDir, { recursive: true })
  }
}
