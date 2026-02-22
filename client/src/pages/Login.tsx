import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bike, User, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import axios from "axios";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>, role: "user" | "rider") => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const endpoint = role === "user" ? "/public/user-login" : "/public/rider-login";
            const response = await axios.post(`http://localhost:5000${endpoint}`, { email, password });

            if (response.status === 200) {
                toast.success("Login successful!");
                login(response.data.token, { email, role });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.msg || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background p-4">
            <Link to="/" className="fixed top-8 left-8 p-2 hover:bg-muted rounded-full transition-colors">
                <ArrowLeft className="h-6 w-6" />
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-primary rounded-2xl mb-4">
                        <Bike className="h-8 w-8 text-black" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
                </div>

                <Tabs defaultValue="user" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-2xl h-14 mb-6">
                        <TabsTrigger value="user" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-semibold h-full">User</TabsTrigger>
                        <TabsTrigger value="rider" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-semibold h-full">Captain</TabsTrigger>
                    </TabsList>

                    <TabsContent value="user">
                        <Card className="border-2 rounded-[2rem] shadow-xl overflow-hidden">
                            <CardHeader>
                                <CardTitle>User Login</CardTitle>
                                <CardDescription>Book rides and manage your trips.</CardDescription>
                            </CardHeader>
                            <form onSubmit={(e) => handleLogin(e, "user")}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="user-email">Email</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="user-email" name="email" type="email" placeholder="name@example.com" className="pl-10 h-12 rounded-xl" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="user-password">Password</Label>
                                            <Link to="/forgot-password" size="sm" className="text-primary text-xs font-semibold underline-offset-4 hover:underline">Forgot password?</Link>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="user-password" name="password" type="password" placeholder="••••••••" className="pl-10 h-12 rounded-xl" required />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-4 pb-8">
                                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-black font-bold hover:bg-primary/90" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                                    </Button>
                                    <p className="text-sm text-center text-muted-foreground">
                                        Don't have an account?{" "}
                                        <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
                                    </p>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rider">
                        <Card className="border-2 rounded-[2rem] shadow-xl overflow-hidden">
                            <CardHeader>
                                <CardTitle>Captain Login</CardTitle>
                                <CardDescription>Earn money on your own schedule.</CardDescription>
                            </CardHeader>
                            <form onSubmit={(e) => handleLogin(e, "rider")}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rider-email">Email</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="rider-email" name="email" type="email" placeholder="captain@example.com" className="pl-10 h-12 rounded-xl" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="rider-password">Password</Label>
                                            <Button variant="link" size="sm" className="px-0 h-auto text-primary font-semibold">Forgot password?</Button>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="rider-password" name="password" type="password" placeholder="••••••••" className="pl-10 h-12 rounded-xl" required />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-4 pb-8">
                                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-black font-bold hover:bg-primary/90" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Connect & Earn"}
                                    </Button>
                                    <p className="text-sm text-center text-muted-foreground">
                                        Want to be a partner?{" "}
                                        <Link to="/signup?role=rider" className="text-primary font-semibold hover:underline">Start here</Link>
                                    </p>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
};

export default Login;
