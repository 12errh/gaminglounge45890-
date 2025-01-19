import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OnlinePlayersListProps {
  players: { username: string }[];
}

export function OnlinePlayersList({ players }: OnlinePlayersListProps) {
  return (
    <div className="mb-4">
      <h2 className="text-xl mb-2 flex items-center text-purple-300">
        <Users className="mr-2" /> Online Players ({players.length})
      </h2>
      {players.map((player, index) => (
        <motion.div
          key={player.username}
          className="flex items-center mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${player.username}`} />
                  <AvatarFallback>{player.username.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{player.username}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-purple-100">{player.username}</span>
          <div className="w-2 h-2 rounded-full ml-2 bg-green-500" />
        </motion.div>
      ))}
    </div>
  );
}

