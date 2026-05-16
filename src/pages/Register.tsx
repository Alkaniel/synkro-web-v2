import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff } from "lucide-react";
import { api } from "../api/client.ts";

import synkroLogo from "@/assets/logo_synkro_condensed.svg";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {useAuth} from "@/context/AuthContext.tsx";

export default function Register() {
    const navigate = useNavigate();
    const {login} = useAuth();

    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        email: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleBack = () => {
        setError('');
        setStep(step - 1);
    };

    const handleFormSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError('');

        if (step === 1) {
            if (!formData.firstName || !formData.lastName) {
                setError("Veuillez remplir votre nom et prénom.");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (formData.password.length < 6) {
                setError("Le mot de passe doit faire au moins 6 caractères.");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Les mots de passe ne correspondent pas.");
                return;
            }
            setStep(3);
        } else if (step === 3) {
            if (!formData.email) {
                setError("Veuillez entrer une adresse email.");
                return;
            }

            try {
                const payload = {
                    email: formData.email,
                    password: formData.password,
                    username: `${formData.firstName} ${formData.lastName}`.trim(),
                };

                const response = await api.post<{accessToken: string }>('/auth/register', payload, { credentials: "include" });
                login(response.accessToken)

                navigate('/dashboard');

            } catch (err: any) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 gap-10 bg-gradient-to-br from-[#6898E4] to-[#BED3F3]">
            <div className="flex flex-col items-center gap-2">
                <img className="w-20 h-20" src={synkroLogo} alt="Synkro Logo" />
                <h1 className="text-lg font-medium text-white/80 tracking-wide">
                    Bienvenue sur Synkro
                </h1>
            </div>

            <Card className="w-full max-w-[360px] bg-[#D6E4F7]/95 border-none shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 pt-6 space-y-4">
                    <div className="flex gap-2 w-full">
                        <div className={`h-1.5 rounded-full flex-1 ${step >= 1 ? 'bg-[#6492DB]' : 'bg-[#EBF2FC]'}`} />
                        <div className={`h-1.5 rounded-full flex-1 ${step >= 2 ? 'bg-[#6492DB]' : 'bg-[#EBF2FC]'}`} />
                        <div className={`h-1.5 rounded-full flex-1 ${step >= 3 ? 'bg-[#6492DB]' : 'bg-[#EBF2FC]'}`} />
                    </div>

                    <div>
                        <CardTitle className="text-lg font-bold text-[#1a2b4c]">
                            Créer mon compte
                        </CardTitle>
                        <p className="text-xs text-[#85A1CA] mt-1 font-medium">
                            Étape {step} sur 3
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="pb-8">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-100/80 text-red-700 p-3 rounded-lg mb-5 text-xs font-medium border border-red-200">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#85A1CA]" />
                                    <Input
                                        id="firstName"
                                        placeholder="Prénom"
                                        className="pl-9 bg-[#EBF2FC] text-[#1a2b4c] placeholder:text-[#85A1CA] border-none focus-visible:ring-2 focus-visible:ring-[#6E9ADB] rounded-lg h-10 shadow-inner"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#85A1CA]" />
                                    <Input
                                        id="lastName"
                                        placeholder="Nom"
                                        className="pl-9 bg-[#EBF2FC] text-[#1a2b4c] placeholder:text-[#85A1CA] border-none focus-visible:ring-2 focus-visible:ring-[#6E9ADB] rounded-lg h-10 shadow-inner"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                 </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#85A1CA]" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mot de passe"
                                        className="pl-9 pr-12 bg-[#EBF2FC] text-[#1a2b4c] placeholder:text-[#85A1CA] border-none focus-visible:ring-2 focus-visible:ring-[#6E9ADB] rounded-lg h-10 shadow-inner"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-[#85A1CA] hover:text-[#527BC4] transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#85A1CA]" />
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirmer le mot de passe"
                                        className="pl-9 pr-12 bg-[#EBF2FC] text-[#1a2b4c] placeholder:text-[#85A1CA] border-none focus-visible:ring-2 focus-visible:ring-[#6E9ADB] rounded-lg h-10 shadow-inner"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-[#85A1CA] hover:text-[#527BC4] transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#85A1CA]" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email.com"
                                        className="pl-9 bg-[#EBF2FC] text-[#1a2b4c] placeholder:text-[#85A1CA] border-none focus-visible:ring-2 focus-visible:ring-[#6E9ADB] rounded-lg h-10 shadow-inner"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    onClick={handleBack}
                                    className="w-12 bg-white hover:bg-gray-50 text-[#6492DB] shadow-md rounded-lg h-10 border-none transition-colors shrink-0 p-0"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            )}

                            {step < 3 ? (
                                <Button
                                    type="submit"
                                    className="flex-1 bg-[#6492DB] hover:bg-[#527BC4] text-white font-semibold rounded-lg h-10 shadow-md transition-colors flex justify-center items-center gap-2"
                                >
                                    Suivant <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="flex-1 bg-[#6492DB] hover:bg-[#527BC4] text-white font-semibold rounded-lg h-10 shadow-md transition-colors flex justify-center items-center gap-2"
                                >
                                    Terminer
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8 text-xs font-medium text-white/90">
                Déjà un compte ?{" "}
                <a href="/login" className="font-bold hover:underline transition-all">
                    Se connecter
                </a>
            </div>
        </div>
    );
}