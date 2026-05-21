import type {ProjectDetailResponse, ProjectRole} from "@/types/api.ts";
import {useAuth} from "@/context/AuthContext.tsx";
import {type SyntheticEvent, useState} from "react";
import {projectsApi} from "@/api/projects.ts";
import {toast} from "sonner";
import {ApiError} from "@/api/errors.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";

interface Props {
    project: ProjectDetailResponse;
    onChange: () => void;
}

const roleBadgeClass: Record<ProjectRole, string> = {
    OWNER: 'bg-purple-100 text-purple-700',
    EDITOR: 'bg-blue-100 text-blue-700',
    VIEWER: 'bg-gray-100 text-gray-600'
};

export default function MembersPanel({ project, onChange }: Props) {
    const { user } = useAuth();

    const isOwner = project.owner.id === user?.id;

    const [addUserEmail, setAddUserEmail] = useState('');
    const [addRole, setAddRole] = useState<"EDITOR" | "VIEWER">("VIEWER");
    const [addLoading, setAddLoading] = useState(false);

    const handleAddMember = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!addUserEmail.trim()) return;
        setAddLoading(true);
        try {
            await projectsApi.addMember(project.id, {
               email: addUserEmail.trim(),
               role: addRole
            });
            toast.success("Membre ajouté au projet");
            setAddUserEmail("");
            onChange();
        } catch (err) {
            if (err instanceof ApiError) toast.error(err.message);
            else toast.error('Erreur inattendue');
        } finally {
            setAddLoading(false);
        }
    };

    const handleChangeRole = async (email: string, newRole: 'EDITOR' | 'VIEWER') => {
        try {
            await projectsApi.updateMemberRole(project.id, email, newRole);
            toast.success("Role mis à jour");
            onChange();
        } catch (err) {
            if (err instanceof ApiError) toast.error(err.message);
            else toast.error("Erreur inattendue");
        }
    };

    const handleRemoveMember = async (userId: string, username: string) => {
        if (!confirm(`Retirer ${username} du projet ?`)) return;
        try {
            await projectsApi.removeMember(project.id, userId);
            toast.success(`${username} a été retiré du projet`);
            onChange();
        } catch (err) {
            if (err instanceof ApiError) toast.error(err.message);
            else toast.error("Erreur inattendue");
        }
    };

    const handleTransfer = async (userEmail: string, username: string) => {
        if (!confirm(`Transférer la propriété du projet à ${username} ? Vous deviendrez EDITOR.`)) return;
        try {
            await projectsApi.transferOwnership(project.id, userEmail);
            toast.success(`Propriété transférée à ${username}`);
            onChange();
        } catch (err) {
            if (err instanceof ApiError) toast.error(err.message);
            else toast.error("Erreur inattendue");
        }
    };

    return (
        <div className="space-y-4">
            <ul className="divide-y border rounded-lg overflow-hidden bg-white">
                {project.participants.map(({ user: member, projectRole: role }) => (
                    <li key={member.id} className="flex items-center justify-between px-4 py-3">

                        <div className="flex items-center gap-3">
                            <div>
                                <span className="font-medium text-sm">{member.username}</span>
                                <span className="text-xs text-gray-500 ml-2">{member.email}</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeClass[role]}`}>
                                {role}
                            </span>
                        </div>

                        {isOwner && role !== 'OWNER' && (
                            <div className="flex items-center gap-2">
                                <Select value={role} onValueChange={(v) => handleChangeRole(member.email, v as 'EDITOR' | 'VIEWER')}>
                                    <SelectTrigger className="w-28 h-8 text-sm">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EDITOR">Editor</SelectItem>
                                        <SelectItem value="VIEWER">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button variant="outline" size="sm" onClick={() => handleTransfer(member.email, member.username)}>
                                    Transférer la propriété
                                </Button>

                                <Button variant="destructive" size="sm" onClick={() => handleRemoveMember(member.id, member.username)}>
                                    Retirer
                                </Button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {isOwner && (
                <>
                    <form onSubmit={handleAddMember} className="flex gap-2 items-end pt-2">
                        <div className="flex-1">
                            <Label htmlFor="addUserId" className="text-sm mb-1 block">
                                Ajouter un membre par email
                            </Label>
                            <Input id="addUserEmail" value={addUserEmail} onChange={(e) => setAddUserEmail(e.target.value)} placeholder="john@synkro.fr"/>
                        </div>
                        <div>
                            <Label className="text-sm mb-1 block">Rôle</Label>
                            <Select value={addRole} onValueChange={(v) => setAddRole(v as 'EDITOR' | 'VIEWER')}>
                                <SelectTrigger className="w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EDITOR">Editor</SelectItem>
                                    <SelectItem value="VIEWER">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" disabled={addLoading}>
                            {addLoading ? 'Ajout...' : 'Ajouter'}
                        </Button>
                    </form>
                </>
            )}
        </div>
    );
}

