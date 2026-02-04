import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function ForgotPassword() {
  const { resetPassword } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    const result = await resetPassword(email);
    
    setIsLoading(false);
    
    if (result.success) {
      setEmailSent(true);
      toast.success('Password reset email sent!');
    } else {
      toast.error(result.error || 'Failed to send reset email');
      setError(result.error || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Radial Gradient 1 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-900/20 rounded-full blur-3xl" />
        
        {/* Radial Gradient 2 */}
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        
        {/* Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Reset Password Card */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-violet-900/20">
          {/* Back Button */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          {!emailSent ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-600/20 mb-4">
                  <Mail className="w-6 h-6 text-violet-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Forgot password?</h1>
                <p className="text-zinc-400 text-sm">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>
              </div>

              {/* Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/50"
                    aria-invalid={!!error}
                  />
                  {error && (
                    <p className="text-red-400 text-xs mt-1">{error}</p>
                  )}
                </div>

                {/* Send Reset Link Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-medium transition-all duration-200 shadow-lg shadow-violet-600/30"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600/20 mb-4">
                  <Mail className="w-6 h-6 text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
                <p className="text-zinc-400 text-sm mb-6">
                  We've sent a password reset link to <span className="text-white font-medium">{email}</span>
                </p>
                
                <div className="bg-violet-600/10 border border-violet-600/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-zinc-300">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => setEmailSent(false)}
                      className="text-violet-400 hover:text-violet-300 font-medium"
                    >
                      try again
                    </button>
                  </p>
                </div>

                <Link to="/login">
                  <Button
                    variant="outline"
                    className="w-full h-11 bg-white/5 hover:bg-white/10 border-white/10 text-white"
                  >
                    Back to login
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
