import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabaseClient } from "../lib/supabaseClient"; // Import from the file we made above

// UI Imports
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Link } from "react-router-dom";

// Zod Schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. Setup React Hook Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. The Actual Submit Logic
  async function onSubmit(values) {
    setIsLoading(true);
    
    try {
      // Direct call to Supabase using the values from Zod
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        alert(error.message); // Ideally, use a Toast component here
        return;
      }

    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Social Login Handler
  const handleSocialLogin = async (provider) => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: provider.toLowerCase(), // 'google' or 'github'
    });
    if (error) alert(error.message);
  };

  // 4. Session Listener (The correct way to handle auth state)
  useEffect(() => {
    // Check active session immediately
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("User is already logged in", session);
        // Navigate to dashboard here
      }
    });

    // Listen for changes (Login, Logout, Auto-refresh)
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session) {
       window.location.href = "/dashboard"; 
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/50">
      <Card className="w-full max-w-md border-white/10 bg-black/40 text-white backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Social Buttons connected to real logic */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-gray-200"
              onClick={() => handleSocialLogin('Google')}
            >
              Google
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-gray-200"
              onClick={() => handleSocialLogin('Github')}
            >
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black/40 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Email</FormLabel>
                    <FormControl>
                      {/* REMOVED value={email} and onChange. Let 'field' handle it */}
                      <Input 
                        placeholder="name@example.com" 
                        {...field} 
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Password</FormLabel>
                    <FormControl>
                      {/* REMOVED value={password} and onChange */}
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
            <div className="text-sm text-center text-gray-400">
              Don't have an account?{" "}
              {/* This should ideally be a React Router Link, not an anchor tag */}
              <Link to="/signup" className="text-purple-400 hover:underline">
                Sign up
              </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}