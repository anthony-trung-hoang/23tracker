import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export function exportExcel() {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("My Sheet");

  worksheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Age", key: "age", width: 10 },
  ];

  worksheet.addRow({ name: "John Doe", age: 30 });
  worksheet.addRow({ name: "Jane Smith", age: 25 });

  // Xuất file excel
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `world-statistics.xlsx`);
  });
}
