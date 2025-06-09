import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { SendHorizontal, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { taskService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const task = await taskService.generateTask(user.id, input);
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: `✅ Tarefa criada com sucesso!\n\nTítulo: ${task.title}\nDescrição: ${task.description}\nData: ${new Date(task.dueDate).toLocaleString()}\nPrioridade: ${task.priority}` 
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: 'Tarefa criada',
        description: 'Sua tarefa foi criada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao gerar tarefa:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a tarefa. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl h-[calc(100vh-6rem)]">
      <Card className="flex flex-col h-full bg-background border-none shadow-none">
        <div className="p-4 text-center border-b">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            Priority Pulse Assistant
          </h1>
          <p className="text-muted-foreground mt-2">Crie suas tarefas usando linguagem natural</p>
        </div>

        <ScrollArea className="flex-1 px-4 py-8">
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.length === 0 && (
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Exemplos de comandos</h2>
                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    className="text-left h-auto p-4"
                    onClick={() => setInput("Crie uma tarefa para reunião com o time de desenvolvimento amanhã às 14h")}>
                    "Crie uma tarefa para reunião com o time de desenvolvimento amanhã às 14h"
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left h-auto p-4"
                    onClick={() => setInput("Agende uma consulta médica para próxima segunda-feira às 10h da manhã")}>
                    "Agende uma consulta médica para próxima segunda-feira às 10h da manhã"
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left h-auto p-4"
                    onClick={() => setInput("Criar tarefa urgente: Enviar relatório de vendas até sexta-feira")}
                  >
                    "Criar tarefa urgente: Enviar relatório de vendas até sexta-feira"
                  </Button>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex gap-3 items-start"
              >
                {message.role === 'assistant' && <Bot className="h-8 w-8 mt-1 text-primary" />}
                <div
                  className={`flex-1 rounded-lg p-4 ${message.role === 'user' ? 'bg-primary/10 ml-12' : 'bg-muted'}`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
          <div className="relative max-w-3xl mx-auto">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Descreva sua tarefa em linguagem natural..."
              disabled={isLoading}
              className="min-h-[60px] w-full pr-20 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="absolute bottom-2 right-2"
              size="icon"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Pressione Enter para enviar, Shift + Enter para nova linha
          </p>
        </form>
      </Card>
    </div>
  );
};

export default ChatPage;