import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
    Bike,
    History,
    User,
    LogOut,
    Navigation,
    Zap,
    Power,
    TrendingUp,
    Wallet,
    ShieldCheck,
    Phone,
    ArrowRight,
    CircleSlash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import axios from "axios";

const SidebarItem = ({ icon: Icon, label, path, active }: any) => (
    <Link to={path}>
        <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer mb-1
      ${active ? 'bg-primary text-black font-bold shadow-md' : 'hover:bg-muted text-muted-foreground'}
    `}>
            <Icon className={`h-5 w-5 ${active ? 'text-black' : ''}`} />
            <span className="text-sm">{label}</span>
        </div>
    </Link>
);

const RiderDashboard = () => {
    const { user, logout, token } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        if (!token && !localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [token, navigate]);

    const menuItems = [
        { icon: Navigation, label: "Captain View", path: "/rider/dashboard" },
        { icon: Wallet, label: "Earnings", path: "/rider/dashboard/earnings" },
        { icon: History, label: "Trip History", path: "/rider/dashboard/history" },
        { icon: User, label: "Profile", path: "/rider/dashboard/profile" },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            <aside className={`
        fixed left-0 top-0 h-full bg-white border-r z-40 transition-all duration-300 w-64
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-10">
                        <div className="bg-primary p-2 rounded-lg">
                            <Bike className="text-black h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">RAPIDO <span className="text-primary italic">CAPTAIN</span></span>
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

            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <header className="h-20 bg-white border-b sticky top-0 z-30 flex items-center justify-between px-8">
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
                            <Navigation className="h-6 w-6" />
                        </Button>

                        <div className={`
                flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all
                ${isOnline ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50'}
             `}>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className={`text-sm font-bold ${isOnline ? 'text-green-700' : 'text-gray-500'}`}>
                                {isOnline ? 'ONLINE' : 'OFFLINE'}
                            </span>
                            <Switch
                                checked={isOnline}
                                onCheckedChange={async (val: boolean) => {
                                    try {
                                        const token = localStorage.getItem("token");
                                        const endpoint = val ? "/private/rider-onduty" : "/private/rider-offduty";
                                        await axios.get(`http://localhost:5000${endpoint}`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        setIsOnline(val);
                                        toast(val ? "You are now online and ready for rides!" : "You are now offline", {
                                            icon: val ? <Zap className="h-4 w-4 text-green-500" /> : <Power className="h-4 w-4 text-gray-500" />
                                        });
                                    } catch (error) {
                                        toast.error("Failed to update status");
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-muted/50 px-4 py-2 rounded-xl border flex items-center gap-3">
                            <Wallet className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold">₹0.00</span>
                        </div>
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{user?.fullName || "Captain"}</p>
                                <Badge variant="secondary" className="bg-primary/20 text-black text-[10px] h-4">PLATINUM</Badge>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-primary font-bold border-2 border-primary">
                                {user?.fullName?.charAt(0) || "C"}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <Routes>
                        <Route path="/" element={<CaptainMain isOnline={isOnline} />} />
                        <Route path="/history" element={<CaptainHistory />} />
                        <Route path="/earnings" element={<div className="text-center py-20 bg-white rounded-3xl border border-dashed">Earnings report coming soon...</div>} />
                        <Route path="/profile" element={<div className="text-center py-20 bg-white rounded-3xl border border-dashed">Profile details coming soon...</div>} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

const CaptainMain = ({ isOnline }: { isOnline: boolean }) => {
    const [activeRide, setActiveRide] = useState<any>(null);

    useEffect(() => {
        const checkActiveDuty = async () => {
            if (!isOnline) {
                setActiveRide(null);
                return;
            }
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/private/rider-active-duty", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setActiveRide(res.data);
            } catch (error) {
                console.error("Active duty check failed", error);
            }
        };

        checkActiveDuty();
        const interval = setInterval(checkActiveDuty, 3000);
        return () => clearInterval(interval);
    }, [isOnline]);

    const updateStatus = async (status: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put("http://localhost:5000/private/update-ride-status",
                { rideId: activeRide._id, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Trip is now ${status}`);
        } catch (error) {
            toast.error("Failed to update trip status");
        }
    };

    if (activeRide) {
        return (
            <div className="max-w-xl mx-auto space-y-6">
                <Card className="rounded-[2.5rem] border-2 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    <CardHeader className="bg-black text-white p-8">
                        <div className="flex justify-between items-center mb-4">
                            <Badge className="bg-primary text-black border-none font-black">{activeRide.status.toUpperCase()}</Badge>
                            <span className="text-xs text-gray-400">Incoming Request</span>
                        </div>
                        <h2 className="text-3xl font-black">Pickup: {activeRide.customer?.fullName}</h2>
                        <div className="flex items-center gap-2 mt-2 text-primary">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm font-bold">{activeRide.customer?.phone}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center pt-1 gap-1">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <div className="w-0.5 h-10 bg-gray-200" />
                                <div className="w-3 h-3 rounded-full bg-black" />
                            </div>
                            <div className="space-y-6 flex-1">
                                <div>
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Pickup From</p>
                                    <p className="font-bold text-lg leading-tight">{activeRide.rideDetails.from}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Drop To</p>
                                    <p className="font-bold text-lg leading-tight">{activeRide.rideDetails.to}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Earnings</p>
                                <p className="text-2xl font-black text-green-600">₹{activeRide.rideDetails.fare}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Distance</p>
                                <p className="text-2xl font-black">{activeRide.rideDetails.distance} KM</p>
                            </div>
                        </div>

                        {activeRide.status === 'pending' && (
                            <div className="space-y-3 pt-4">
                                <Button className="w-full h-16 rounded-2xl bg-primary text-black font-black text-lg hover:bg-primary/90" onClick={() => updateStatus('accepted')}>
                                    Accept Request
                                </Button>
                                <Button variant="ghost" className="w-full h-12 rounded-2xl text-red-500 font-bold hover:bg-red-50" onClick={() => updateStatus('cancelled')}>
                                    Ignore
                                </Button>
                            </div>
                        )}

                        {activeRide.status === 'accepted' && (
                            <div className="space-y-3 pt-4">
                                <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-4 text-center">
                                    <p className="text-sm font-bold">Ask customer for OTP to start trip</p>
                                </div>
                                <Button className="w-full h-16 rounded-2xl bg-black text-white font-black text-lg" onClick={() => updateStatus('ongoing')}>
                                    Start Trip <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        )}

                        {activeRide.status === 'ongoing' && (
                            <div className="space-y-3 pt-4">
                                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-4 text-center animate-pulse">
                                    <p className="text-sm font-bold text-green-700">Trip is currently active</p>
                                </div>
                                <Button className="w-full h-16 rounded-2xl bg-green-600 text-white font-black text-lg hover:bg-green-700" onClick={() => updateStatus('completed')}>
                                    End Trip & Collect Cash
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Cards ... (Keep existing stats) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[2rem] border-none shadow-sm bg-black text-white p-2">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm">Today's Earnings</p>
                                <h3 className="text-3xl font-bold mt-1 text-primary">₹0.00</h3>
                            </div>
                            <div className="bg-primary/20 p-3 rounded-2xl">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-none shadow-sm bg-white p-2">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-muted-foreground text-sm">Total Distance</p>
                                <h3 className="text-3xl font-bold mt-1">0.0 km</h3>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-2xl">
                                <Navigation className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-none shadow-sm bg-white p-2">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-muted-foreground text-sm">Captain Rating</p>
                                <h3 className="text-3xl font-bold mt-1">5.00</h3>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-2xl">
                                <ShieldCheck className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden min-h-[400px]">
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary fill-primary" />
                            Live Demand
                        </CardTitle>
                        <CardDescription>Hotspots in your area with surge pricing.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 bg-[#E5E3DF] flex items-center justify-center relative min-h-[300px]">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://maps.gstatic.com/tactile/baseplate/3d-no-pnt-opt-1x.png')] bg-repeat" />
                        {!isOnline && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
                                    <Power className="h-8 w-8 text-gray-400" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">You're Offline</h4>
                                <p className="text-muted-foreground text-sm max-w-xs">Go online to start receiving ride requests.</p>
                            </div>
                        )}
                        {isOnline ? (
                            <div className="relative z-0 text-center">
                                <div className="w-20 h-20 bg-primary/20 rounded-full animate-ping absolute -top-6 -left-6" />
                                <div className="bg-white p-4 rounded-3xl shadow-xl border flex flex-col items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                    <span className="font-black text-xs uppercase tracking-widest text-gray-500">Searching for Rides...</span>
                                </div>
                            </div>
                        ) : (
                            <CircleSlash className="h-12 w-12 text-gray-300" />
                        )}
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                        <Bike className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">Duty status ready.</p>
                    <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                        Incoming requests will provide pickup and drop locations along with estimated earnings.
                    </p>
                </Card>
            </div>
        </div>
    );
};

const CaptainHistory = () => {
    return (
        <Card className="rounded-[2rem] border-2 shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
                <CardTitle>Trip History</CardTitle>
                <CardDescription>All your historical rides and earnings.</CardDescription>
            </CardHeader>
            <CardContent className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">Your trip history is empty.</p>
            </CardContent>
        </Card>
    );
};

export default RiderDashboard;
