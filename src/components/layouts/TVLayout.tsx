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

export function TVLayout({ totem, currentTime, isEventoAtual }: LayoutProps) {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 4,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h3" sx={{ color: 'primary.main' }}>
            {totem?.nome}
          </Typography>
          {currentTime && (
            <Typography variant="h3" sx={{ color: 'text.secondary' }}>
              {currentTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 4
          }}
        >
          {totem?.cronograma.map((slide: any) => (
            <Paper
              key={slide.id}
              elevation={3}
              sx={{
                p: 3,
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                border: isEventoAtual(slide.horarioInicio) ? 2 : 0,
                borderColor: 'primary.main',
                bgcolor: isEventoAtual(slide.horarioInicio) ? 'background.paper' : 'background.default',
              }}
            >
              <Typography variant="h5" gutterBottom>
                {slide.titulo}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {slide.horarioInicio}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, flexGrow: 1 }}>
                {slide.conteudo}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
} 