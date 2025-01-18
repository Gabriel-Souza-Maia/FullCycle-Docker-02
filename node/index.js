const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb',
}


const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');

  // Cria a tabela "people" caso não exista
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS people (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('Table "people" is ready.');

  // Insere um registro na tabela "people"
  const sqlInsert = `INSERT INTO people(name) VALUES('Lucas')`;
    connection.query(sqlInsert, (err, result) => {
      if (err) throw err;
      console.log('Record inserted');
    });
  });
});

app.get('/', (req, res) => {
  const sqlSelect = `SELECT name FROM people`;

  connection.query(sqlSelect, (err, results) => {
    if (err) {
      console.error('Erro ao buscar registros:', err);
      res.status(500).send('Erro ao buscar registros');
      return;
    }

    // Gera o HTML dinâmico com os nomes da tabela "people"
    let response = '<h1>Full Cycle Rocks!</h1>';
    response += '<ul>';
    results.forEach((row) => {
      response += `<li>${row.name}</li>`;
    });
    response += '</ul>';

    res.send(response);
  });
});

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});