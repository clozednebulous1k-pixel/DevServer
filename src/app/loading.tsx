import TetrisLoading from "@/components/ui/tetris-loader";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <TetrisLoading size="sm" speed="fast" loadingText="Carregando página..." />
    </div>
  );
}
