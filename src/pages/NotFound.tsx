import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-screen bg-bg">
      <span className="font-mono text-3xl font-extrabold text-muted/50 mb-2">404</span>
      <h1 className="font-heading font-bold text-2xl text-ink mb-2">Page not found</h1>
      <p className="text-sm text-muted mb-6 max-w-[280px]">
        The page you are looking for doesn't exist or has moved.
      </p>
      <Button onClick={() => navigate('/home')}>Return to Home</Button>
    </div>
  );
}
