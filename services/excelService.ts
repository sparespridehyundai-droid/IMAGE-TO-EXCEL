
import * as XLSX from 'xlsx';
import { RepairOrderData } from '../types';
import { FIELD_MAPPING } from '../constants';

export function exportToExcel(dataList: RepairOrderData[]) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([]);

  let currentRowOffset = 0;

  dataList.forEach((data, index) => {
    // For each repair order, we write it starting at a specific row
    // We'll calculate the row offset based on the mapping (max row in FIELD_MAPPING + padding)
    const maxRowInMapping = Math.max(...FIELD_MAPPING.map(m => parseInt(m.cell.replace(/\D/g, ''))));
    const blockHeight = maxRowInMapping + 2; // Add some padding between forms

    FIELD_MAPPING.forEach((mapping) => {
      const originalCell = mapping.cell;
      const col = originalCell.match(/[A-Z]+/)?.[0] || 'A';
      const originalRow = parseInt(originalCell.match(/[0-9]+/)?.[0] || '1');
      
      const targetRow = originalRow + currentRowOffset;
      const dataCellRef = `${col}${targetRow}`;
      
      // Calculate label cell (one column to the left)
      const colCharCode = col.charCodeAt(0) - 1;
      const labelCol = String.fromCharCode(colCharCode);
      const labelCellRef = `${labelCol}${targetRow}`;

      const value = data[mapping.key];

      // Write label
      XLSX.utils.sheet_add_aoa(ws, [[`${mapping.label}:`]], { origin: labelCellRef });
      // Write data
      XLSX.utils.sheet_add_aoa(ws, [[value || '']], { origin: dataCellRef });
    });

    // Add a separator or title for each block
    XLSX.utils.sheet_add_aoa(ws, [[`--- REPAIR ORDER #${index + 1} ---`]], { origin: `A${currentRowOffset + 1}` });

    currentRowOffset += blockHeight;
  });

  // Set column widths
  ws['!cols'] = [
    { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 30 }, 
    { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 30 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Combined Repair Orders');
  
  const fileName = dataList.length === 1 
    ? `RepairOrder_${dataList[0].roNo || 'Export'}.xlsx`
    : `Combined_RepairOrders_${new Date().getTime()}.xlsx`;

  XLSX.writeFile(wb, fileName);
}
