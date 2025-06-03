import Home from "../../components/Home";


export default async function Homee({
  params,
}: {
  params: Promise<{ slug: number }>
}) {
    const { slug } = await params
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f111a]">
      <Home groupId={slug} />
    </div>
  );
}
