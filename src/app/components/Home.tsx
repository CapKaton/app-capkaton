"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import Image from "next/image";
import capybaraLogo from "../../../public/capivara.png";
import Footer from "./Footer";
import { CodeSquare } from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
}
interface CommandResponse {
  error: string | null;
  stdout: string;
  stderr: string;
}

const LANGUAGES = ["javascript", "python", "java"];

export default function MathCodeChallenge(param: any) {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [minutesLeft, setMinutesLeft] = useState(20);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [questions, setQuestions] = useState<Challenge[]>([]);
  const [languagePerQuestion, setLanguagePerQuestion] = useState<{ [key: number]: string }>({});
  const [codes, setCodes] = useState<{ [key: number]: string }>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getQuestions();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (activeQuestion === null) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds === 0) {
          setMinutesLeft((prevMinutes) => {
            if (prevMinutes === 0) {
              clearInterval(timerRef.current!);
              setIsLocked(true);
              return 0;
            }
            setSecondsLeft(59);
            return prevMinutes - 1;
          });
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeQuestion]);

  const getQuestions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Challenge/getChallengeQuestion/1`);
      const apiResult: Challenge[] = await response.json();
      setQuestions(apiResult);

      const initialLang: { [key: number]: string } = {};
      const initialCodes: { [key: number]: string } = {};
      apiResult.forEach((q) => {
        initialLang[q.id] = "javascript";
        initialCodes[q.id] = q.starterCode["javascript"];
      });
      setLanguagePerQuestion(initialLang);
      setCodes(initialCodes);
    } catch (error) {
      alert("Erro ao carregar questões. Por favor, informe a equipe Capkaton.");
    }
  };

  const TestCode = async (language: string, code: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/CodeExecuter/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });

      const apiResult: CommandResponse = await response.json();

      if (apiResult.error) {
        alert(`Erro ao rodar seu código: ${apiResult.error}`);
        return;
      }

      alert(`Resultado:\n${apiResult.stdout}`);
    } catch (error) {
      alert("Erro inesperado ao executar o código.");
    }
  };

  const PostQuestios = async (
    questionId: number,
    questionAnswer: string,
    questionResult: string,
    timeSpent: string
  ) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Challenge/postChallenge/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: 1,
          groupId: Number(param.groupId),
          questionId,
          questionAnswer,
          questionResult,
          timeSpent,
        }),
      });
    } catch (error) {
      alert("Erro ao enviar questão. Por favor, informe a equipe Capkaton.");
    }
  };

  return (
    <div className="h-screen bg-[#0f111a] text-white p-6 font-mono w-2/3">
      <div className="mb-8 flex flex-col items-center justify-center border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <Image src={capybaraLogo} alt="Logo" width={40} height={40} />
          <h1 className="text-3xl font-bold">Hackathon Capkaton</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de Questões */}
        <div className="flex flex-col gap-4">
          {questions.map((question) => {
            const isDisabled = completedQuestions.includes(question.id);
            const isActive = activeQuestion === question.id;
            const lang = languagePerQuestion[question.id];
            if (question.id <= completedQuestions.length + 1) {
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
                    <p className="whitespace-pre-wrap text-gray-200 text-sm">{question.description}</p>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={(e) => {
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
            }
          })}
        </div>

        {/* Editor de Código */}
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
                onChange={(val) => setCodes({ ...codes, [activeQuestion]: val || "" })}
                theme="vs-dark"
                options={{ readOnly: isLocked }}
              />
              <div className="flex justify-between">
                <Button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => {
                    TestCode(languagePerQuestion[activeQuestion], codes[activeQuestion]);
                  }}
                >
                  Testar
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setCompletedQuestions((prev) => [...prev, activeQuestion]);
                    PostQuestios(
                      activeQuestion,
                      codes[activeQuestion],
                      languagePerQuestion[activeQuestion],
                      `${(20 - minutesLeft - 1).toString().padStart(2, "0")}:${(60 - secondsLeft).toString().padStart(2, "0")}`
                    );
                    setActiveQuestion(null);
                    setIsLocked(true);
                    setMinutesLeft(20);
                    setSecondsLeft(0);
                    if (timerRef.current) clearInterval(timerRef.current);
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
