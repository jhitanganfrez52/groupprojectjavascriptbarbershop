import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CashRegister } from "../types/cashRegisterSchema";

export const exportPDF = (data: CashRegister[]) => {
  const doc = new jsPDF();

  //  Título
  doc.text("Reporte de Caja", 14, 15);

  //  Formatear datos
  const tableData = data.map((item) => [
    item.type === "income" ? "Ingreso" : "Egreso",
    item.concept,
    `${item.amount} Bs`,
    item.method,
    item.date ? new Date(item.date).toLocaleString() : "",
  ]);

  //  Tabla
 autoTable(doc, {
  head: [["Tipo", "Concepto", "Monto", "Método", "Fecha"]],
  body: tableData,
  startY: 20,
  styles: {
    halign: "center",
  },
  headStyles: {
    fillColor: [255, 140, 0], // naranja 
  },
});

  //  Descargar
  doc.save("reporte_caja.pdf");
};