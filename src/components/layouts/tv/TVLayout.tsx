import { Box, Container, Typography, Paper } from '@mui/material';
import { LayoutProps } from '@/types/layouts';
import styles from './TVLayout.module.css';

export function TVLayout({ totem, currentTime, isEventoAtual }: LayoutProps) {
  return (
    <Box className={styles.tvContainer}>
      <Box className={styles.header}>
        <Typography variant="h2" className={styles.title}>
          {totem?.nome}
        </Typography>
        {currentTime && (
          <Typography variant="h2" className={styles.clock}>
            {currentTime.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Typography>
        )}
      </Box>

      <Box className={styles.content}>
        {totem?.cronograma.map((slide) => (
          <Paper
            key={slide.id}
            className={`${styles.card} ${isEventoAtual(slide.horarioInicio) ? styles.activeCard : ''}`}
          >
            <Typography variant="h4" className={styles.cardTitle}>
              {slide.titulo}
            </Typography>
            <Typography variant="h5" className={styles.cardTime}>
              {slide.horarioInicio}
            </Typography>
            <Typography variant="body1" className={styles.cardContent}>
              {slide.conteudo}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
} 