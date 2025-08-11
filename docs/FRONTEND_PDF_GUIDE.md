### Guia para geração de PDF no Front-end (Ingressos)

Este documento descreve o novo contrato dos endpoints e as instruções para gerar o PDF do ingresso no front-end. O back-end não envia mais o arquivo PDF; ele envia os dados necessários para que o front gere o documento.

### Mudanças principais

- **Não retornamos mais `pdf` em base64.**
- **Agora retornamos `result.ticket` e `result.event`** em `POST /tickets` e `GET /tickets/:id`.

### Endpoints e contratos

- **POST `/tickets`**

  - Request body: `{ full_name, cpf, birth_date, telephone }`
  - Response 201:
    ```json
    {
      "error": false,
      "msgUser": "Ingresso cadastrado com sucesso.",
      "msgOriginal": null,
      "result": {
        "ticket": {
          "seller_id": "<uuid|number>",
          "full_name": "Nome Normalizado",
          "telephone": "(xx) xxxxx-xxxx",
          "birth_date": "YYYY-MM-DD",
          "cpf": "xxx.xxx.xxx-xx",
          "qrcode": "<hash>",
          "status": "A"
        },
        "event": {
          "title": "ARRAIÁ CRM",
          "date": "07/06/2025",
          "time": "16H ÀS 00H",
          "addressLine1": "R. QUINTINO BOCAIÚVA, 2607- SARAIVA",
          "addressLine2": "UBERLÂNDIA/MG"
        }
      }
    }
    ```

- **GET `/tickets/:id`**
  - Response 200:
    ```json
    {
      "error": false,
      "msgUser": null,
      "msgOriginal": null,
      "result": {
        "ticket": {
          "id": 123,
          "full_name": "...",
          "cpf": "...",
          "telephone": "...",
          "qrcode": "...",
          "status": "A"
        },
        "event": {
          "title": "ARRAIÁ CRM",
          "date": "07/06/2025",
          "time": "16H ÀS 00H",
          "addressLine1": "R. QUINTINO BOCAIÚVA, 2607- SARAIVA",
          "addressLine2": "UBERLÂNDIA/MG"
        }
      }
    }
    ```

### Layout do PDF (A4 retrato)

- **Formato**: A4 (595.28 x 841.89 pt), margens: 50 pt em todos os lados.
- **Borda externa**: um retângulo de moldura dentro das margens.
- **Logo/Imagem no topo**: imagem centralizada próximo ao topo (largura aprox. 200 pt). No back-end a imagem referência é `fundoIngresso.png`. O front pode usar o mesmo asset ou equivalente.
- **Texto de instrução**: centralizado abaixo do logo: "Apresente este voucher no dia do evento, acompanhado de documento com foto."
- **Caixa de informações do evento**: retângulo horizontal com:
  - Título em destaque: `event.title`
  - Linha de data/hora: `DATA: <event.date> - <event.time>`
  - Endereço em duas linhas: `event.addressLine1` e `event.addressLine2`
- **Caixa inferior (QR + comprador)**: retângulo com duas colunas:
  - Esquerda: QR Code gerado a partir de `ticket.qrcode` (hash)
  - Direita: dados do comprador (Nome, CPF, Telefone)

Sugestão de proporções e posições (pode ajustar conforme a lib):

- Logo: x = (largura - 200)/2, y ≈ 70, tamanho aprox. 200x200 pt (fit)
- Texto de instrução: y ≈ 280, alinhado ao centro
- Caixa evento: x = 75, y = 310, largura = página - 150, altura ≈ 100
- Título evento: y ≈ 325; Data/Hora: y ≈ 345; Local: y ≈ 365-385
- Caixa QR+comprador: x = 75, y = 450, largura = página - 150, altura ≈ 150
- QR: x ≈ 90, y ≈ 465, tamanho ≈ 120x120
- Texto info comprador à direita do QR, iniciando em x ≈ 230, com linhas em ~480, 505, 530

### Regras de estilo

- Fonte: Helvetica / Helvetica-Bold (ou alternativas padrão da lib)
- Tamanhos:
  - Título evento: 14 pt, bold
  - Demais textos: 12 pt
- Cores: preto (#000) para traços e textos

### Geração do QR Code no front

- Gerar a partir de `ticket.qrcode` (string hash). Qualquer lib QR (ex.: `qrcode`) pode produzir data URL ou canvas para ser embutido no PDF.

### Exemplo de geração (jsPDF + qrcode)

```ts
import jsPDF from "jspdf";
import QRCode from "qrcode";

export async function buildTicketPdf({
  ticket,
  event,
  logoDataUrl,
}: {
  ticket: { full_name: string; cpf: string; telephone: string; qrcode: string };
  event: {
    title: string;
    date: string;
    time: string;
    addressLine1: string;
    addressLine2: string;
  };
  logoDataUrl?: string; // opcional: dataURL da imagem de logo/fundo
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;

  // Borda
  doc.setLineWidth(1);
  doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

  // Logo (opcional)
  if (logoDataUrl) {
    const logoWidth = 200;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logoDataUrl, "PNG", logoX, 70, logoWidth, 200);
  }

  // Texto de instrução
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(
    "Apresente este voucher no dia do evento, acompanhado de documento com foto.",
    pageWidth / 2,
    280,
    { align: "center" }
  );

  // Caixa evento
  doc.rect(75, 310, pageWidth - 150, 100);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(event.title, 85, 325);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`DATA: ${event.date} - ${event.time}`, 85, 345);
  doc.text(event.addressLine1, 85, 365);
  doc.text(event.addressLine2, 85, 385);

  // Caixa QR + comprador
  doc.rect(75, 450, pageWidth - 150, 150);

  const qrDataUrl = await QRCode.toDataURL(ticket.qrcode);
  doc.addImage(qrDataUrl, "PNG", 90, 465, 120, 120);

  const infoX = 230;
  doc.text(`Nome: ${ticket.full_name}`, infoX, 480);
  doc.text(`CPF: ${ticket.cpf}`, infoX, 505);
  doc.text(`Telefone: ${ticket.telephone}`, infoX, 530);

  return doc.output("datauristring");
}
```

### Observações

- O asset `fundoIngresso.png` usado no back-end era apenas referência visual. O front pode usar o mesmo nome/asset no seu repositório ou qualquer arte equivalente.
- O hash em `ticket.qrcode` já vem pronto; não é necessário re-hash, apenas gerar o QR a partir dele.
- Ajustes finos de posicionamento são bem-vindos para melhor responsividade/qualidade de impressão.
