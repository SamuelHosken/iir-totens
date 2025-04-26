'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ROUTES } from '@/constants';
import Image from 'next/image';

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Icons
import { Chrome } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push(ROUTES.PAINEL);
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(ROUTES.PAINEL);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="card-subtle bg-card w-full max-w-sm">
        <CardHeader className="space-y-4 text-left px-8 pt-8">
          <div className="flex items-center">
            <Image
              src="/IIR Brasil Logo Branca.png"
              alt="IIR Brasil"
              width={60}
              height={20}
              className="h-auto"
              priority
            />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-medium">
              Bem-vindo de volta
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Faça login para acessar o painel
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          <p className="text-sm text-muted-foreground">
            Faça login com sua conta Google para acessar o sistema de gerenciamento de totens da Igreja Internacional da Reconciliação - IIR.
          </p>

          <Button
            variant="outline"
            size="lg"
            className="w-full border border-[oklch(1_0_0_/_0.05)] hover:bg-secondary hover:border-[oklch(1_0_0_/_0.05)]"
            onClick={handleGoogleLogin}
          >
            <Chrome className="mr-2 h-5 w-5" />
            Continuar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 