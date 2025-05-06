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
            // Configuração do PDF
            const doc = new PDFDocument({
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
                size: [595.28, 841.89] // Tamanho A4
            });
    
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

            // Desenhar borda externa do ingresso
            doc.rect(50, 50, doc.page.width - 100, doc.page.height - 100)
               .stroke('#000000');
            
            // Carregar e adicionar a imagem do logo
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const logoPath = path.resolve(__dirname, '../img/fundoIngresso.png');
            
            try {
                // Logo centralizado no topo
                doc.image(logoPath, (doc.page.width - 200) / 2, 70, { fit: [200, 200] });
            } catch (error) {
                console.error('Erro ao carregar imagem do logo:', error);
            }
            
            // Texto de apresentação do voucher
            doc.fontSize(12)
               .font('Helvetica')
               .text('Apresente este voucher no dia do evento, acompanhado de documento com foto.', 
                    50, 280, { width: doc.page.width - 100, align: 'center' });
            
            // Caixa de informações do evento
            doc.rect(75, 310, doc.page.width - 150, 100)
               .stroke('#000000');
            
            // Título do evento dentro da caixa
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .text('ARRAIÁ CRM', 85, 325);
            
            // Informações de data e hora
            doc.fontSize(12)
               .font('Helvetica')
               .text('DATA: 07/06/2025 - 16H ÀS 00', 85, 345);
            
            // Informações do local
            doc.fontSize(12)
               .font('Helvetica')
               .text('LOCAL: R. QUINTINO BOCAIÚVA, 2607- SARAIVA', 85, 365)
               .text('UBERLÂNDIA/MG', 85, 385);
            
            // Caixa para QR Code e dados do comprador
            doc.rect(75, 450, doc.page.width - 150, 150)
               .stroke('#000000');
            
            // QR Code à esquerda
            doc.image(Buffer.from(qrCodeBase64.split(',')[1], 'base64'), 
                     90, 465, { fit: [120, 120] });
            
            // Dados do comprador à direita do QR Code
            const infoX = 230;
            
            doc.fontSize(12)
               .font('Helvetica')
               .text('Nome: ' + dados.full_name, infoX, 480);
            
            doc.fontSize(12)
               .font('Helvetica')
               .text('CPF: ' + dados.cpf, infoX, 505);
            
            doc.fontSize(12)
               .font('Helvetica')
               .text('Telefone: ' + dados.telephone, infoX, 530);
            
            doc.end();
        });
    }
}

export default new pdfUtils();