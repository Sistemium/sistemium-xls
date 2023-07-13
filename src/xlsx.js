import ExcelJS from 'exceljs';
import upperFirst from 'lodash/upperFirst';
import map from 'lodash/map';

import log from 'sistemium-debug';

const { debug } = log('xlsx');

export default function (data = [], schema = {}) {
  const { name = 'Sheet1', columns = [] } = schema;
  debug('columns', map(columns, 'key'), 'rows:', data.length);

  const workbook = new ExcelJS.Workbook();
  const { sheets = [{ name, ...schema }] } = schema;
  const sheetsData = schema.sheets ? data : [data];

  sheets.forEach((sheetSchema, index) => {
    addWorksheetToWorkbook(workbook, sheetSchema, sheetsData[index]);
  });

  return workbook;
}

function addWorksheetToWorkbook(workbook, sheetSchema, data) {
  const { name, columns, headRows, pageSetup, grid } = sheetSchema;
  const worksheet = workbook.addWorksheet(name, { pageSetup });
  worksheet.columns = columns.map(mapColumn);

  const header = worksheet.getRow(1);
  header.alignment = { vertical: 'middle', horizontal: 'center' };
  header.font = { bold: true };

  worksheet.addRows(data);

  const columnCount = columns.length;

  data.forEach((r, row) => {
    columns.forEach((c, col) => {
      const cell = worksheet.getCell(row + 2, col + 1);
      if (grid) {
        cell.border = {
          top: grid,
          left: grid,
          bottom: grid,
          right: grid,
        };
      }
      if (c.wrapText || (sheetSchema.wrapText && c.width)) {
        cell.alignment = { wrapText: true };
      }
    });
  });

  if (headRows) {
    const headAlignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    const headBorder = { bottom: { style: 'thin' } };
    headRows.forEach((headRow, idx) => {
      const row = idx + 1;
      const { label, value, dataType, numFmt, title } = headRow;
      worksheet.insertRow(row, [label || title, dataType === 'date' ? new Date(value) : value]);
      if (label || value !== undefined) {
        const cell = worksheet.getCell(row, 2);
        cell.alignment = headAlignment;
        cell.border = headBorder;
        const labelCell = worksheet.getCell(row, 1);
        labelCell.alignment = headAlignment;
        labelCell.border = headBorder
        if (numFmt) {
          cell.numFmt = numFmt;
        }
        return;
      } else if (title) {
        const cell = worksheet.getCell(row, 1);
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { bold: true, size: 25, name: 'Arial' };
      }
      worksheet.mergeCells(row, 1, row, columnCount);
    });
  }

  return workbook;
}

function mapColumn({ title, key, width }) {
  return {
    key,
    header: title || upperFirst(key),
    width,
  };
}
