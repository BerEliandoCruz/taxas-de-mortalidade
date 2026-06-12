"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, Trophy, RotateCcw, ArrowRight } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

type QuizState = "playing" | "finished";

export function Quiz() {
  const { user } = useAppStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizState, setQuizState] = useState<QuizState>("playing");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedScore, setHasSavedScore] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetch("/api/quiz")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setIsLoading(false);
        startTimer();
      })
      .catch(() => setIsLoading(false));

    return () => stopTimer();
  }, [startTimer, stopTimer]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === questions[currentQuestion].correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Auto-advance after 2.5 seconds
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        stopTimer();
        setQuizState("finished");
      }
    }, 2500);
  };

  const handleSaveScore = async () => {
    if (!user || hasSavedScore) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/quiz/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          score,
          total: questions.length,
          timeTaken: elapsedTime,
        }),
      });
      if (res.ok) {
        setHasSavedScore(true);
        toast.success("Pontuação salva com sucesso!");
      }
    } catch {
      toast.error("Erro ao salvar pontuação");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsAnswered(false);
    setElapsedTime(0);
    setQuizState("playing");
    setHasSavedScore(false);
    startTimer();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState === "finished") {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6"
            >
              <Trophy className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </motion.div>

            <h2 className="text-2xl font-bold mb-2">Quiz Finalizado!</h2>
            <p className="text-muted-foreground mb-6">
              Veja como você se saiu
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
                {score}/{questions.length}
              </div>
              <div className="text-lg text-muted-foreground">
                {percentage}% de acertos
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatTime(elapsedTime)}
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {score} corretas
                </div>
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-red-500" />
                  {questions.length - score} erradas
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <Button
                  onClick={handleSaveScore}
                  disabled={isSaving || hasSavedScore}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {hasSavedScore ? "✓ Pontuação Salva" : isSaving ? "Salvando..." : "Salvar Pontuação no Ranking"}
                </Button>
                <Button variant="outline" onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Jogar Novamente
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Quiz</h2>
          <p className="text-muted-foreground text-sm">
            Teste seus conhecimentos sobre mortalidade no Brasil
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {formatTime(elapsedTime)}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            Questão {currentQuestion + 1} de {questions.length}
          </span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            {score} acerto{score !== 1 ? "s" : ""}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg leading-relaxed">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((option, index) => {
                let buttonStyle =
                  "border-border hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10";

                if (isAnswered) {
                  if (index === question.correctIndex) {
                    buttonStyle =
                      "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
                  } else if (index === selectedAnswer && index !== question.correctIndex) {
                    buttonStyle =
                      "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
                  } else {
                    buttonStyle = "border-border opacity-50";
                  }
                } else if (selectedAnswer === index) {
                  buttonStyle =
                    "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-sm font-medium">{option}</span>
                      {isAnswered && index === question.correctIndex && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto flex-shrink-0" />
                      )}
                      {isAnswered &&
                        index === selectedAnswer &&
                        index !== question.correctIndex && (
                          <XCircle className="h-5 w-5 text-red-500 ml-auto flex-shrink-0" />
                        )}
                    </div>
                  </button>
                );
              })}

              {/* Explanation */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Explicação:</span>{" "}
                        {question.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
