import { useEffect, useState } from 'react';
import './App.css';
import {getAllPokemon} from './utils/pokemon.js';
import {getPokemon} from './utils/pokemon.js';
import Card from './components/Card/Card';

function App() {

  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  // ポケモンデータ取得状態変数(true|false)
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  
  useEffect(() => {
    const feachPokemonData = async () => {
      // 全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);

      // 各ポケモンの詳細データを取得
      // console.log(res.results);
      loadPokemon(res.results);

      setLoading(false);
    };

    feachPokemonData();
  },[])

  // 各ポケモンの詳細データを取得
  const  loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(

      data.map((pokemom) => {

        // 各ポケモンの詳細をフェッチ
        let pokemonRecord = getPokemon(pokemom.url);

        return pokemonRecord;
      })
    );

    setPokemonData(_pokemonData);
  };

  return (
    <div className="App">

      {loading ? (
          <h1>ロード中・・・</h1>
      ) : (
        <>
          <div className='pokemonCardContainer'>
            {
              pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemom={pokemon} />
              })
            }
          </div>
        </>
      )}
    </div>
  );
}

export default App;
