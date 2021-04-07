import ExcelJS from 'exceljs';
import upperFirst from 'lodash/upperFirst';
import map from 'lodash/map';

import log from 'sistemium-debug';

const { debug } = log('xlsx');

export default function (data = [], schema = {}) {

  const { name = 'Sheet1', columns = [] } = schema;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(name);

  worksheet.columns = columns.map(mapColumn);

  debug('columns', map(columns, 'key'), 'rows:', data.length);

  const header = worksheet.getRow(1);
  header.alignment = { vertical: 'middle', horizontal: 'center' }
  header.font = { bold: true };

  worksheet.addRows(data);

  return workbook;

}


function mapColumn({ title, key, width }) {
  return {
    key,
    header: title || upperFirst(key),
    width,
  };
}
