"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation'; 

const Login = () => {
  const router = useRouter();
  const [nomeEquipe, setNomeEquipe] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Login/logon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupName: nomeEquipe,
          playerOne: player1,
          playerTwo: player2,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }

      const groupId = await response.json();

      router.push(`/home/${groupId}`);
      //router.push(`/home/`)
    } catch (error) {
      alert("Ocorreu um erro inesperado no servidor. Por favor, informe a equipe Capkaton")
    }
  };

  return (
    <div
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
      <button onClick={handleClick} className="bg-blue-600 text-white p-2 rounded text-center" >
        Entrar
      </button>
    </div>
  );
};

export default Login;
