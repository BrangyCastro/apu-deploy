import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import * as jsonexport from "jsonexport/dist";
import * as moment from "moment";

async function downloadEcxel(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  const pdfBlob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(pdfBlob, `${filename}_${moment().format("l")}.xlsx`);
}

async function downloadCsv(data, file) {
  const csv = await jsonexport(data, { rowDelimiter: ";" });

  const pdfBlob = new Blob([csv], { type: "text/csv" });

  saveAs(pdfBlob, `${file}_${moment().format("l")}.csv`);
}

export { downloadCsv, downloadEcxel };
