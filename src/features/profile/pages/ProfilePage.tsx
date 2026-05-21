import {useAuth} from "@/context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {type SyntheticEvent, useEffect, useState} from "react";
import {usersApi} from "@/api/user.ts";
import {toast} from "sonner";
import {ApiError} from "@/api/errors.ts";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [infoLoading, setInfoLoading] = useState(false);
    const [infoFieldErrors, setInfoFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    const handleUpdateInfo = async (e: SyntheticEvent) => {
        e.preventDefault();
        setInfoLoading(true);
        setInfoFieldErrors({});
        try {
            await usersApi.update({ username, email});
            toast.success("Profil mis à jour");
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.isValidationError) setInfoFieldErrors(err.fields ?? {});
                else toast.error(err.message);
            } else {
                toast.error("Erreur inattendue");
            }
        } finally {
            setInfoLoading(false);
        }
    }

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwdLoading, setPwdLoading] = useState(false);

    const handleUpdatePassword = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        setPwdLoading(true);
        try {
            await usersApi.updatePassword({currentPassword, newPassword});
            toast.success("Mot de passe mis à jour");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            if (err instanceof ApiError) toast.error(err.message);
            else toast.error("Erreur inattendue");
        } finally {
            setPwdLoading(false);
        }
    }

    const handleDeleteAccount = async () => {
        if (!confirm("Tu veux supprimer ton compte ? Cette action est irréversible.")) return;

        try {
            await usersApi.deleteMe();
            try {
                await logout();
            } catch {}
            navigate("/login");
        } catch (err) {
            if (err instanceof ApiError) toast.error(err.message);
            else toast.error("Erreur inattendue");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-2xl font-bold">Mon profil</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Informations du compte</h2>
                    <form onSubmit={handleUpdateInfo} className="space-y-4">
                        <div>
                            <Label htmlFor="username">Nom d'affichage</Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                            {infoFieldErrors.username && (
                                <p className="text-sm text-red-600 mt-1">{infoFieldErrors.username}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">Adresse email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                            {infoFieldErrors.email && (
                                <p className="text-sm text-red-600 mt-1">{infoFieldErrors.email}</p>
                            )}
                        </div>

                        <Button type="submit" disabled={infoLoading} className="w-full">
                            {infoLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </form>
                </div>

                <div className="bg-white rounded-lg border p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Sécurité</h2>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                            <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required/>
                        </div>

                        <div>
                            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="16 caractères minimum" required/>
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Répétez le mot de passe" required/>
                        </div>

                        <Button type="submit" disabled={pwdLoading} className="w-full">
                            {pwdLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                        </Button>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-red-200 p-6">
                <h2 className="text-lg font-semibold text-red-600 mb-2">Zone dangereuse</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Supprimer ton compte efface définitivement toutes tes données.
                    Tu dois d'abord transférer la propriété de tes projets ou les supprimer.
                </p>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                    Supprimer mon compte
                </Button>
            </div>
        </div>
    );
}