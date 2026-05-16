import {useState} from "react";
import {Mail, Lock, EyeOff, Eye, AlertCircle} from "lucide-react";
import {api} from "../api/client.ts";

import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

import synkroLogo from '@/assets/logo_synkro_condensed.svg'
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext.tsx";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post<{accessToken: string}>('/auth/login', { email, password }, { credentials: "include" });
            login(response.accessToken)
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 gap-10 bg-gradient-to-br from-[#6898E4] to-[#BED3F3]">
            <div className="flex flex-col items-center gap-2">
                <img className="w-20 h-20" src={synkroLogo} alt="Synkro Logo" />
                <h1 className="text-lg font-medium text-white/60 tracking-wide">
                    Bienvenue sur Synkro
                </h1>
            </div>

            {/* La Carte Shadcn */}
            <Card className="w-full max-w-[360px] bg-[#D6E4F7]/95 border-none shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-lg font-bold text-[#1a2b4c]">
                        Se connecter
                    </CardTitle>
                </CardHeader>

                <CardContent className="pb-8">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-100/80 text-red-700 p-3 rounded-lg mb-5 text-xs font-medium border border-red-200">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-[#85A1CA]" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                className="pl-9 bg-[#EBF2FC] text-[#1a2b4c] placeholder:text-[#85A1CA] border-none focus-visible:ring-2 focus-visible:ring-[#6E9ADB] rounded-lg h-10 shadow-inner"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#85A1CA]" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Mot de passe"
                                className="pl-9 pr-10 bg-[#EBF2FC] text-[#1a2b4c] placeholder:text-[#85A1CA] border-none focus-visible:ring-2 focus-visible:ring-[#6E9ADB] rounded-lg h-10 shadow-inner"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#85A1CA] hover:text-[#527BC4] transition-colors focus:outline-none">
                                {showPassword ? (
                                        <EyeOff className="top-3 h-4 w-4"/>
                                    ) : (
                                        <Eye className="top-3 h-4 w-4"/>
                                    )}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-2 bg-[#6492DB] hover:bg-[#527BC4] text-white font-semibold rounded-lg h-10 transition-colors shadow-md"
                        >
                            Connexion
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Le lien d'inscription */}
            <div className="mt-8 text-xs font-medium text-white/90">
                Pas encore de compte ?{" "}
                <a href="/register" className="font-bold hover:underline transition-all">
                    Créer un compte
                </a>
            </div>

        </div>
    )
}