'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Totem } from '@/types';
import { ROUTES } from '@/constants';
import ProtectedRoute from '@/components/ProtectedRoute';

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Icons
import { MonitorIcon, SmartphoneIcon, PlusIcon, TrashIcon, SettingsIcon, LogOutIcon, EyeIcon } from 'lucide-react';

export default function Painel() {
  const [totens, setTotens] = useState<Totem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novoTotem, setNovoTotem] = useState({ nome: '', tipo: 'tv' });
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    fetchTotens();
  }, []);

  const fetchTotens = async () => {
    const querySnapshot = await getDocs(collection(db, 'totens'));
    const totensData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Totem[];
    setTotens(totensData);
  };

  const handleCreateTotem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'totens'), {
        nome: novoTotem.nome,
        tipo: novoTotem.tipo,
        cronograma: []
      });
      setNovoTotem({ nome: '', tipo: 'tv' });
      setIsDialogOpen(false);
      fetchTotens();
    } catch (error) {
      console.error('Erro ao criar totem:', error);
    }
  };

  const handleDeleteTotem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'totens', id));
      fetchTotens();
    } catch (error) {
      console.error('Erro ao deletar totem:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-[oklch(1_0_0_/_0.05)] bg-card">
          <div className="container flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-medium">Painel de Controle</h1>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-background"
              onClick={signOut}
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        <main className="container px-4 py-8 bg-background/95">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Meus Totens</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border border-[oklch(1_0_0_/_0.05)] hover:bg-secondary hover:border-[oklch(1_0_0_/_0.05)]"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Novo Totem
                </Button>
              </DialogTrigger>
              <DialogContent className="card-subtle bg-card border-0 sm:max-w-[425px]">
                <DialogHeader className="space-y-3 pb-2">
                  <DialogTitle className="text-xl font-medium">
                    Adicionar novo totem
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure as informações básicas do totem
                  </p>
                </DialogHeader>

                <form onSubmit={handleCreateTotem} className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="nome">
                        Nome do totem
                      </label>
                      <Input
                        id="nome"
                        placeholder="Ex: Totem do Hall"
                        value={novoTotem.nome}
                        onChange={(e) => setNovoTotem({...novoTotem, nome: e.target.value})}
                        className="bg-background border border-[oklch(1_0_0_/_0.05)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[oklch(1_0_0_/_0.1)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="tipo">
                        Tipo de exibição
                      </label>
                      <Select
                        value={novoTotem.tipo}
                        onValueChange={(value) => setNovoTotem({...novoTotem, tipo: value as 'tv' | 'vertical'})}
                      >
                        <SelectTrigger 
                          id="tipo"
                          className="bg-background border border-[oklch(1_0_0_/_0.05)] focus:ring-0 focus:ring-offset-0 focus:border-[oklch(1_0_0_/_0.1)]"
                        >
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-[oklch(1_0_0_/_0.05)]">
                          <SelectItem value="tv">TV Horizontal</SelectItem>
                          <SelectItem value="vertical">Totem Vertical</SelectItem>
                        </SelectContent>
                      </Select>
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
                      Criar Totem
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {totens.map((totem) => (
              <Card key={totem.id} className="card-subtle bg-card relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleDeleteTotem(totem.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>

                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    {totem.tipo === 'tv' ? (
                      <MonitorIcon className="h-5 w-5" />
                    ) : (
                      <SmartphoneIcon className="h-5 w-5" />
                    )}
                    {totem.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tipo: {totem.tipo === 'tv' ? 'TV Horizontal' : 'Totem Vertical'}
                  </p>
                  <div className="flex justify-between gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 bg-[hsl(var(--card-lighter))] hover:bg-[hsl(var(--card-lighter))/80]"
                      onClick={() => router.push(ROUTES.TOTEM_ADMIN(totem.id))}
                    >
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Gerenciar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border border-[oklch(1_0_0_/_0.05)] hover:bg-secondary hover:border-[oklch(1_0_0_/_0.05)]"
                      onClick={() => router.push(ROUTES.TOTEM(totem.id))}
                    >
                      <EyeIcon className="mr-2 h-4 w-4" />
                      Visualizar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 