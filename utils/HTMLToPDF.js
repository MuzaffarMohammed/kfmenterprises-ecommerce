
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { jsPDF } from "jspdf";

export const convertHTMLToPDFAndDownload = (elementId, fileName) => {
    toPng(document.getElementById(elementId), { quality: 0.95 })
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.href = dataUrl;
            link.download = fileName + '.png';
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(fileName + ".pdf");
        });
}