import Login from "./components/Login";
import Link from "next/link";
import Image from 'next/image';



export default function Page() {
  return (
    <main className="flex flex-row justify-around items-center bg-[#0f111a] min-h-screen">
      <div className="p-4 flex content-around items-center">
        <Image
          src="/logo.png"
          alt="Logo do Hackathon"
          width={660}
          height={330}
          />
      </div>
      <div className="flex flex-row justify-end items-center">
        <Login />
      </div>
    </main>
  );
}