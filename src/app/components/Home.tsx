"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import Image from "next/image";
import capybaraLogo from "../../../public/capivara.png";
import Footer from "./Footer";

const MOCK_QUESTIONS = [
  {
    id: 1,
    title: "Soma de Vetores",
    description:
      "Dado um vetor de números inteiros, retorne a soma de todos os elementos.\nExemplo: [2, 5, 3] => 10",
    starterCode: {
      javascript: `function somaVetor(arr) {\n  // implemente aqui\n}`,
      python: `def soma_vetor(arr):\n    # implemente aqui`,
      java: `public int somaVetor(int[] arr) {\n  // implemente aqui\n}`,
      cpp: `int somaVetor(vector<int> arr) {\n  // implemente aqui\n}`,
    },
  },
  {
    id: 2,
    title: "Diagonal Principal da Matriz",
    description:
      "Dada uma matriz quadrada, calcule a soma dos elementos da diagonal principal.\nExemplo: [[1,2,3],[4,5,6],[7,8,9]] => 15",
    starterCode: {
      javascript: `function somaDiagonal(matriz) {\n  // implemente aqui\n}`,
      python: `def soma_diagonal(matriz):\n    # implemente aqui`,
      java: `public int somaDiagonal(int[][] matriz) {\n  // implemente aqui\n}`,
      cpp: `int somaDiagonal(vector<vector<int>> matriz) {\n  // implemente aqui\n}`,
    },
  },
  {
    id: 3,
    title: "Maior Divisor Comum",
    description:
      "Crie uma função que recebe dois números inteiros e retorna o maior divisor comum entre eles.\nExemplo: (30, 45) => 15",
    starterCode: {
      javascript: `function mdc(a, b) {\n  // implemente aqui\n}`,
      python: `def mdc(a, b):\n    # implemente aqui`,
      java: `public int mdc(int a, int b) {\n  // implemente aqui\n}`,
      cpp: `int mdc(int a, int b) {\n  // implemente aqui\n}`,
    },
  },
];

const LANGUAGES = ["javascript", "python", "java", "cpp"];

export default function MathCodeChallenge() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [minutesLeft, setMinutesLeft] = useState(20);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const [codes, setCodes] = useState(() => {
    const initial: { [key: number]: string } = {};
    MOCK_QUESTIONS.forEach(
      (q) => (initial[q.id] = q.starterCode["javascript"])
    );
    return initial;
  });

  const [languagePerQuestion, setLanguagePerQuestion] = useState(() => {
    const initial: { [key: number]: string } = {};
    MOCK_QUESTIONS.forEach((q) => (initial[q.id] = "javascript"));
    return initial;
  });

  useEffect(() => {
    if (activeQuestion === null) return;
    if (timer) clearInterval(timer);

    const newTimer = setInterval(() => {
      setSecondsLeft((prevSec) => {
        if (prevSec === 0) {
          if (minutesLeft === 0) {
            clearInterval(newTimer);
            setIsLocked(true);
            return 0;
          } else {
            setMinutesLeft((m) => m - 1);
            return 59;
          }
        }
        return prevSec - 1;
      });
    }, 1000);

    setTimer(newTimer);
    return () => clearInterval(newTimer);
  }, [activeQuestion]);

  return (
    <div className="h-screen  bg-[#0f111a] text-white p-6 font-mono">
      <div className="mb-8 flex flex-col items-center justify-center border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <Image src={capybaraLogo} alt="Logo" width={40} height={40} />
          <h1 className="text-3xl font-bold">Hackathon Capkaton</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Questões */}
        <div className="flex flex-col gap-4">
          {MOCK_QUESTIONS.map((question) => {
            const isDisabled = completedQuestions.includes(question.id);
            const isActive = activeQuestion === question.id;
            const lang = languagePerQuestion[question.id];

            return (
              <Card key={question.id} className="bg-[#1a1d2e]">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg text-gray-200 font-semibold">{question.title}</h2>
                    <select
                      className="bg-[#2a2e3f] border border-gray-500 px-3 py-1 rounded text-white"
                      value={lang}
                      onChange={(e) => {
                        const newLang = e.target.value;
                        setLanguagePerQuestion({
                          ...languagePerQuestion,
                          [question.id]: newLang,
                        });
                        setCodes({
                          ...codes,
                          [question.id]: question.starterCode[newLang as keyof typeof question.starterCode],
                        });
                      }}
                      disabled={!isActive || isLocked}
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l} value={l}>
                          {l.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-200 text-sm">
                    {question.description}
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      if (!isDisabled) {
                        setActiveQuestion(question.id);
                        setIsLocked(false);
                        setMinutesLeft(20);
                        setSecondsLeft(0);
                      }
                    }}
                    disabled={isDisabled}
                  >
                    {isDisabled ? "Finalizada" : "Iniciar Resolução"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Prompt/editor */}
        <div className="flex flex-col gap-4">
          {activeQuestion && !completedQuestions.includes(activeQuestion) && (
            <>
              <div className="text-green-400 text-center text-xl">
                ⏳ Tempo restante: {minutesLeft.toString().padStart(2, "0")}:
                {secondsLeft.toString().padStart(2, "0")}
              </div>
              <Editor
                height="400px"
                value={codes[activeQuestion]}
                language={languagePerQuestion[activeQuestion]}
                onChange={(val) =>
                  setCodes({ ...codes, [activeQuestion]: val || "" })
                }
                theme="vs-dark"
                options={{ readOnly: isLocked }}
              />
              <div className="flex justify-end">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setCompletedQuestions((prev) => [...prev, activeQuestion]);
                    setActiveQuestion(null);
                    setIsLocked(true);
                    setMinutesLeft(20);
                    setSecondsLeft(0);
                    if (timer) clearInterval(timer);
                  }}
                >
                  Enviar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
