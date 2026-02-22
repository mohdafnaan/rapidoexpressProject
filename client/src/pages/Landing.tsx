import { motion } from "framer-motion";
import { Bike, Shield, Zap, ArrowRight, Star, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg">
                            <Bike className="text-black h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">RAPIDO <span className="text-primary italic">EXPRESS</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
                        <a href="#safety" className="hover:text-primary transition-colors">Safety</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="font-semibold">Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="font-bold bg-primary text-black hover:bg-primary/90">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 md:pt-48 md:pb-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
                <div className="container mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                            India's Largest Bike Taxi Service
                        </span>
                        <h1 className="mt-8 text-5xl md:text-7xl font-extrabold tracking-tight text-balance">
                            Beat the traffic with <br />
                            <span className="text-primary">Rapido Express</span>
                        </h1>
                        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                            Fast, affordable, and safe bike taxi rides at your fingertips. Why wait in traffic when you can fly through it?
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup">
                                <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary text-black hover:bg-primary/90 rounded-2xl">
                                    Book A Ride Now <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/signup?role=rider">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-2 rounded-2xl">
                                    Become a Captain
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Active Riders", value: "10M+" },
                                { label: "Cities covered", value: "100+" },
                                { label: "Daily Rides", value: "1M+" },
                                { label: "Safe Rides", value: "100M+" },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <span className="text-3xl font-bold">{stat.value}</span>
                                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold">Why choose Rapido Express?</h2>
                        <p className="text-muted-foreground mt-4">We've built the safest and fastest way to commute.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="h-8 w-8 text-primary" />,
                                title: "Instant Booking",
                                desc: "Get a ride in less than 2 minutes at any time of the day."
                            },
                            {
                                icon: <Shield className="h-8 w-8 text-primary" />,
                                title: "Verified Captains",
                                desc: "Every rider undergoes background checks and safety training."
                            },
                            {
                                icon: <Clock className="h-8 w-8 text-primary" />,
                                title: "Time Saver",
                                desc: "Navigate through traffic jams and reach your destination 50% faster."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-3xl bg-background border hover:border-primary/50 transition-all shadow-sm"
                            >
                                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking Preview Component - Modern UI */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="bg-black text-white rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                    Book from anywhere, <br />
                                    <span className="text-primary">anytime.</span>
                                </h2>
                                <p className="mt-6 text-gray-400 text-lg">
                                    Use our seamless interface to pick your destination and get an estimated fare instantly.
                                </p>
                                <div className="mt-10 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white">Precise Location Tracking</h4>
                                            <p className="text-sm text-gray-500">Live GPS tracking for both riders and users.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                                            <Star className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white">Premium Quality</h4>
                                            <p className="text-sm text-gray-500">Only the best vehicles and top-rated captains.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 yellow-glow">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">From</label>
                                            <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                                                <MapPin className="text-primary h-5 w-5" />
                                                <span className="text-gray-300">Indiranagar Office</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">To</label>
                                            <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                                                <div className="h-5 w-5 rounded-full border-2 border-primary" />
                                                <span className="font-medium">Koramangala Metro</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 flex items-center justify-between border-t border-white/10">
                                            <div>
                                                <span className="text-xs text-gray-400">Estimated Fare</span>
                                                <p className="text-2xl font-bold">₹85.00</p>
                                            </div>
                                            <Button className="bg-primary text-black hover:bg-primary/90 font-bold px-6">
                                                Confirm Ride
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t mt-auto px-4">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Bike className="text-primary h-6 w-6" />
                            <span className="text-lg font-bold tracking-tight">RAPIDO <span className="text-primary italic">EXPRESS</span></span>
                        </div>
                        <div className="flex gap-8 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-primary">Press</a>
                            <a href="#" className="hover:text-primary">Privacy</a>
                            <a href="#" className="hover:text-primary">Terms</a>
                            <a href="#" className="hover:text-primary">Contact</a>
                        </div>
                        <p className="text-sm text-muted-foreground">© 2026 Rapido Express. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
