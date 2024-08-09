import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { Buffer } from 'buffer';
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
        const titleWidth = doc.widthOfString(titulo);
        const imagePath = '../img/fundoIngresso.png';

        doc.text(title, {
            align: 'left',
            continued: true // Permite que o texto continue na mesma linha para a próxima chamada
        });

        // Adicionar imagem ao lado direito do título
        doc.image(imagePath, doc.x + 10, doc.y - 25, {
            fit: [50, 50], // Ajuste o tamanho da imagem conforme necessário
            valign: 'center'
        });

        // // Adicionando título
        // doc.fontSize(25).font('Helvetica-Bold').text('SAMBA DO SEU ZÉ', {
        //     align: 'left',
        //     fontSize: 20,
        //     fontWeight: 600
        // });

        doc.moveDown();

        // Adicionar campos para preenchimento
        doc.fontSize(12).font('Helvetica').text('Endereco: Rua Quintino Bocaiúva, 2607', {
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