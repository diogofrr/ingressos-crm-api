# Ingressos CRM API – Migração para Prisma

Passos principais já aplicados:

- Adicionado Prisma (`prisma` e `@prisma/client`).
- Criado `prisma/schema.prisma` com modelos `User` e `Ticket` mapeando para tabelas `users` e `tickets`.
- Substituído `mysql2/promise` por Prisma Client em `conexao.js` e nos repositórios.

Como configurar a string de conexão:

1. Adicione no `.env`:

```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

2. Gere o client e sincronize o schema com o banco existente usando introspecção:

```
npx prisma db pull
npx prisma generate
```

Se quiser criar o banco via migrations a partir do schema atual:

```
npx prisma migrate dev --name init
```

Observações:

- Campos `created_at`/`update_at` foram modelados como `DateTime?`. Garanta que o tipo na tabela seja compatível (DATETIME ou TIMESTAMP) ou ajuste o schema.
- Filtros `LIKE` foram migrados para `contains` do Prisma, que é case-insensitive sensível ao collation do MySQL.

