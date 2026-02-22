import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Bike, User, Lock, Mail, Phone, Calendar, ArrowLeft, Loader2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

const Signup = () => {
    const [searchParams] = useSearchParams();
    const defaultTab = searchParams.get("role") === "rider" ? "rider" : "user";

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>, role: "user" | "rider") => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const endpoint = role === "user" ? "/public/user-register" : "/public/rider-register";
            const response = await axios.post(`http://localhost:5000${endpoint}`, data);

            if (response.status === 200) {
                toast.success("Registration successful! Please check your email for verification.");
                navigate("/login");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.msg || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <Link to="/" className="fixed top-8 left-8 p-2 hover:bg-muted rounded-full transition-colors">
                <ArrowLeft className="h-6 w-6" />
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-xl"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-primary rounded-2xl mb-4">
                        <Bike className="h-8 w-8 text-black" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
                    <p className="text-muted-foreground mt-2">Join Rapido Express and start moving smarter</p>
                </div>

                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-2xl h-14 mb-6">
                        <TabsTrigger value="user" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-semibold h-full">User</TabsTrigger>
                        <TabsTrigger value="rider" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-semibold h-full">Captain</TabsTrigger>
                    </TabsList>

                    <TabsContent value="user">
                        <Card className="border-2 rounded-[2rem] shadow-xl overflow-hidden">
                            <CardHeader>
                                <CardTitle>Sign up as User</CardTitle>
                                <CardDescription>Join as a customer to get the fastest rides in town.</CardDescription>
                            </CardHeader>
                            <form onSubmit={(e) => handleSignup(e, "user")}>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="fullName" name="fullName" placeholder="John Doe" className="pl-10 h-11 rounded-xl" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="phone" name="phone" placeholder="9876543210" className="pl-10 h-11 rounded-xl" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="email" name="email" type="email" placeholder="name@example.com" className="pl-10 h-11 rounded-xl" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="age">Age</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="age" name="age" type="number" placeholder="25" className="pl-10 h-11 rounded-xl" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Gender</Label>
                                            <Select name="gender" defaultValue="male">
                                                <SelectTrigger className="h-11 rounded-xl">
                                                    <SelectValue placeholder="Select Gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-10 h-11 rounded-xl" required />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-4 pb-8">
                                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-black font-bold hover:bg-primary/90" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                                    </Button>
                                    <p className="text-sm text-center text-muted-foreground">
                                        Already have an account?{" "}
                                        <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
                                    </p>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rider">
                        <Card className="border-2 rounded-[2rem] shadow-xl overflow-hidden">
                            <CardHeader>
                                <CardTitle>Become a Captain</CardTitle>
                                <CardDescription>Register your vehicle and start earning today.</CardDescription>
                            </CardHeader>
                            <form onSubmit={(e) => handleSignup(e, "rider")}>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="r-fullName">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="r-fullName" name="fullName" placeholder="John Doe" className="pl-10 h-11 rounded-xl" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="r-phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="r-phone" name="phone" placeholder="9876543210" className="pl-10 h-11 rounded-xl" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="r-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="r-email" name="email" type="email" placeholder="captain@example.com" className="pl-10 h-11 rounded-xl" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="r-vehicleType">Vehicle Type</Label>
                                            <Select name="vehicleType" defaultValue="bike">
                                                <SelectTrigger className="h-11 rounded-xl">
                                                    <SelectValue placeholder="Vehicle Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="bike">Bike</SelectItem>
                                                    <SelectItem value="auto">Auto Rikshaw</SelectItem>
                                                    <SelectItem value="cab">Cab</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="vehicleRc">Vehicle RC Number</Label>
                                            <div className="relative">
                                                <ClipboardList className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="vehicleRc" name="vehicleRc" placeholder="KA01EF1234" className="pl-10 h-11 rounded-xl uppercase" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="r-age">Age</Label>
                                            <Input id="r-age" name="age" type="number" placeholder="25" className="h-11 rounded-xl" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="r-gender">Gender</Label>
                                            <Select name="gender" defaultValue="male">
                                                <SelectTrigger className="h-11 rounded-xl">
                                                    <SelectValue placeholder="Select Gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="r-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="r-password" name="password" type="password" placeholder="••••••••" className="pl-10 h-11 rounded-xl" required />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-4 pb-8">
                                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-black font-bold hover:bg-primary/90" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Start Earning Now"}
                                    </Button>
                                    <p className="text-sm text-center text-muted-foreground">
                                        Already a Captain?{" "}
                                        <Link to="/login?role=rider" className="text-primary font-semibold hover:underline">Log in</Link>
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

export default Signup;
