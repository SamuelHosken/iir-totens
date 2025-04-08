declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Declaração para diretivas do Tailwind
declare module 'tailwindcss/tailwind.css' 