import app from "./app.js";
import 'dotenv/config';

const PORT = process.env.PORT;

// fazer a conexao

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`)
})