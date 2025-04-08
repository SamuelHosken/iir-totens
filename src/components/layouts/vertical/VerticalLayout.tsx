import { Box, Typography, Paper } from '@mui/material';
import { LayoutProps } from '@/types/layouts';
import styles from './VerticalLayout.module.css';

export function VerticalLayout({ totem, currentTime, isEventoAtual }: LayoutProps) {
  return (
    <Box className={styles.verticalContainer}>
      <Box className={styles.header}>
        <Typography variant="h1" className={styles.title}>
          {totem?.nome}
        </Typography>
        {currentTime && (
          <Typography variant="h1" className={styles.clock}>
            {currentTime.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Typography>
        )}
      </Box>

      <Box className={styles.timeline}>
        {totem?.cronograma.map((slide) => (
          <Paper
            key={slide.id}
            className={`${styles.event} ${isEventoAtual(slide.horarioInicio) ? styles.activeEvent : ''}`}
          >
            <Typography variant="h3" className={styles.eventTime}>
              {slide.horarioInicio}
            </Typography>
            <Typography variant="h2" className={styles.eventTitle}>
              {slide.titulo}
            </Typography>
            <Typography variant="h4" className={styles.eventContent}>
              {slide.conteudo}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
} 