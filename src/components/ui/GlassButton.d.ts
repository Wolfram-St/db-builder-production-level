declare module '../components/ui/GlassButton.jsx' {
  import { ReactNode } from 'react';
  
  interface GlassButtonProps {
    children?: ReactNode;
  }
  
  export default function GlassButton(props: GlassButtonProps): JSX.Element;
}
