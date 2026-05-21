import {useState, useEffect, type SyntheticEvent} from 'react';
import { toast } from 'sonner';
import { projectsApi } from '@/api/projects';
import { ApiError } from '@/api/errors';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ProjectResponse } from '@/types/api';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (project: ProjectResponse) => void;
  project?: ProjectResponse;
}

export default function ProjectFormDialog({ open, onOpenChange, onSuccess, project }: Props) {
  const isEdit = !!project;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(project?.name ?? '');
      setDescription(project?.description ?? '');
      setFieldErrors({});
    }
  }, [open, project]);

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    try{
      const result =
          isEdit ? await projectsApi.update(project!.id, { name, description: description || undefined})
              : await projectsApi.create({ name, description: description || undefined });
      toast.success(isEdit ? 'Projet mis à jour' : 'Projet créé');
      onSuccess(result)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.isValidationError) setFieldErrors(err.fields ?? {});
        else toast.error(err.message);
      } else {
        toast.error("Une erreur inattendue s'est produite");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Modifier le projet' : 'Nouveau projet'}</DialogTitle>
            </DialogHeader>

            <div>
              <Label htmlFor="name">Nom</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              {fieldErrors.name && <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />
              {fieldErrors.description && <p className="text-sm text-red-600 mt-1">{fieldErrors.description}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}