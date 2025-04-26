'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTotem } from '@/hooks/useTotem';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ROUTES } from '@/constants';
import { Layout, Cronograma } from '@/types';
import { EventColor } from '@/types/schedule';
import { nanoid } from 'nanoid';
import ProtectedRoute from '@/components/ProtectedRoute';

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Icons
import { ArrowLeft, Plus, Clock, Trash, Image, Video, Type, AlertCircle, Pencil } from 'lucide-react';
import { ColorPicker } from '@/components/schedule/ColorPicker';

type TipoEvento = 'imagem' | 'video' | 'texto';

interface NovoEvento {
  nome: string;
  descricao: string;
  horarioInicio: string;
  cor?: EventColor;
}

export default function LayoutCronograma({ 
  params 
}: { 
  params: Promise<{ id: string; layoutId: string }> 
}) {
  const { id, layoutId } = use(params);
  const router = useRouter();
  const { totem, mutate } = useTotem(id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novoEvento, setNovoEvento] = useState<NovoEvento>({
    nome: '',
    descricao: '',
    horarioInicio: ''
  });
  const [eventoEditando, setEventoEditando] = useState<Cronograma | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const layout = totem?.layouts?.find(l => l.id === layoutId);

  const handleCreateEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totem || !layout) return;

    try {
      const newEvento: Cronograma = {
        id: nanoid(),
        nome: novoEvento.nome,
        descricao: novoEvento.descricao,
        horarioInicio: novoEvento.horarioInicio,
        cor: novoEvento.cor as EventColor | undefined
      };

      const updatedLayouts = totem.layouts.map(l => {
        if (l.id === layoutId) {
          return {
            ...l,
            cronograma: [...l.cronograma, newEvento]
          };
        }
        return l;
      });

      await updateDoc(doc(db, 'totens', id), {
        layouts: updatedLayouts
      });

      mutate({
        ...totem,
        layouts: updatedLayouts
      }, false);

      setNovoEvento({ 
        nome: '',
        descricao: '',
        horarioInicio: '',
        cor: undefined
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  const handleUpdateEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totem || !layout || !eventoEditando) return;

    try {
      const updatedLayouts = totem.layouts.map(l => {
        if (l.id === layoutId) {
          return {
            ...l,
            cronograma: l.cronograma.map(evento => 
              evento.id === eventoEditando.id 
                ? eventoEditando
                : evento
            )
          };
        }
        return l;
      });

      await updateDoc(doc(db, 'totens', id), {
        layouts: updatedLayouts
      });

      mutate({
        ...totem,
        layouts: updatedLayouts
      }, false);

      setIsEditDialogOpen(false);
      setEventoEditando(null);
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
    }
  };

  const handleToggleDestaque = async (evento: Cronograma) => {
    if (!totem || !layout) return;

    try {
      const updatedLayouts = totem.layouts.map(l => {
        if (l.id === layoutId) {
          return {
            ...l,
            cronograma: l.cronograma.map(e => 
              e.id === evento.id 
                ? { ...e, destaque: !e.destaque }
                : e
            )
          };
        }
        return l;
      });

      await updateDoc(doc(db, 'totens', id), {
        layouts: updatedLayouts
      });

      mutate({
        ...totem,
        layouts: updatedLayouts
      }, false);
    } catch (error) {
      console.error('Erro ao atualizar destaque:', error);
    }
  };

  const eventoOrdenados = layout?.cronograma.sort((a, b) => 
    a.horarioInicio.localeCompare(b.horarioInicio)
  ) || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-[oklch(1_0_0_/_0.05)] bg-card">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(ROUTES.TOTEM_ADMIN(id))}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-lg font-medium">
                {layout?.nome || 'Carregando...'}
              </h1>
            </div>
          </div>
        </header>

        <main className="container px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Cronograma</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border border-[oklch(1_0_0_/_0.05)] hover:bg-secondary hover:border-[oklch(1_0_0_/_0.05)]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="card-subtle bg-card border-0 sm:max-w-[425px]">
                <DialogHeader className="space-y-3 pb-2">
                  <DialogTitle className="text-xl font-medium">
                    Adicionar novo evento
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure as informações do evento
                  </p>
                </DialogHeader>

                <form onSubmit={handleCreateEvento} className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Nome do evento
                      </label>
                      <Input
                        value={novoEvento.nome}
                        onChange={(e) => setNovoEvento({...novoEvento, nome: e.target.value})}
                        placeholder="Ex: Boas-vindas"
                        className="bg-background border border-[oklch(1_0_0_/_0.05)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[oklch(1_0_0_/_0.1)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Horário de início
                      </label>
                      <Input
                        type="time"
                        value={novoEvento.horarioInicio}
                        onChange={(e) => setNovoEvento({...novoEvento, horarioInicio: e.target.value})}
                        className="bg-background border border-[oklch(1_0_0_/_0.05)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[oklch(1_0_0_/_0.1)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Descrição
                      </label>
                      <Input
                        value={novoEvento.descricao}
                        onChange={(e) => setNovoEvento({...novoEvento, descricao: e.target.value})}
                        placeholder="Ex: Mensagem de boas-vindas para os visitantes"
                        className="bg-background border border-[oklch(1_0_0_/_0.05)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[oklch(1_0_0_/_0.1)]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Cor do Evento
                      </label>
                      <ColorPicker
                        value={novoEvento.cor || 'purple' as EventColor}
                        onChange={(cor: EventColor) => setNovoEvento({ ...novoEvento, cor })}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="border border-[oklch(1_0_0_/_0.05)] hover:bg-secondary hover:border-[oklch(1_0_0_/_0.05)]"
                    >
                      Criar Evento
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {eventoOrdenados.map((evento) => (
              <Card key={evento.id} className="card-subtle bg-card">
                <CardContent className="flex items-center justify-between py-6">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{evento.nome}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {evento.horarioInicio}
                      </p>
                      <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => {
                        setEventoEditando(evento);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${
                        evento.destaque 
                          ? 'text-yellow-500 bg-yellow-500/10' 
                          : 'text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10'
                      }`}
                      onClick={() => handleToggleDestaque(evento)}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="card-subtle bg-card border-0 sm:max-w-[425px]">
          <DialogHeader className="space-y-3 pb-2">
            <DialogTitle className="text-xl font-medium">
              Editar evento
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Modifique as informações do evento
            </p>
          </DialogHeader>

          <form onSubmit={handleUpdateEvento} className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nome do evento
                </label>
                <Input
                  value={eventoEditando?.nome || ''}
                  onChange={(e) => setEventoEditando(prev => prev ? {...prev, nome: e.target.value} : null)}
                  placeholder="Ex: Boas-vindas"
                  className="bg-background border border-[oklch(1_0_0_/_0.05)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[oklch(1_0_0_/_0.1)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Horário de início
                </label>
                <Input
                  type="time"
                  value={eventoEditando?.horarioInicio || ''}
                  onChange={(e) => setEventoEditando(prev => prev ? {...prev, horarioInicio: e.target.value} : null)}
                  className="bg-background border border-[oklch(1_0_0_/_0.05)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[oklch(1_0_0_/_0.1)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Descrição
                </label>
                <Input
                  value={eventoEditando?.descricao || ''}
                  onChange={(e) => setEventoEditando(prev => prev ? {...prev, descricao: e.target.value} : null)}
                  placeholder="Ex: Mensagem de boas-vindas para os visitantes"
                  className="bg-background border border-[oklch(1_0_0_/_0.05)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[oklch(1_0_0_/_0.1)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cor do Evento
                </label>
                <ColorPicker
                  value={eventoEditando?.cor || 'purple' as EventColor}
                  onChange={(cor: EventColor) => setEventoEditando(prev => prev ? {...prev, cor} : null)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEventoEditando(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="border border-[oklch(1_0_0_/_0.05)] hover:bg-secondary hover:border-[oklch(1_0_0_/_0.05)]"
              >
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
} 