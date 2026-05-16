import { useNavigate } from 'react-router-dom';
import {Button} from "@/components/ui/button.tsx";

export default function Dashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Tableau de Bord Synkro</h1>
            <p className="text-gray-600 mb-8">Bravo, tu es dans la zone sécurisée !</p>

            <Button onClick={handleLogout} variant="destructive">
                Se déconnecter
            </Button>
        </div>
    )
}