import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Bike,
    MapPin,
    History,
    User,
    LogOut,
    Navigation,
    Search,
    Settings,
    Bell,
    CheckCircle2,
    Clock,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import axios from "axios";

// Sidebar Item Component
const SidebarItem = ({ icon: Icon, label, path, active, onClick }: any) => (
    <Link to={path} onClick={onClick}>
        <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer mb-1
      ${active ? 'bg-primary text-black font-bold shadow-md' : 'hover:bg-muted text-muted-foreground'}
    `}>
            <Icon className={`h-5 w-5 ${active ? 'text-black' : ''}`} />
            <span className="text-sm">{label}</span>
        </div>
    </Link>
);

const UserDashboard = () => {
    const { user, logout, token } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Protected route check
    useEffect(() => {
        if (!token && !localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [token, navigate]);

    const menuItems = [
        { icon: Navigation, label: "Book a Ride", path: "/user/dashboard" },
        { icon: History, label: "Ride History", path: "/user/dashboard/history" },
        { icon: User, label: "Profile", path: "/user/dashboard/profile" },
        { icon: Settings, label: "Settings", path: "/user/dashboard/settings" },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            {/* Sidebar */}
            <aside className={`
        fixed left-0 top-0 h-full bg-white border-r z-40 transition-all duration-300 w-64
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-10">
                        <div className="bg-primary p-2 rounded-lg">
                            <Bike className="text-black h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">RAPIDO <span className="text-primary italic">EXPRESS</span></span>
                    </div>

                    <nav className="flex-1">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                {...item}
                                active={location.pathname === item.path}
                            />
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-12 rounded-xl"
                            onClick={logout}
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Sign Out</span>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {/* Header */}
                <header className="h-20 bg-white border-b sticky top-0 z-30 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
                            <Navigation className="h-6 w-6" />
                        </Button>
                        <h2 className="text-xl font-bold text-gray-800">
                            {menuItems.find(m => m.path === location.pathname)?.label || "Dashboard"}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative h-10 w-10">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
                        </Button>
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{user?.fullName || "User"}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
                                {user?.fullName?.charAt(0) || "U"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8">
                    <Routes>
                        <Route path="/" element={<BookRide />} />
                        <Route path="/history" element={<RideHistory />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/settings" element={<div className="text-center py-20 bg-white rounded-3xl border border-dashed">Settings feature coming soon...</div>} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

// Sub-components
const BookRide = () => {
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        vehicleType: "bike" as "bike" | "auto" | "cab",
        paymentMethod: "cash"
    });
    const [distance, setDistance] = useState(0);
    const [isFinding, setIsFinding] = useState(false);
    const [activeRide, setActiveRide] = useState<any>(null);

    // Poll for active ride status
    useEffect(() => {
        const checkActiveRide = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/private/active-ride", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data) {
                    setActiveRide(res.data);
                    setIsFinding(false);
                } else {
                    setActiveRide(null);
                }
            } catch (error) {
                console.error("Status polling failed", error);
            }
        };

        checkActiveRide();
        const interval = setInterval(checkActiveRide, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const calculateFare = () => {
        const rate = formData.vehicleType === "bike" ? 10 : formData.vehicleType === "auto" ? 15 : 25;
        return distance * rate;
    };

    const handleBook = async () => {
        if (!formData.from || !formData.to) return toast.error("Please enter both locations");

        setIsFinding(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/private/placeorder",
                { ...formData, distance: Math.max(1, distance) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Rider assigned successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.msg || "Booking failed. Try again.");
            setIsFinding(false);
        }
    };

    if (activeRide) {
        return <ActiveRideView ride={activeRide} onDone={() => setActiveRide(null)} />;
    }

    return (
        <div className="grid grid-cols-1 lg:col-span-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-6">
                        <CardTitle>Where to?</CardTitle>
                        <CardDescription>Enter your pickup and destination</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-4">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-primary" />
                                <Input
                                    placeholder="Pickup location"
                                    className="pl-10 h-12 rounded-xl"
                                    value={formData.from}
                                    onChange={(e) => {
                                        setFormData({ ...formData, from: e.target.value });
                                        setDistance(Math.floor(Math.random() * 20) + 1); // Mock distance
                                    }}
                                />
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="Where are you going?"
                                    className="pl-10 h-12 rounded-xl"
                                    value={formData.to}
                                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <label className="text-sm font-semibold">Select Vehicle</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(["bike", "auto", "cab"] as const).map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setFormData({ ...formData, vehicleType: v })}
                                        className={`
                      p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                      ${formData.vehicleType === v ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/40'}
                    `}
                                    >
                                        <Bike className={`h-6 w-6 ${formData.vehicleType === v ? 'text-primary' : 'text-gray-400'}`} />
                                        <span className="text-xs font-bold capitalize">{v}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-sm text-muted-foreground">Estimated Fare</span>
                                <span className="text-xl font-bold text-gray-900">₹{calculateFare()}</span>
                            </div>
                            <Button
                                className="w-full h-14 rounded-2xl bg-primary text-black font-bold text-lg hover:bg-primary/90"
                                onClick={handleBook}
                                disabled={isFinding}
                            >
                                {isFinding ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" /> Finding Captain...
                                    </span>
                                ) : "Book Now"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-2 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                                <Shield className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Safe Commute</h4>
                                <p className="text-xs text-muted-foreground">Your safety is our top priority.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card className="h-full rounded-[2rem] border-2 shadow-sm overflow-hidden bg-white relative min-h-[500px]">
                    <div className="absolute inset-0 bg-[#E5E3DF] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://maps.gstatic.com/tactile/baseplate/3d-no-pnt-opt-1x.png')] bg-repeat" />
                        <div className="relative text-center">
                            <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <MapPin className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-muted-foreground font-medium">Interactive Map View</p>
                            <p className="text-xs text-muted-foreground mt-1 underline">Simulating live GPS feed</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const ActiveRideView = ({ ride, onDone }: { ride: any, onDone: () => void }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card className="rounded-[2rem] border-2 shadow-xl overflow-hidden border-primary/20">
                    <CardHeader className="bg-primary/10 pb-6 text-center">
                        <Badge className="w-fit mx-auto mb-2 bg-primary text-black border-none uppercase text-[10px] font-black tracking-widest">
                            {ride.status === 'pending' ? 'Searching...' : ride.status.toUpperCase()}
                        </Badge>
                        <CardTitle className="text-2xl">Ride In Progress</CardTitle>
                        <CardDescription>Share OTP with Captain to start</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-8">
                        <div className="bg-black rounded-3xl p-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                <Shield className="h-12 w-12 text-primary" />
                            </div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Ride OTP</p>
                            <h2 className="text-4xl font-black text-primary tracking-[0.5em] ml-[0.5em]">{ride.otp}</h2>
                        </div>

                        {ride.rider && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center text-2xl font-black shadow-lg">
                                        {ride.rider.fullName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-gray-900 text-lg">{ride.rider.fullName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="border-primary/50 text-primary-dark font-bold">
                                                ★ 4.9
                                            </Badge>
                                            <p className="text-xs font-bold text-muted-foreground">Premium Captain</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-muted/50 p-4 rounded-2xl border text-center">
                                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-wider">Vehicle</p>
                                        <p className="font-bold text-gray-900 capitalize">{ride.rider.vehicleType}</p>
                                    </div>
                                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 text-center">
                                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-wider">Number</p>
                                        <p className="font-bold text-gray-900">{ride.rider.vehicleRc}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">From:</span>
                                <span className="font-bold text-gray-900">{ride.rideDetails.from}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">To:</span>
                                <span className="font-bold text-gray-900">{ride.rideDetails.to}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t pt-4">
                                <span className="text-lg font-black">Total Fare</span>
                                <span className="text-2xl font-black text-primary-dark">₹{ride.rideDetails.fare}</span>
                            </div>
                        </div>

                        {ride.status === 'completed' && (
                            <Button className="w-full h-14 rounded-2xl bg-black text-white font-bold" onClick={onDone}>
                                Done
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card className="h-full rounded-[3rem] border-2 shadow-sm overflow-hidden bg-white relative min-h-[500px]">
                    <div className="absolute inset-0 bg-[#E5E3DF] flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://maps.gstatic.com/tactile/baseplate/3d-no-pnt-opt-1x.png')] bg-repeat" />
                        <div className="relative w-full h-full">
                            <motion.div
                                className="absolute top-1/2 left-1/4 w-3 h-3 bg-primary rounded-full shadow-lg z-20"
                                animate={{
                                    x: ride.status === 'ongoing' ? [0, 100, 200, 300] : 0,
                                    y: ride.status === 'ongoing' ? [0, -50, 20, 0] : 0
                                }}
                                transition={{ duration: 10, repeat: Infinity }}
                            >
                                <div className="absolute -top-1 w-full h-full bg-primary animate-ping rounded-full opacity-50" />
                                <Bike className="h-8 w-8 text-black absolute -top-8 -left-2.5" />
                                <div className="absolute -top-14 -left-10 bg-white px-3 py-1 rounded-full shadow-xl border text-[10px] font-black whitespace-nowrap">
                                    CAPTAIN {ride.rider?.fullName.split(' ')[0]}
                                </div>
                            </motion.div>

                            <div className="absolute top-[40%] left-[20%]">
                                <MapPin className="h-8 w-8 text-red-500 fill-red-200" />
                                <div className="bg-white px-3 py-1 rounded-full shadow-lg border text-[10px] font-bold mt-1">Pickup</div>
                            </div>

                            <div className="absolute bottom-[20%] right-[20%]">
                                <MapPin className="h-8 w-8 text-green-500 fill-green-200" />
                                <div className="bg-white px-3 py-1 rounded-full shadow-lg border text-[10px] font-bold mt-1">Destination</div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const RideHistory = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/private/user-history", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
                <CardTitle>Recent Rides</CardTitle>
                <CardDescription>A list of your completed and cancelled trips.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {loading ? (
                        <div className="p-10 text-center text-muted-foreground">Loading history...</div>
                    ) : history.length === 0 ? (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                <History className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground font-medium">No rides found yet. Time for your first trip?</p>
                            <Button variant="outline" asChild className="rounded-xl">
                                <Link to="/user/dashboard">Book Your First Ride</Link>
                            </Button>
                        </div>
                    ) : history.map((ride, i) => (
                        <div key={i} className="p-6 hover:bg-muted/30 transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Bike className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-900">{ride.rideDetails.from} to {ride.rideDetails.to}</p>
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Completed</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Latest
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold">₹{ride.rideDetails.fare}</p>
                                <p className="text-xs text-muted-foreground">Paid via Cash</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const UserProfile = () => {
    const { user } = useAuth();
    return (
        <div className="max-w-2xl mx-auto">
            <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden">
                <div className="h-40 bg-primary/20 relative">
                    <div className="absolute -bottom-12 left-10 w-24 h-24 rounded-3xl bg-primary border-4 border-white shadow-xl flex items-center justify-center text-3xl font-bold text-black">
                        {user?.fullName?.charAt(0)}
                    </div>
                </div>
                <CardContent className="pt-16 pb-10 px-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{user?.fullName}</h3>
                            <p className="text-muted-foreground">{user?.email}</p>
                        </div>
                        <Button variant="outline" className="rounded-xl font-semibold">Edit Profile</Button>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account Status</p>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="font-medium">Active & Verified</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Join Date</p>
                            <p className="font-medium text-gray-900">Feb 2026</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const Loader2 = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`animate-spin ${className}`}
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default UserDashboard;
