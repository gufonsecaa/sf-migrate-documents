import fs from 'fs'
import path from 'path'

interface ProcessTransferData {
  totalFiles: number
  totalSuccess: number
  totalErrors: number
}

interface LogItemProps {
  originParentId: string
  targetParentId: string
  download: ProcessTransferData
  upload: ProcessTransferData
}

interface MappingRecord {
  OriginParentId: string
  TargetParentId: string
  error: boolean
}

interface MappingLogProps {
  mappingRecord: MappingRecord
  download: ProcessTransferData
  upload: ProcessTransferData
}

export async function writeLogForProcessItem(logPath: string, logItem: LogItemProps) {
  const fileName = Date.now() + '-log.txt';
  const message =
  `Process:
    Id Origen: ${logItem.originParentId}
    Id Destino: ${logItem.targetParentId}
  ===================================
  Download
    Total: ${logItem.download.totalFiles} | Sucesso: ${logItem.download.totalSuccess} | Erros: ${logItem.download.totalErrors}

  Upload
    Total: ${logItem.upload.totalFiles} |  Sucesso: ${logItem.upload.totalSuccess} | Erros: ${logItem.upload.totalErrors}
  `;

  fs.writeFileSync(
    path.resolve(logPath, fileName),
    message
  )
}

export async function writeLogForMainProcess(logPath: string, log: MappingLogProps) {
  const message =
  `Process:
    Id Origen: ${log.mappingRecord.OriginParentId} | Id Destino: ${log.mappingRecord.TargetParentId}
    Status: ${log.mappingRecord.error ? 'ERRO' : 'Sucesso'}
  ==============================================================================

  `;

  if (!fs.existsSync(path.resolve(logPath))) {
    fs.writeFileSync(logPath, message)
  } else {
    fs.appendFileSync(logPath, message)
  }
}
