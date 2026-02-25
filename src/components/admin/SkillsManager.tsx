
'use client';

import * as React from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Plus, Edit2, Trash2, Loader2, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string;
  order: number;
  visible: boolean;
}

export function SkillsManager() {
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [currentSkill, setCurrentSkill] = React.useState<Partial<Skill> | null>(null);
  const { toast } = useToast();

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedSkills = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
      setSkills(fetchedSkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenDialog = (skill?: Skill) => {
    setCurrentSkill(skill || { name: '', category: 'Frontend', icon: '', order: skills.length, visible: true });
    setIsDialogOpen(true);
  };

  const handleSaveSkill = async () => {
    if (!currentSkill?.name || !currentSkill?.category) return;

    try {
      if (currentSkill.id) {
        const { id, ...data } = currentSkill;
        await updateDoc(doc(db, 'skills', id), data);
      } else {
        await addDoc(collection(db, 'skills'), currentSkill);
      }
      setIsDialogOpen(false);
      fetchSkills();
      toast({ title: 'Success', description: 'Skill saved successfully.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save skill.' });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await deleteDoc(doc(db, 'skills', id));
      fetchSkills();
      toast({ title: 'Success', description: 'Skill deleted.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete skill.' });
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Skills Inventory</CardTitle>
          <CardDescription>Manage the technical expertise displayed in your marquee rows.</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell><GripVertical className="w-4 h-4 text-muted-foreground/30" /></TableCell>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{skill.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={skill.visible ? "default" : "outline"}>
                    {skill.visible ? 'Show' : 'Hide'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(skill)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSkill(skill.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentSkill?.id ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
            <DialogDescription>Configure the skill name and appearance details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input 
                id="name" 
                value={currentSkill?.name || ''} 
                onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={currentSkill?.category} 
                  onValueChange={(val) => setCurrentSkill({ ...currentSkill, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input 
                  id="order" 
                  type="number" 
                  value={currentSkill?.order || 0} 
                  onChange={(e) => setCurrentSkill({ ...currentSkill, order: parseInt(e.target.value) })} 
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="visible">Show on Portfolio</Label>
              <Switch 
                id="visible" 
                checked={currentSkill?.visible} 
                onCheckedChange={(val) => setCurrentSkill({ ...currentSkill, visible: val })} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSkill}>Save Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
