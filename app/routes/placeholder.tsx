export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex-1 flex items-center justify-center h-full text-[#1e1b1c]">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-500">Página em construção.</p>
      </div>
    </div>
  );
}
