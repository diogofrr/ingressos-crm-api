import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { Buffer } from 'buffer';
import { fileURLToPath } from 'url'
import path from 'path';

class pdfUtils {

    // Função para gerar QR code em base64
    async gerarQRCodeEmBase64(hash) {
        try {
            return await QRCode.toDataURL(hash);
        } catch (err) {
            console.error('Erro ao gerar QR code:', err);
        }
    }

    async createPDF(dados) {
        const hash = dados.qrcode;
    
        const qrCodeBase64 = await this.gerarQRCodeEmBase64(hash);
    
        // Criar uma Promise para aguardar a conclusão do PDF
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
    
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                try {
                    // Concatenando o buffer e convertendo para Base64
                    const pdfData = Buffer.concat(buffers);
                    const base64String = 'data:application/pdf;base64,' + pdfData.toString('base64');
                    resolve(base64String); // Resolva a Promise com o base64
                } catch (error) {
                    reject(error); // Rejeite a Promise em caso de erro
                }
            });
    
            const titulo = 'ARRAIÁ CRM';
            doc.fontSize(25).font('Helvetica-Bold');
            const titleWidth = doc.widthOfString(titulo);
            const titleX     = doc.x; 
            const __filename = fileURLToPath(import.meta.url);
            const __dirname  = path.dirname(__filename);
            const imagePath  = path.resolve(__dirname, '../img/fundoIngresso.png');
    
            doc.text(titulo, { align: 'left' });
    
            const imageX = titleX + titleWidth + 200;
            const imageY = doc.y - 50;
            doc.image(imagePath, imageX, imageY, { fit: [50, 50], valign: 'center' });
    
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();
    
            doc.fontSize(10).font('Helvetica').text('Apresente este voucher no dia do evento, acompanhado de documento com foto.', { align: 'left' });
    
            doc.moveDown();
            doc.moveDown();
    
            doc.fontSize(12).font('Helvetica').text('LOCAL: R. QUINTINO BOCAIÚVA, 2607- SARAIVA, UBERLÂNDIA/MG', { align: 'left' });
            doc.moveDown();
            doc.text('DATA: 07/06/2025 - 16H ÀS 00H', { align: 'left', fontSize: 12 });
            doc.moveDown();
            doc.moveDown();
    
            doc.fontSize(15).font('Helvetica-Bold').text('Dados do Comprador:', { align: 'left' });
            doc.moveDown();
            doc.fontSize(12).font('Helvetica').text('Nome: ' + dados.full_name, { align: 'left' });
            doc.moveDown();
            doc.text('CPF: ' + dados.cpf, { align: 'left' });
            doc.moveDown();
            doc.text('Telefone: ' + dados.telephone, { align: 'left' });
            doc.moveDown();
            doc.moveDown();
            doc.moveDown();
    
            doc.rect(40, 40, 520, 720).stroke();
    
            doc.fontSize(14).font('Helvetica-Bold').text('QR CODE', { align: 'left' });
            doc.translate(-32, 0);
            doc.image(Buffer.from(qrCodeBase64.split(',')[1], 'base64'), { fit: [250, 300], align: 'left', valign: 'left' });
    
            doc.end();
        });
    }
}

export default new pdfUtils();