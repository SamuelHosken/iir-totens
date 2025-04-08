import { SvgIcon } from '@mui/material';

export function HorizontalDisplayIcon() {
  return (
    <SvgIcon>
      <rect 
        x="2" 
        y="6" 
        width="20" 
        height="12" 
        rx="1" 
        stroke="currentColor" 
        fill="none" 
        strokeWidth="2"
      />
    </SvgIcon>
  );
}

export function VerticalDisplayIcon() {
  return (
    <SvgIcon>
      <rect 
        x="7" 
        y="2" 
        width="10" 
        height="20" 
        rx="1" 
        stroke="currentColor" 
        fill="none" 
        strokeWidth="2"
      />
    </SvgIcon>
  );
} 