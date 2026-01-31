
import * as XLSX from 'xlsx';
import { RepairOrderData } from '../types';
import { FIELD_MAPPING } from '../constants';

/**
 * Exports multiple repair order records into a single Excel sheet.
 * Uses a strict 6-column grid (3 pairs of Label:Value per row) 
 * to ensure "full data" is visible in the requested format.
 */
export function exportToExcel(dataList: RepairOrderData[]) {
  const wb = XLSX.utils.book_new();
  const wsData: any[][] = [];

  dataList.forEach((data, index) => {
    // Add a Header for each Record
    wsData.push([`REPAIR ORDER RECORD #${index + 1}`, '', '', '', '', '']);
    wsData.push(['------------------------------------------------------------', '', '', '', '', '']);

    // Group all fields from FIELD_MAPPING into sets of 3 to fit 6 columns
    // (Each set of 3 fields = 3 labels + 3 values = 6 cells)
    for (let i = 0; i < FIELD_MAPPING.length; i += 3) {
      const row: any[] = [];
      
      // Process 3 fields at a time
      for (let j = 0; j < 3; j++) {
        const field = FIELD_MAPPING[i + j];
        if (field) {
          row.push(`${field.label}:`); // Column for Label
          row.push((data as any)[field.key] || ''); // Column for Value
        } else {
          row.push(''); // Empty Label
          row.push(''); // Empty Value
        }
      }
      wsData.push(row);
    }

    // Add spacing between records
    wsData.push(['', '', '', '', '', '']);
    wsData.push(['', '', '', '', '', '']);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set widths for the 6 columns (A=Label, B=Value, C=Label, D=Value, E=Label, F=Value)
  ws['!cols'] = [
    { wch: 15 }, { wch: 20 }, // Pair 1
    { wch: 15 }, { wch: 20 }, // Pair 2
    { wch: 15 }, { wch: 20 }  // Pair 3
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Full Data Export');
  
  const timestamp = new Date().getTime();
  XLSX.writeFile(wb, `GDMS_Full_Export_${timestamp}.xlsx`);
}
