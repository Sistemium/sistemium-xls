import contentDisposition from 'content-disposition';
import find from 'lodash/find';
import xlsx from './xlsx';

export default async function (ctx) {
  const { data, schema, fileName } = ctx.request.body;

  ctx.assert(Array.isArray(data), 400, 'data must be array');
  ctx.assert(validSchema(schema), 400, 'invalid schema');

  const workbook = xlsx(data, schema);
  const buffer = await workbook.xlsx.writeBuffer();

  if (fileName) {
    ctx.set('Content-Disposition', contentDisposition(fileName, { fallback: false }));
  }
  ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  ctx.body = buffer;
}

function validSchema(schema = {}) {
  const { columns } = schema;
  return Array.isArray(columns)
    && !find(columns, c => !c || !c.key);
}
