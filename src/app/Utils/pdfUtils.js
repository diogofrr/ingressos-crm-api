import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { Buffer } from 'buffer';
import { fileURLToPath } from 'url'
import path from 'path';
import fs from 'fs';

class pdfUtils {

    // Função para gerar QR code em base64
    async gerarQRCodeEmBase64(hash) {
        try {
            return await QRCode.toDataURL(hash);
        } catch (err) {
            console.error('Erro ao gerar QR code:', err);
        }
    }

    async testeCriacao(dados) {
        const hash = 'SeuHashAqui';

        // Gerar QR code
        const qrCodeBase64 = await this.gerarQRCodeEmBase64(hash);

        const doc = new PDFDocument();

        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            // Concatenando o buffer e convertendo para Base64
            const pdfData = Buffer.concat(buffers);
            const base64String = 'data:application/pdf;base64,' + pdfData.toString('base64');
            
            // Exibindo o resultado
            console.log(base64String);
        });

        const titulo = 'SAMBA DO SEU ZÉ';
        doc.fontSize(25).font('Helvetica-Bold');
        const titleWidth = doc.widthOfString(titulo);
        const titleX = doc.x; 
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const imagePath = path.resolve(__dirname ,'../img/fundoIngresso.png');;

        doc.text(titulo, {
            align: 'left',
            continued: true // Permite que o texto continue na mesma linha para a próxima chamada
        });

        // Adicionar imagem ao lado direito do título
        const imageX = titleX + titleWidth + 200; // Posiciona a imagem após o título com uma margem de 10 unidades
        const imageY = doc.y - 25; // Mantém a imagem alinhada verticalmente com o título
        doc.image(imagePath, imageX, imageY, {
            fit: [50, 50], // Ajuste o tamanho da imagem conforme necessário
            valign: 'center'
        });


        doc.moveDown();
        doc.moveDown();

        // Adicionar campos para preenchimento
        doc.fontSize(15).font('Helvetica').text('Endereco: Rua Quintino Bocaiúva, 2607', {
            align: 'left'
        });
        doc.moveDown();
        doc.text('Bairro: Saraiva', { align: 'left', fontSize: 15 });
        doc.moveDown();
        doc.text('Cidade: Uberlândia', { align: 'left', fontSize: 15 });
        doc.moveDown();
        doc.text('CEP: 38408-533', { align: 'left', fontSize: 15 });
        doc.moveDown();
        doc.text('Horario: ', { align: 'left', fontSize: 15 });
        doc.moveDown();
        doc.moveDown();

        // Adicionar campos de dados do comprador
        doc.fontSize(15).font('Helvetica-Bold').text('Dados do Comprador:', {
            align: 'left'
        });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica').text('Nome: ________________________________', {
            align: 'left'
        });
        doc.moveDown();
        doc.text('CPF: ________________________________', { align: 'left' });
        doc.moveDown();
        doc.text('Telefone: ________________________________', { align: 'left' });
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();

        // Adicionar uma borda e estilo ao PDF
        doc.rect(40, 40, 520, 720).stroke(); // Borda ao redor do conteúdo

        // Adicionar QR code ao PDF
        doc.fontSize(14).font('Helvetica-Bold').text('QR CODE', { align: 'left' });
        doc.translate(-32, 0); // Mover a posição horizontalmente
        doc.image(Buffer.from(qrCodeBase64.split(',')[1], 'base64'), {
            fit: [250, 300],
            align: 'left',
            valign: 'left'
        });

        // Finalizar o documento
        doc.end();
    }
}

export default new pdfUtils();