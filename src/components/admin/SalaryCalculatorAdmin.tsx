import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CalculatorParam {
  id: string;
  param_key: string;
  param_value: Record<string, unknown>;
  description: string | null;
  category: string | null;
  updated_at: string;
}

const CATEGORIES = ['rates', 'tariffs', 'fix_percent', 'variable_percent', 'roles', 'other'];

const SalaryCalculatorAdmin = () => {
  const [params, setParams] = useState<CalculatorParam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [editingParam, setEditingParam] = useState<CalculatorParam | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // New param state
  const [newParam, setNewParam] = useState({
    param_key: '',
    param_value: '{}',
    description: '',
    category: 'other',
  });

  const loadParams = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('salary_calculator_params')
        .select('*')
        .order('category', { ascending: true })
        .order('param_key', { ascending: true });
      
      if (error) throw error;
      setParams((data || []) as CalculatorParam[]);
    } catch (err) {
      console.error('Error loading params:', err);
      toast.error('Ошибка загрузки параметров');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParams();
  }, []);

  const handleEdit = (param: CalculatorParam) => {
    setEditingParam(param);
    setEditValue(JSON.stringify(param.param_value, null, 2));
  };

  const handleSave = async () => {
    if (!editingParam) return;
    
    setIsSaving(editingParam.id);
    try {
      const parsedValue = JSON.parse(editValue);
      
      const { error } = await supabase
        .from('salary_calculator_params')
        .update({ param_value: parsedValue })
        .eq('id', editingParam.id);
      
      if (error) throw error;
      
      toast.success('Параметр сохранён');
      setEditingParam(null);
      loadParams();
    } catch (err) {
      console.error('Error saving param:', err);
      toast.error('Ошибка сохранения. Проверьте JSON формат.');
    } finally {
      setIsSaving(null);
    }
  };

  const handleAddParam = async () => {
    try {
      const parsedValue = JSON.parse(newParam.param_value);
      
      const { error } = await supabase
        .from('salary_calculator_params')
        .insert({
          param_key: newParam.param_key,
          param_value: parsedValue,
          description: newParam.description || null,
          category: newParam.category,
        });
      
      if (error) throw error;
      
      toast.success('Параметр добавлен');
      setIsAddDialogOpen(false);
      setNewParam({ param_key: '', param_value: '{}', description: '', category: 'other' });
      loadParams();
    } catch (err) {
      console.error('Error adding param:', err);
      toast.error('Ошибка добавления. Проверьте JSON формат.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить параметр?')) return;
    
    try {
      const { error } = await supabase
        .from('salary_calculator_params')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Параметр удалён');
      loadParams();
    } catch (err) {
      console.error('Error deleting param:', err);
      toast.error('Ошибка удаления');
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'rates': return 'bg-blue-500/20 text-blue-400';
      case 'tariffs': return 'bg-green-500/20 text-green-400';
      case 'fix_percent': return 'bg-yellow-500/20 text-yellow-400';
      case 'variable_percent': return 'bg-purple-500/20 text-purple-400';
      case 'roles': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-white/10 text-white/70';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Параметры калькулятора зарплаты</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadParams}
            className="text-white/70 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-accent hover:bg-accent/80 text-primary">
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-primary border-white/10 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Добавить параметр</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/70">Ключ параметра</label>
                  <Input
                    value={newParam.param_key}
                    onChange={(e) => setNewParam(prev => ({ ...prev, param_key: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="tariff_online_8h"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70">Категория</label>
                  <Select 
                    value={newParam.category} 
                    onValueChange={(v) => setNewParam(prev => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-primary border-white/10">
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-white/70">Описание</label>
                  <Input
                    value={newParam.description}
                    onChange={(e) => setNewParam(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Описание параметра"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70">Значение (JSON)</label>
                  <Textarea
                    value={newParam.param_value}
                    onChange={(e) => setNewParam(prev => ({ ...prev, param_value: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white font-mono min-h-[150px]"
                    placeholder='{"key": "value"}'
                  />
                </div>
                <Button onClick={handleAddParam} className="w-full bg-accent hover:bg-accent/80 text-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingParam} onOpenChange={(open) => !open && setEditingParam(null)}>
        <DialogContent className="bg-primary border-white/10 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать: {editingParam?.param_key}</DialogTitle>
          </DialogHeader>
          {editingParam && (
            <div className="space-y-4">
              <div className="text-sm text-white/60">
                {editingParam.description}
              </div>
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="bg-white/5 border-white/10 text-white font-mono min-h-[300px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setEditingParam(null)} className="text-white/70">
                  Отмена
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={!!isSaving}
                  className="bg-accent hover:bg-accent/80 text-primary"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Сохранить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="glass-dark rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">Ключ</TableHead>
                <TableHead className="text-white/70">Категория</TableHead>
                <TableHead className="text-white/70">Описание</TableHead>
                <TableHead className="text-white/70">Значение (preview)</TableHead>
                <TableHead className="text-white/70 w-24">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.map((param) => (
                <TableRow key={param.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white font-mono text-sm">
                    {param.param_key}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(param.category)}`}>
                      {param.category || 'other'}
                    </span>
                  </TableCell>
                  <TableCell className="text-white/60 text-sm max-w-[200px] truncate">
                    {param.description || '—'}
                  </TableCell>
                  <TableCell className="text-white/50 text-xs font-mono max-w-[300px] truncate">
                    {JSON.stringify(param.param_value).substring(0, 100)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(param)}
                        className="text-accent hover:text-accent/80 p-1"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(param.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculatorAdmin;
