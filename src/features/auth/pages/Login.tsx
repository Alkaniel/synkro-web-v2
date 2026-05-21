import {type SyntheticEvent, useState} from "react";


import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext.tsx";
import {ApiError} from "@/api/errors.ts";
import {toast} from "sonner";
import {Label} from "@/components/ui/label.tsx";

export function Login() {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({})
        try {
            await login(email, password);
            navigate("/projects");
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.isValidationError) setFieldErrors(err.fields ?? {});
                else toast.error(err.message);
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-bold">Connexion</h1>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {fieldErrors.email && <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>}
                </div>

                <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {fieldErrors.password && <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Connexion...' : 'Se connecter'}
                </Button>

                <p className="text-sm text-center">
                    Pas de compte ? <Link to="/register" className="text-blue-600 underline">Inscris-toi</Link>
                </p>
            </form>
        </div>
    )
}