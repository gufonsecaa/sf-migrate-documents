import fs from 'fs'
import csvParse from 'csv-parse'

interface MappingRecord {
  OriginParentId: string
  TargetParentId: string
  finished: boolean
  error: boolean
}

function loadMappingRecords(filePath: string): Promise<MappingRecord[]> {
  return new Promise((resolve, reject) => {
    const records: MappingRecord[] = [];

    const stream = fs.createReadStream(filePath);

    const parseFile = csvParse({ fromLine: 2, skipEmptyLines: true });
    stream.pipe(parseFile);

    parseFile
      .on('data', async (line) => {
        const [OriginParentId, TargetParentId] = line

        records.push({
          OriginParentId,
          TargetParentId,
          finished: false,
          error: false
        });
      })
      .on('end', () => {
        resolve(records);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

export async function getMappingList(filePath: string): Promise<MappingRecord[]> {
  return await loadMappingRecords(filePath)
}
