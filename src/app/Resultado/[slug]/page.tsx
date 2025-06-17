import capybaraLogo from "../../../../public/capivara.png"
import Image from "next/image";

interface QuestionResult {
  id: number;
  question_name: string;
  question_description: string;
  question_result: string;
  answer_result: string;
  remaining_time: string;
  isCorrect: boolean;
  remainingTimeSeconds: number;
}

export default async function ResultadosPage({params,}:{params: Promise<{ slug: number }>}) {
  const { slug } = await params
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Result/ResultByGroup/${slug}`, {
    cache: "no-store", 
  });
  const data: QuestionResult[] = await res.json();
  let score = 0;
  data.forEach((item)=>{
    if(item.isCorrect){
      score += 2000 + (1200 - item.remainingTimeSeconds)
    }
  })
  return (
    <div className="flex justify-center  min-h-screen bg-[#0f111a]">
      <div className="h-screen bg-[#0f111a] text-white p-6 font-mono w-2/3">
        <div className="mb-8 flex flex-col items-center justify-center border-b border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <Image src={capybaraLogo} alt="Logo" width={40} height={40} />
            <h1 className="text-3xl font-bold">Hackathon Capkaton</h1>
          </div>
        </div>
        <h2 className="text-2xl font-bold text text-center">
          Sua pontuação foi de: {score}
        </h2>
        <br/>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr >
              <th className="border border-gray-500 p-2">ID</th>
              <th className="border border-gray-500 p-2">Questão</th>
              <th className="border border-gray-500 p-2">Descrição</th>
              <th className="border border-gray-500 p-2">Resultado</th>
              <th className="border border-gray-500 p-2">Resposta</th>
              <th className="border border-gray-500 p-2">Gasto</th>
              <th className="border border-gray-500 p-2">Correto?</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
              >
                <td className="border border-gray-500 p-2 text-center">{item.id}</td>
                <td className="border border-gray-500 p-2">{item.question_name}</td>
                <td className="border border-gray-500 p-2">{item.question_description}</td>
                <td className="border border-gray-500 p-2">{item.question_result}</td>
                <td className="border border-gray-500 p-2">{item.answer_result}</td>
                <td className="border border-gray-500 p-2 text-center">{item.remaining_time}</td>
                <td className="border border-gray-500 p-2 text-center">
                  {item.isCorrect ? "✅ Sim" : "❌ Não"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    </div>
  );
}
