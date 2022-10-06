import { useEffect, useState } from 'react';
import './App.css';
import {getAllPokemon} from './utils/pokemon.js';
import {getPokemon} from './utils/pokemon.js';
import Card from './components/Card/Card';
import Navbar from './components/Navbar/Navbar';


function App() {

  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  // ポケモンデータ取得状態変数(true|false)
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextUrl] = useState("");
  const [prevURL, setPrevUrl] = useState("");
  
  useEffect(() => {
    const feachPokemonData = async () => {
      // 全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);

      // 各ポケモンの詳細データを取得
      console.log(res.next);

      // レスポンスから前後のページURLを取得して、設定する
      setNextUrl(res.next);
      setPrevUrl(res.previous);
      loadPokemon(res.results);

      setLoading(false);
    };

    feachPokemonData();
  },[])

  // 各ポケモンの詳細データを取得
  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(

      data.map((pokemom) => {

        // 各ポケモンの詳細をフェッチ
        let pokemonRecord = getPokemon(pokemom.url);
        // console.log(pokemonRecord);
        return pokemonRecord;
      })
    );

    setPokemonData(_pokemonData);
  };

  const handlePrevPage = async () => {

    if (!prevURL)
    {
      return;
    }

    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);

    setNextUrl(data.next);
    setPrevUrl(data.previous);

    setLoading(false);

  };

  const handleNextPage = async () => {
 
    setLoading(true);
 
    let data = await getAllPokemon(nextURL);
    // console.log(data);
    await loadPokemon(data.results);
 
    setNextUrl(data.next);
    setPrevUrl(data.previous);

    setLoading(false);
  };

  return (
    <>
      <Navbar />
        <div className="App">

          {loading ? (
              <h1>ロード中・・・</h1>
          ) : (
            <>
              <div className='pokemonCardContainer'>
                {
                  pokemonData.map((pokemon, i) => {
                    return <Card key={i} pokemon={pokemon} />
                  })
                }
              </div>
              <div className='btn'>
                <button onClick={handlePrevPage}>前へ</button>
                <button onClick={handleNextPage}>次へ</button>
              </div>
            </>
          )}
        </div>
    </>
  );
}

export default App;
