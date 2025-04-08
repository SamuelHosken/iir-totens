'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  DragHandle as DragHandleIcon,
  Edit as EditIcon,
  LogoutOutlined as LogoutIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { colors } from '@/theme';
import { ChangeEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Slide {
  id: string;
  titulo: string;
  horarioInicio: string; // formato "HH:mm"
  conteudo: string;
  ordem: number;
}

interface Totem {
  id: string;
  nome: string;
  cronograma: Slide[];
}

const ordenarPorHorario = (cronograma: Slide[]) => {
  return [...cronograma].sort((a, b) => {
    // Converte horário para minutos para comparação mais precisa
    const [horaA, minA] = a.horarioInicio.split(':').map(Number);
    const [horaB, minB] = b.horarioInicio.split(':').map(Number);
    
    const minutosA = horaA * 60 + minA;
    const minutosB = horaB * 60 + minB;
    
    return minutosA - minutosB;
  });
};

export default function GerenciarCronograma({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { signOut } = useAuth();
  const [totem, setTotem] = useState<Totem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [novoSlide, setNovoSlide] = useState({
    titulo: '',
    horarioInicio: '',
    conteudo: ''
  });

  const fetchTotem = useCallback(async () => {
    try {
      const totemDoc = await getDoc(doc(db, 'totens', id));
      if (totemDoc.exists()) {
        const data = totemDoc.data();
        const cronogramaOrdenado = ordenarPorHorario(data.cronograma || []);
        
        setTotem({
          id: totemDoc.id,
          nome: data.nome,
          cronograma: cronogramaOrdenado
        });
      }
    } catch (error) {
      console.error('Erro ao buscar totem:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTotem();
  }, [fetchTotem]);

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totem) return;

    try {
      const newSlide: Slide = {
        id: Date.now().toString(),
        ...novoSlide,
        ordem: totem.cronograma.length
      };

      const updatedCronograma = ordenarPorHorario([...totem.cronograma, newSlide]);
      await updateDoc(doc(db, 'totens', totem.id), {
        cronograma: updatedCronograma
      });

      setTotem({
        ...totem,
        cronograma: updatedCronograma
      });
      setShowSlideForm(false);
      setNovoSlide({ titulo: '', horarioInicio: '', conteudo: '' });
    } catch (error) {
      console.error('Erro ao adicionar slide:', error);
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!totem) return;

    try {
      const updatedCronograma = totem.cronograma
        .filter(slide => slide.id !== slideId)
        .map((slide, index) => ({ ...slide, ordem: index }));

      await updateDoc(doc(db, 'totens', totem.id), {
        cronograma: updatedCronograma
      });

      setTotem({
        ...totem,
        cronograma: updatedCronograma
      });
    } catch (error) {
      console.error('Erro ao deletar slide:', error);
    }
  };

  const handleEditSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totem || !editingSlide) return;

    try {
      const updatedCronograma = totem.cronograma.map(slide => 
        slide.id === editingSlide.id ? editingSlide : slide
      );

      const ordenedCronograma = ordenarPorHorario(updatedCronograma);

      await updateDoc(doc(db, 'totens', totem.id), {
        cronograma: ordenedCronograma
      });

      setTotem({
        ...totem,
        cronograma: ordenedCronograma
      });
      setEditingSlide(null);
    } catch (error) {
      console.error('Erro ao editar slide:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <ProtectedRoute>
      <Box 
        component="main"
        sx={{ 
          flexGrow: 1, 
          minHeight: '100vh', 
          bgcolor: '#000000',
          color: colors.white.main,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: '#000000',
            borderBottom: `1px solid ${colors.gray.medium}`
          }} 
          elevation={0}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => router.back()}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontSize: {
                  xs: '0.875rem', // Fonte menor em mobile
                  sm: '1.25rem'  // Fonte maior em desktop
                },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {totem?.nome || 'Carregando...'}
            </Typography>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={() => setShowSlideForm(true)}
              variant="contained"
              sx={{ mr: 2 }}
            >
              Novo Slide
            </Button>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              variant="outlined"
              sx={{
                borderColor: colors.gray.medium,
                '&:hover': {
                  borderColor: colors.white.main,
                  bgcolor: 'transparent'
                }
              }}
            >
              Sair
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar />

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <List sx={{ 
            bgcolor: '#000000', 
            borderRadius: 1,
            border: `1px solid ${colors.gray.medium}`,
            '& .MuiListItem-root': {
              borderBottom: `1px solid ${colors.gray.medium}`
            },
            '& .MuiListItem-root:last-child': {
              borderBottom: 'none'
            }
          }}>
            {totem?.cronograma.map((slide, index) => (
              <div key={slide.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton 
                        onClick={() => setEditingSlide(slide)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteSlide(slide.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <IconButton sx={{ mr: 2, cursor: 'grab' }}>
                    <DragHandleIcon />
                  </IconButton>
                  <ListItemText
                    primary={slide.titulo}
                    secondary={
                      <>
                        Início: {slide.horarioInicio}
                        <br />
                        {slide.conteudo}
                      </>
                    }
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: colors.white.main
                      },
                      '& .MuiListItemText-secondary': {
                        color: colors.white.secondary
                      }
                    }}
                  />
                </ListItem>
              </div>
            ))}
          </List>
        </Container>

        {/* Modal de Edição */}
        <Dialog 
          open={!!editingSlide} 
          onClose={() => setEditingSlide(null)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#000000',
              border: `1px solid ${colors.gray.medium}`,
              borderRadius: 1,
              color: colors.white.main,
              '& .MuiDialogTitle-root': {
                color: colors.white.main,
                bgcolor: '#000000',
                borderBottom: `1px solid ${colors.gray.medium}`
              },
              '& .MuiDialogContent-root': {
                bgcolor: '#000000',
                padding: '20px'
              },
              '& .MuiDialogActions-root': {
                bgcolor: '#000000',
                padding: '20px',
                paddingTop: '0px'
              },
              '& .MuiInputLabel-root': {
                color: colors.white.secondary
              },
              '& .MuiOutlinedInput-root': {
                bgcolor: '#000000',
                '& fieldset': {
                  borderColor: colors.gray.medium
                },
                '&:hover fieldset': {
                  borderColor: colors.white.main
                }
              },
              '& .MuiInputBase-input': {
                color: colors.white.main
              }
            }
          }}
        >
          <DialogTitle>Editar Evento</DialogTitle>
          <form onSubmit={handleEditSlide}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Nome do Evento"
                fullWidth
                value={editingSlide?.titulo || ''}
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                  setEditingSlide(prev => prev ? {...prev, titulo: e.target.value} : null)}
                sx={{
                  '& .MuiInputBase-input': {
                    color: colors.white.main
                  }
                }}
              />
              <TextField
                margin="dense"
                label="Horário de Início"
                type="time"
                fullWidth
                value={editingSlide?.horarioInicio || ''}
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                  setEditingSlide(prev => prev ? {...prev, horarioInicio: e.target.value} : null)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300
                }}
              />
              <TextField
                margin="dense"
                label="Descrição do Evento"
                fullWidth
                multiline
                rows={4}
                value={editingSlide?.conteudo || ''}
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                  setEditingSlide(prev => prev ? {...prev, conteudo: e.target.value} : null)}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button 
                onClick={() => setEditingSlide(null)}
                variant="outlined"
                sx={{
                  borderColor: colors.gray.medium,
                  color: colors.white.main,
                  '&:hover': {
                    borderColor: colors.white.main,
                    bgcolor: 'transparent'
                  }
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                sx={{
                  bgcolor: colors.white.main,
                  color: colors.black.pure,
                  '&:hover': {
                    bgcolor: colors.white.dim
                  }
                }}
              >
                Salvar
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Modal de Novo Slide */}
        <Dialog 
          open={showSlideForm} 
          onClose={() => setShowSlideForm(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#000000',
              border: `1px solid ${colors.gray.medium}`,
              borderRadius: 1,
              color: colors.white.main,
              '& .MuiDialogTitle-root': {
                color: colors.white.main,
                bgcolor: '#000000',
                borderBottom: `1px solid ${colors.gray.medium}`
              },
              '& .MuiDialogContent-root': {
                bgcolor: '#000000',
                padding: '20px'
              },
              '& .MuiDialogActions-root': {
                bgcolor: '#000000',
                padding: '20px',
                paddingTop: '0px'
              },
              '& .MuiInputLabel-root': {
                color: colors.white.secondary
              },
              '& .MuiOutlinedInput-root': {
                bgcolor: '#000000',
                '& fieldset': {
                  borderColor: colors.gray.medium
                },
                '&:hover fieldset': {
                  borderColor: colors.white.main
                }
              },
              '& .MuiInputBase-input': {
                color: colors.white.main
              }
            }
          }}
        >
          <DialogTitle>Novo Slide</DialogTitle>
          <form onSubmit={handleAddSlide}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Nome do Evento"
                type="text"
                fullWidth
                variant="outlined"
                value={novoSlide.titulo}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                  setNovoSlide({...novoSlide, titulo: e.target.value})}
              />
              <TextField
                margin="dense"
                label="Horário de Início"
                type="time"
                fullWidth
                variant="outlined"
                value={novoSlide.horarioInicio}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                  setNovoSlide({...novoSlide, horarioInicio: e.target.value})}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="dense"
                label="Descrição do Evento"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={novoSlide.conteudo}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                  setNovoSlide({...novoSlide, conteudo: e.target.value})}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button 
                onClick={() => setShowSlideForm(false)}
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained"
              >
                Adicionar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
} 