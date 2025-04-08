import { Box, Container, Typography, Paper } from '@mui/material';

interface LayoutProps {
  totem: {
    nome: string;
    cronograma: Array<{
      id: string;
      titulo: string;
      horarioInicio: string;
      conteudo: string;
    }>;
  } | null;
  currentTime: Date | null;
  isEventoAtual: (horarioInicio: string) => boolean;
}

export function VerticalLayout({ totem, currentTime, isEventoAtual }: LayoutProps) {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        borderBottom: '1px solid',
        borderColor: 'primary.main'
      }}>
        <Typography variant="h3" sx={{ color: 'primary.main', mb: 2 }}>
          {totem?.nome}
        </Typography>
        {currentTime && (
          <Typography variant="h2" sx={{ color: 'text.secondary' }}>
            {currentTime.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Typography>
        )}
      </Box>

      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        {totem?.cronograma.map((slide: any) => (
          <Paper
            key={slide.id}
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              border: isEventoAtual(slide.horarioInicio) ? 2 : 0,
              borderColor: 'primary.main',
              bgcolor: isEventoAtual(slide.horarioInicio) ? 'background.paper' : 'background.default',
              transform: isEventoAtual(slide.horarioInicio) ? 'scale(1.02)' : 'none',
              transition: 'transform 0.3s'
            }}
          >
            <Typography variant="h4" gutterBottom>
              {slide.titulo}
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {slide.horarioInicio}
            </Typography>
            <Typography variant="h6">
              {slide.conteudo}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
} 