import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export function exportExcel(exportData) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(exportData.sheetTitle);

  worksheet.mergeCells("A1:I3");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = exportData.titleCell;
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.font = {
    name: "Open Sans",
    family: 2,
    size: 38,
  };

  const now = new Date();
  const date = now.getDate(); // Lấy ngày trong tháng (1-31)
  const month = now.getMonth() + 1; // Lấy tháng (0-11). Cộng thêm 1 để lấy tháng từ 1-12
  const year = now.getFullYear(); // Lấy năm (4 chữ số)
  const hours = now.getHours(); // Lấy giờ (0-23)
  const minutes = now.getMinutes(); // Lấy phút (0-59)
  const seconds = now.getSeconds().toString().padStart(2, "0"); // Lấy giây (0-59) và hiển thị dưới dạng 2 chữ số nếu giá trị là từ 0-9

  worksheet.mergeCells("A4:I5");
  let timeStampCell = worksheet.getCell("A4");
  timeStampCell.value =
    // this.$t("vietnamData.sheetExport.script1") +
    // this.worldStatistics.statistic_taken_at +
    // this.$t("vietnamData.sheetExport.script2") +
    exportData.script +
    `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  timeStampCell.alignment = { vertical: "middle", horizontal: "center" };
  timeStampCell.font = {
    name: "Arial",
    family: 1,
    size: 13,
  };

  worksheet.mergeCells("A6:I9");
  let desCell = worksheet.getCell("A6");
  desCell.value = exportData.desCell;
  desCell.font = {
    name: "Times New Roman",
    family: 1,
    size: 10,
  };

  desCell.alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };

  // Init table data
  let table = {
    name: "MyTable",
    ref: "A10",
    headerRow: true,
    style: {
      showRowStripes: true,
      showColumnStripes: true,
    },
    columns: exportData.columns,
    rows: [exportData.rows],
  };
  worksheet.addTable(table);

  // adjust column width
  const columnCount = table.columns.length;
  for (let i = 1; i <= columnCount; i++) {
    const column = worksheet.getColumn(i);
    let maxLength = 0;

    column.eachCell({ includeEmpty: true }, function (cell) {
      if (
        cell.address[1] != "4" &&
        cell.address[1] != "5" &&
        cell.address[1] != "6" &&
        cell.address[1] != "7" &&
        cell.address[1] != "8" &&
        cell.address[1] != "9"
      ) {
        const length = cell.value ? cell.value.toString().length : 10;
        if (length > maxLength) {
          maxLength = length;
        }
      }
    });

    column.width = maxLength + 2; // add some padding to the width
  }

  worksheet.mergeCells("B12:H13");
  let chartCell = worksheet.getCell("B12");
  chartCell.value = exportData.chartCell;
  chartCell.font = {
    name: "Times New Roman",
    family: 1,
    size: 11,
  };
  chartCell.alignment = { vertical: "middle", horizontal: "center" };

  const imageId = workbook.addImage({
    base64: exportData.base64Image,
    extension: "png",
  });
  worksheet.addImage(imageId, "B14:H30");

  // export file
  const timeStamp = exportData.timeStamp;
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${exportData.filename}_${timeStamp}.xlsx`);
  });
}
