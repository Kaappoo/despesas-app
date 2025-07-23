import express, { json } from 'express';
import { writeFile, readFile } from 'fs';
import cors from 'cors';
const app = express();
const PORT = 3001;

app.use(cors());
app.use(json());

app.post('/salvar-dados', (req, res) => {
  const dados = req.body;
  writeFile('./dados.json', JSON.stringify(dados, null, 2), (err) => {
    if (err) {
      console.error('Erro ao salvar:', err);
      return res.status(500).send('Falha ao salvar os dados');
    }
    res.send('Dados salvos com sucesso!');
  });
});

app.get('/buscar-dados', (req, res) => {
  readFile('./dados.json', 'utf8', (err, data) => {
    if(err){
      if (err.code != 'ENOENT') {
        console.error('Erro ao ler:', err);
        return res.status(500).send('Falha ao ler os dados');
      }
      if (err.code == 'ENOENT') {
        console.log('Arquivo dados.json não encontrado, criando...');
        const initialData = {salary: 100, dispenses: []}; // Conteúdo inicial para o arquivo (array vazio)
        writeFile('./dados.json', JSON.stringify(initialData), (err) => {
          if(err) {
            console.error('Erro ao criar o arquivo dados.json:', writeError);
            return res.status(500).send('Falha ao criar o arquivo de dados');
          }
          console.log('Arquivo dados.json criado com sucesso.');
          res.json(initialData); // Retorna os dados iniciais vazios
        });
      }
    } else {
      try {
        const parsedData = JSON.parse(data);
        res.json(parsedData);
      } catch (parseError) {
        console.error('Erro ao fazer parse:', parseError);
        res.status(500).send('Erro ao interpretar os dados');
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
