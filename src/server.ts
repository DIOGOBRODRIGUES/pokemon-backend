import express from 'express';
import cors from 'cors';
import { getPokemonData } from './services/pokemonService';
import { calculateBattle, PokemonType } from './services/battleService';


// 1. Removemos a palavra 'async' da função de callback da rota

const app = express();
app.use(cors());
//Isso ensina o seu servidor a entender arquivos no formato JSON caso alguém envie dados para ele
app.use(express.json());

//Os dois pontos (:) significam que name é uma variável (um parâmetro de rota).
app.get('/pokemon/:name', (req, res) => {
  const { name } = req.params;

  // 2. Chamamos o serviço e encadeamos o .then() e o .catch()

  /*
Pense no .then() como uma entrega de correio. A função getPokemonData(name) fez o pedido. Quando a caixa chega (quando a busca dá certo), o .then() precisa entregar essa caixa para alguém abrir.

O JavaScript pega os dados que chegaram e os injeta automaticamente dentro desse parâmetro que está entre os parênteses.

  */
  getPokemonData(name)
    .then(pokemon => {
      // Se a Promise for resolvida com sucesso, devolvemos o JSON
      return res.json(pokemon);
    })
    .catch(error => {
      // Se a Promise for rejeitada (Error Bubbling), capturamos aqui e devolvemos o 404
      return res.status(404).json({ error: 'Pokémon não encontrado' });
    });
});



app.post('/battle', (req, res) => {
  const { attacker, defender } = req.body;

  // Uma validação simples (pode ser evoluída para Zod depois)
  if (!attacker || !defender) {
    return res.status(400).json({ error: "Dados dos lutadores são obrigatórios" });
  }

  const result = calculateBattle(attacker, defender);

  return res.json({
    battleLog: `${attacker.name} atacou ${defender.name}!`,
    ...result
  });
});


app.get('/pokemon/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const pokemon = await getPokemonData(name);
    return res.json(pokemon);
  } catch (error) {
    return res.status(404).json({ error: 'Pokémon não encontrado' });
  }
});

const PORT = 3333;
app.listen(PORT, () => console.log(`🚀 PokeServer rodando em http://localhost:${PORT}`));