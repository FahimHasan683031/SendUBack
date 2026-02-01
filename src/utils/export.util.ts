import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';
import { Response } from 'express';

export class ExportUtils {
    /**
     * Converts data to CSV format and sends it as a response
     */
    static async toCSV(res: Response, data: any[], fields: string[], fileName: string) {
        try {
            if (!data.length) {
                return res.status(404).json({ success: false, message: "No data to export" });
            }

            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(data);

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}.csv"`);

            return res.send(csv);
        } catch (error) {
            console.error("CSV Export Error:", error);
            throw error;
        }
    }

    /**
     * Converts data to Excel format and sends it as a response
     */
    static async toExcel(res: Response, data: any[], columns: any[], sheetName: string, fileName: string) {
        try {
            if (!data.length) {
                return res.status(404).json({ success: false, message: "No data to export" });
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(sheetName);

            worksheet.columns = columns;
            worksheet.addRows(data);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}.xlsx"`);

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error("Excel Export Error:", error);
            throw error;
        }
    }
}
