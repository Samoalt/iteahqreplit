import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WatchlistButtonProps {
  lotId: string;
  isWatched?: boolean;
}

export default function WatchlistButton({ lotId, isWatched = false }: WatchlistButtonProps) {
  const [watched, setWatched] = useState(isWatched);
  const { toast } = useToast();

  const handleWatchlist = () => {
    setWatched(!watched);
    toast({
      title: watched ? "Removed from Watchlist" : "Added to Watchlist",
      description: `Lot ${lotId} ${watched ? "removed from" : "added to"} your watchlist`,
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleWatchlist}
      className={`${watched ? 'text-red-500 border-red-200' : 'text-slate-500'}`}
    >
      <Heart className={`w-4 h-4 ${watched ? 'fill-current' : ''}`} />
    </Button>
  );
}