'use client';

import { useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useTotem } from '@/hooks/useTotem';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ROUTES } from '@/constants';
import { Layout } from '@/types';
import { nanoid } from 'nanoid';
import ProtectedRoute from '@/components/ProtectedRoute';

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Icons
import { ArrowLeft, Plus, Settings, Clock, Check, X } from 'lucide-react';

export default function TotemAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { totem, loading, mutate } = useTotem(id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novoLayout, setNovoLayout] = useState({ nome: '' });

  const handleCreateLayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totem) return;

    try {
      const newLayout: Layout = {
        id: nanoid(),
        nome: novoLayout.nome,
        ativo: false,
        cronograma: []
      };

      const updatedLayouts = [...(totem.layouts || []), newLayout];
      
      await updateDoc(doc(db, 'totens', id), {
        layouts: updatedLayouts
      });

      mutate({
        ...totem,
        layouts: updatedLayouts
      }, false);

      setNovoLayout({ nome: '' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar layout:', error);
    }
  };

  const handleSelectLayout = async (layoutId: string) => {
    if (!totem) return;

    try {
      const updatedLayouts = totem.layouts.map((layout: Layout) => ({
        ...layout,
        ativo: layout.id === layoutId
      }));

      await updateDoc(doc(db, 'totens', id), {
        layouts: updatedLayouts
      });

      mutate({
        ...totem,
        layouts: updatedLayouts
      }, false);
    } catch (error) {
      console.error('Erro ao selecionar layout:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-[oklch(1_0_0_/_0.05)] bg-card">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(ROUTES.PAINEL)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-lg font-medium">
                {totem?.nome || 'Carregando...'}
              </h1>
            </div>
          </div>
        </header>

        <main className="container px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Layouts</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border border-[oklch(1_0_0_/_0.05)] hover:bg-secondary hover:border-[oklch(1_0_0_/_0.05)]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Layout
                </Button>
              </DialogTrigger>
              <DialogContent className="card-subtle bg-card border-0 sm:max-w-[425px]">
                <DialogHeader className="space-y-3 pb-2">
                  <DialogTitle className="text-xl font-medium">
                    Adicionar novo layout
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure o nome do layout
                  </p>
                </DialogHeader>

                <form onSubmit={handleCreateLayout} className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="nome">
                      Nome do layout
                    </label>
                    <Input
                      id="nome"
                      placeholder="Ex: Layout Principal"
                      value={novoLayout.nome}
                      onChange={(e) => setNovoLayout({ nome: e.target.value })}
                      className="bg-background border border-[oklch(1_0_0_/_0.05)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[oklch(1_0_0_/_0.1)]"
                    />
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
                      Criar Layout
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {totem?.layouts?.map((layout: Layout) => (
              <Card 
                key={layout.id} 
                className={`card-subtle transition-all duration-200 ${
                  layout.ativo 
                    ? 'bg-card border-2 border-primary/30 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]' 
                    : 'bg-card hover:bg-card/80 border border-[oklch(1_0_0_/_0.05)] cursor-pointer'
                }`}
                onClick={() => handleSelectLayout(layout.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg font-medium">
                    <span>{layout.nome}</span>
                    {layout.ativo && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Ativo
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{layout.cronograma.length} eventos programados</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full mt-4 ${
                      layout.ativo 
                        ? 'hover:bg-primary/10' 
                        : 'hover:bg-secondary'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/painel/totem/${id}/layout/${layout.id}`);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Gerenciar Cronograma
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 