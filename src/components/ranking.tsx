"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/lib/store";
import { Trophy, Medal, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface RankingEntry {
  rank: number;
  userId: string;
  name: string;
  score: number;
  total: number;
  timeTaken: number;
  percentage: number;
  createdAt: string;
}

export function Ranking() {
  const { user } = useAppStore();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quiz/ranking")
      .then((res) => res.json())
      .then((data) => {
        // API returns { rankings: [...] }
        const entries = Array.isArray(data) ? data : data.rankings || [];
        setRanking(entries);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-5 w-5 text-amber-500" />;
    if (position === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (position === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Ranking</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Classificação dos melhores participantes do quiz
        </p>
      </div>

      {ranking.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma pontuação ainda</h3>
            <p className="text-muted-foreground text-sm">
              Complete o quiz para aparecer no ranking!
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">#</TableHead>
                      <TableHead>Participante</TableHead>
                      <TableHead className="text-center">Pontuação</TableHead>
                      <TableHead className="text-center">%</TableHead>
                      <TableHead className="text-center">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Tempo
                      </TableHead>
                      <TableHead className="text-center">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Data
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ranking.map((entry) => {
                      const isCurrentUser = user?.id === entry.userId;
                      return (
                        <TableRow
                          key={`${entry.userId}-${entry.createdAt}`}
                          className={
                            isCurrentUser
                              ? "bg-emerald-50/50 dark:bg-emerald-900/10"
                              : ""
                          }
                        >
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              {getPositionIcon(entry.rank) || (
                                <span className="text-sm text-muted-foreground">
                                  {entry.rank}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {entry.name}
                              </span>
                              {isCurrentUser && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                >
                                  Você
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-semibold text-sm">
                              {entry.score}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              /{entry.total}
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-sm font-medium">
                            {entry.percentage}%
                          </TableCell>
                          <TableCell className="text-center text-sm text-muted-foreground">
                            {formatTime(entry.timeTaken)}
                          </TableCell>
                          <TableCell className="text-center text-sm text-muted-foreground">
                            {formatDate(entry.createdAt)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
