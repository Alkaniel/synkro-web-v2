import {type SyntheticEvent, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {useAuth} from "@/context/AuthContext.tsx";
import {Label} from "@/components/ui/label.tsx";
import {toast} from "sonner";
import {ApiError} from "@/api/errors.ts";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const onSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});
        try {
            await register(username, email, password);
            navigate('/projects');
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.isValidationError) setFieldErrors(err.fields ?? {});
                else toast.error(err.message);
            } else {
                toast.error('Erreur inattendue');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold">Inscription</h1>

                <div>
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    {fieldErrors.username && <p className="text-sm text-red-600 mt-1">{fieldErrors.username}</p>}
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    {fieldErrors.email && <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>}
                </div>

                <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {fieldErrors.password && <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Création...' : "S'inscrire"}
                </Button>

                <p className="text-sm text-center">
                    Déjà inscrit ? <Link to="/login" className="text-blue-600 underline">Connecte-toi</Link>
                </p>
            </form>
        </div>
    );
}