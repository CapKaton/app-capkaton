"use client";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
  const [nomeEquipe, setNomeEquipe] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert(`\Equipe: ${nomeEquipe}\nPlayer 1: ${player1}\nPlayer 2: ${player2}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-xs mx-auto mt-10 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-2 text-center">Cadastre-se para Codar</h2>
      <input
        type=""
        placeholder="Nome da equipe"
        value={nomeEquipe}
        onChange={e => setNomeEquipe(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="email"
        placeholder="Player 1"
        value={player1}
        onChange={e => setPlayer1(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type=""
        placeholder="Player 2"
        value={player2}
        onChange={e => setPlayer2(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <Link type="submit" className="bg-blue-600 text-white p-2 rounded text-center
" href="/home">
        Entrar
      </Link>
    </form>
  );
};

export default Login;
