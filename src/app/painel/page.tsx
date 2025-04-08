'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Menu as MenuIcon,
  Tv as TvIcon,
  PhoneAndroid as VerticalIcon,
  LogoutOutlined as LogoutIcon
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import { HorizontalDisplayIcon, VerticalDisplayIcon } from '@/components/icons/DisplayIcons';
import { colors } from '@/styles/colors';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

interface Totem {
  id: string;
  nome: string;
  tipo: 'tv' | 'vertical';
  cronograma: any[];
}

export default function Painel() {
  const theme = useTheme();
  const [totens, setTotens] = useState<Totem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [novoTotem, setNovoTotem] = useState({ 
    nome: '',
    tipo: 'tv' as 'tv' | 'vertical'
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTotens();
  }, []);

  const fetchTotens = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'totens'));
      const totensData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome,
        tipo: doc.data().tipo,
        cronograma: doc.data().cronograma
      }));
      
      // Ordena por ID numérico
      const totensSorted = totensData.sort((a, b) => Number(a.id) - Number(b.id));
      setTotens(totensSorted);
    } catch (error) {
      console.error('Erro ao buscar totens:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextId = async () => {
    try {
      // Busca todos os totens existentes
      const querySnapshot = await getDocs(collection(db, 'totens'));
      const totensData = querySnapshot.docs.map(doc => ({
        id: doc.id
      }));

      // Se não houver totens, começa do 1
      if (totensData.length === 0) {
        return "1";
      }

      // Encontra o maior ID numérico
      const maxId = totensData.reduce((max, totem) => {
        const id = parseInt(totem.id);
        return isNaN(id) ? max : Math.max(max, id);
      }, 0);

      // Retorna o próximo ID na sequência
      return (maxId + 1).toString();
    } catch (error) {
      console.error('Erro ao gerar ID:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nextId = await getNextId();
      
      await setDoc(doc(db, 'totens', nextId), {
        nome: novoTotem.nome,
        tipo: novoTotem.tipo,
        cronograma: []
      });

      fetchTotens();
      setShowForm(false);
      setNovoTotem({ nome: '', tipo: 'tv' });
    } catch (error) {
      console.error('Erro ao criar totem:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'totens', id));
      setShowDeleteConfirm(null);
      fetchTotens();
    } catch (error) {
      console.error('Erro ao deletar totem:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <ProtectedRoute>
      <Box 
        sx={{ 
          flexGrow: 1, 
          minHeight: '100vh', 
          bgcolor: '#000000', // Forçando preto puro
          color: colors.white.main
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
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                display: { 
                  xs: 'none', // Esconde em mobile
                  sm: 'block' // Mostra em telas maiores
                },
                fontSize: {
                  sm: '1.25rem'
                }
              }}
            >
              Sistema de Totens
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              variant="contained"
              sx={{ mr: 2 }}
            >
              Novo Totem
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
        <Toolbar /> {/* Espaçamento para o AppBar fixo */}

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <CircularProgress />
            </Box>
          ) : totens.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight="60vh"
              textAlign="center"
              sx={{ color: colors.white.main }}
            >
              <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Nenhum totem criado
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Clique em "Novo Totem" para começar
              </Typography>
            </Box>
          ) : (
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
              gap={3}
            >
              {totens.map(totem => (
                <Card 
                  key={totem.id} 
                  variant="outlined"
                  sx={{ 
                    bgcolor: '#000000',
                    borderColor: colors.gray.medium,
                    '& .MuiCardContent-root': {
                      bgcolor: '#000000'
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Stack 
                        direction="row" 
                        spacing={2} 
                        alignItems="center"
                        sx={{ 
                          height: '100%',
                          '& .MuiChip-root': {
                            height: '24px',  // Altura fixa para o chip
                            alignSelf: 'center'  // Alinha verticalmente
                          }
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          component="h2"
                          sx={{
                            fontSize: '1rem',
                            lineHeight: '24px',  // Mesma altura do chip
                            margin: 0
                          }}
                        >
                          {totem.nome}
                        </Typography>
                        <Chip
                          label={totem.tipo === 'tv' ? 'TV Horizontal' : 'Totem Vertical'}
                          size="small"
                          sx={{
                            backgroundColor: 'transparent',
                            '& .MuiChip-label': {
                              color: colors.white.secondary,
                              fontSize: '0.875rem',
                              lineHeight: '20px'
                            }
                          }}
                        />
                      </Stack>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setShowDeleteConfirm(totem.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <CardActions sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                      p: 2,
                      '& .MuiButton-root': {
                        width: '100%',
                        height: '48px',
                        justifyContent: 'flex-start',
                        pl: 2,
                        pr: 2,
                        borderRadius: 1.5,
                        '& .MuiSvgIcon-root': {
                          mr: 1.5,
                          fontSize: '20px'
                        }
                      },
                      '& > :not(style) ~ :not(style)': {
                        marginLeft: 0
                      }
                    }}>
                      <Button
                        component={Link}
                        href={`/painel/totem/${totem.id}`}
                        variant="contained"
                        startIcon={<EditIcon />}
                      >
                        Gerenciar Cronograma
                      </Button>
                      <Button
                        component={Link}
                        href={`/totem/${totem.id}`}
                        target="_blank"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                      >
                        Visualizar Totem
                      </Button>
                    </CardActions>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Container>

        {/* Modal de Criação */}
        <Dialog 
          open={showForm} 
          onClose={() => setShowForm(false)} 
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
                bgcolor: '#000000', // Forçando preto no título
                borderBottom: `1px solid ${colors.gray.medium}` // Opcional: adiciona uma linha divisória
              },
              '& .MuiDialogContent-root': {
                bgcolor: '#000000',
                padding: '20px' // Ajustando o padding para melhor espaçamento
              },
              '& .MuiDialogActions-root': {
                bgcolor: '#000000', // Forçando preto na área de ações
                padding: '20px', // Ajustando o padding
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
              '& .MuiSelect-select': {
                color: colors.white.main
              },
              '& .MuiMenuItem-root': {
                color: colors.white.main,
                '&:hover': {
                  bgcolor: colors.gray.light
                }
              }
            }
          }}
        >
          <DialogTitle>Criar Novo Totem</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Nome do Totem"
                type="text"
                fullWidth
                variant="outlined"
                value={novoTotem.nome}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNovoTotem({...novoTotem, nome: e.target.value})}
                sx={{
                  '& .MuiInputBase-input': {
                    color: colors.white.main
                  }
                }}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Tipo do Totem</InputLabel>
                <Select
                  value={novoTotem.tipo}
                  label="Tipo do Totem"
                  onChange={(e: SelectChangeEvent) => 
                    setNovoTotem({...novoTotem, tipo: e.target.value as 'tv' | 'vertical'})}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#000000',
                        border: `1px solid ${colors.gray.medium}`,
                        '& .MuiMenuItem-root': {
                          color: colors.white.main,
                          '&:hover': {
                            bgcolor: colors.gray.light
                          },
                          '&.Mui-selected': {
                            bgcolor: colors.gray.medium
                          }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="tv">TV Horizontal</MenuItem>
                  <MenuItem value="vertical">Totem Vertical</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button 
                onClick={() => setShowForm(false)}
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
                Criar
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Modal de Confirmação de Exclusão */}
        <Dialog
          open={!!showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Excluir Totem</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir este totem? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
              onClick={() => setShowDeleteConfirm(null)}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
              color="error"
              variant="contained"
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
} 