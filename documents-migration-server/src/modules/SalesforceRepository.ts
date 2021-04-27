import fs from 'fs'
import path from 'path'
import request from 'request'
import { Connection } from 'jsforce'

interface AttachmentRecordData {
  Id: string
  Name: string
  ParentId: string
  Body: string
}

interface LatestPublishedVersion {
  Id?: string
  PathOnClient: string
  Title?: string
  FileExtension?: string
  VersionData?: string
}

interface ContentDocument {
  LatestPublishedVersion: LatestPublishedVersion
}

interface ContentDocumentLink {
  Id: string
  ContentDocument: ContentDocument
}

export async function getOriginAttachmentRecords(orgInstance: Connection, originParentId: string) {
  const query = `
    SELECT Id, Name, ParentId, Body, ContentType
    FROM Attachment
    WHERE ParentId = '${originParentId}'
  `;

  try {
    const queryResult = await orgInstance.query(query)

    const attachmentsRecords: AttachmentRecordData[] = queryResult.records.map(
      ({ Id, Name, ParentId, Body }) => ({ Id, Name, ParentId, Body })
    )

    return attachmentsRecords
  } catch (error) {
    console.log(error)
  }
}

export async function getOriginContentDocumentLinkRecords(orgInstance: Connection, originParentId: string) {
  const query = `
  SELECT
    Id,
    ContentDocument.LatestPublishedVersion.Id,
    ContentDocument.LatestPublishedVersion.PathOnClient,
    ContentDocument.LatestPublishedVersion.VersionData,
    ContentDocument.LatestPublishedVersion.Title,
    ContentDocument.LatestPublishedVersion.FileExtension
  FROM ContentDocumentLink
  WHERE LinkedEntityId = '${originParentId}'
  `;

  try {
    const queryResult = await orgInstance.query(query)

    if (queryResult.records.length == 0) {
      console.log('Nenhum documento encontrado para o Id origem:', originParentId)
    }

    const contentVersions: LatestPublishedVersion[] = queryResult.records.map(
      (record: ContentDocumentLink) => {
        const fileName = record.ContentDocument.LatestPublishedVersion.PathOnClient;

        return {
          Id: record.ContentDocument.LatestPublishedVersion.Id,
          Title: fileName,
          PathOnClient: fileName,
          FileExtension: record.ContentDocument.LatestPublishedVersion.FileExtension,
          VersionData: record.ContentDocument.LatestPublishedVersion.VersionData
        }
      }
    )

    return contentVersions
  } catch (error) {
    console.log(error)
  }
}

export async function fetchSalesforceAttachment(
  orgInstance: Connection,
  attachment: AttachmentRecordData,
  attachmentsPath: string
) {
  return new Promise((resolve, reject) => {
    const fileOut = fs.createWriteStream(path.resolve(attachmentsPath, attachment.Name))

    orgInstance
      .sobject('Attachment')
      .record(attachment.Id)
      .blob('Body')
      .pipe(fileOut)
      .on('open', function(err, result) {
        // console.log('Download started => ', attachment.Name)
      })
      .on('finish', function(err, result) {
        if (err) {
          reject(err)
          console.log('not downloaded => ', attachment.Name);
        } else {
          resolve(attachment)
        }
      })
  })
}

export async function fetchSalesforceContentVersion(
  orgInstance: Connection,
  documentVersion: LatestPublishedVersion,
  documentsPath: string
) {
  return new Promise((resolve, reject) => {
    const fileOut = fs.createWriteStream(path.resolve(documentsPath, documentVersion.PathOnClient))

    orgInstance
      .sobject('ContentVersion')
      .record(documentVersion.Id)
      .blob('VersionData')
      .pipe(fileOut)
      .on('open', function(err, result) {
        // console.log('Download started => ', attachment.Name)
      })
      .on('finish', function(err, result) {
        if (err) {
          reject(err)
          console.log('not downloaded => ', documentVersion.Title);
        } else {
          resolve(documentVersion)
        }
      })
  })
}

export const uploadContentVersion = (orgInstance: Connection, metadata: LatestPublishedVersion, file: Buffer): Promise<any> =>
  new Promise((resolve, reject) => {
    request.post({
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
    }, (err, response) => {
      if (err)
        reject(err)

      resolve(JSON.parse(response.body))
    })
  })
