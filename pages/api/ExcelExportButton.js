import React from 'react';
import * as XLSX from 'xlsx';

const ExcelExportButton = ({ sheets }) => {
    const handleExportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        sheets.forEach(sheet => {
            const { sheetName, data } = sheet;

            // Create worksheet
            const worksheet = XLSX.utils.json_to_sheet(data, { skipHeader: true });

            // Apply borders to each cell
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
                    if (!cell) continue;

                    // Apply border to all sides
                    cell.s = {
                        border: {
                            bottom: { style: 'thin', color: { rgb: '000000' } },
                            top: { style: 'thin', color: { rgb: '000000' } },
                            left: { style: 'thin', color: { rgb: '000000' } },
                            right: { style: 'thin', color: { rgb: '000000' } }
                        }
                    };
                }
            }

            // Dynamically adjust column width based on content length
            const colWidths = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
                colWidths[C] = { wch: 0 };
                for (let R = range.s.r; R <= range.e.r; ++R) {
                    const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
                    if (cell) {
                        const cellText = XLSX.utils.format_cell(cell);
                        const cellTextWidth = cellText.length + 2; // Add a buffer
                        if (colWidths[C].wch < cellTextWidth) {
                            colWidths[C].wch = cellTextWidth;
                        }
                    }
                }
            }
            worksheet['!cols'] = colWidths;

            // Append the formatted sheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        });
        XLSX.writeFile(workbook, 'Inventory-List.xlsx');
    };
    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleExportToExcel}>
            Export to Excel
        </button>
    );
};

export default ExcelExportButton;
