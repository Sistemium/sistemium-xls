import ExcelJS from 'exceljs';
import upperFirst from 'lodash/upperFirst';
import map from 'lodash/map';

import log from 'sistemium-debug';

const { debug } = log('xlsx');

export default function (data = [], schema = {}) {
  const { name = 'Sheet1', columns = [] } = schema;
  debug('columns', map(columns, 'key'), 'rows:', data.length);

  const workbook = new ExcelJS.Workbook();
  const { sheets = [{ name }] } = schema;
  const sheetsData = schema.sheets ? data : [data];

  sheets.forEach((sheet, index) => {
    addWorksheetToWorkbook(workbook, sheet.name, columns, sheetsData[index]);
  });

  return workbook;
}

function addWorksheetToWorkbook(workbook, name, columns, data) {
  const worksheet = workbook.addWorksheet(name);
  worksheet.columns = columns.map(mapColumn);

  const header = worksheet.getRow(1);
  header.alignment = { vertical: 'middle', horizontal: 'center' };
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
