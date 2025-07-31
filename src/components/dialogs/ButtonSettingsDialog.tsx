import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChartButton } from "@/types/chart";
import { StoredRange } from '@/types/range';

interface ButtonSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isMobileMode: boolean;
  editingButton: ChartButton | null;
  setEditingButton: React.Dispatch<React.SetStateAction<ChartButton | null>>;
  onSave: () => void;
  onCancel: () => void;
  allRanges: StoredRange[];
  onOpenLegendPreview: () => void;
}

export const ButtonSettingsDialog = ({
  isOpen,
  onOpenChange,
  isMobileMode,
  editingButton,
  setEditingButton,
  onSave,
  onCancel,
  allRanges,
  onOpenLegendPreview,
}: ButtonSettingsDialogProps) => {

  const handleLinkedItemChange = (value: string) => {
    setEditingButton(prev => {
      if (!prev) return null;
      if (value === 'label-only') {
        return { ...prev, linkedItem: 'label-only', type: 'label' };
      }
      return { ...prev, linkedItem: value, type: 'normal' };
    });
  };

  if (!editingButton) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onCancel();
      } else {
        onOpenChange(true);
      }
    }}>
      <DialogContent mobileFullscreen={isMobileMode}>
        <DialogHeader>
          <DialogTitle>Настройка кнопки</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="buttonName" className="text-right">
              Название
            </Label>
            <Input
              id="buttonName"
              value={editingButton?.name || ""}
              onChange={(e) => setEditingButton(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="buttonColor" className="text-right">
              Цвет
            </Label>
            <Input
              id="buttonColor"
              type="color"
              value={editingButton?.color || "#000000"}
              onChange={(e) => setEditingButton(prev => prev ? { ...prev, color: e.target.value } : null)}
              className="col-span-3 h-10"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="linkedItem" className="text-right">
              Привязать
            </Label>
            <Select
              value={editingButton?.type === 'label' ? 'label-only' : editingButton?.linkedItem || ""}
              onValueChange={handleLinkedItemChange}
              disabled={editingButton?.type === 'exit'}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={
                  editingButton?.type === 'exit'
                    ? "Выход из режима просмотра чарта"
                    : editingButton?.type === 'label'
                    ? "Только текстовое обозначение"
                    : "Выберите чарт/диапазон"
                } />
              </SelectTrigger>
              <SelectContent>
                {editingButton?.type === 'exit' ? (
                  <SelectItem value="exit-chart-placeholder" disabled>Выход из режима просмотра чарта</SelectItem>
                ) : (
                  <>
                    <SelectItem value="label-only">Только текстовое обозначение</SelectItem>
                    {allRanges.map(range => (
                      <SelectItem key={range.id} value={range.id}>
                        {range.name}
                      </SelectItem>
                    ))}
                    {allRanges.length === 0 && (
                      <SelectItem value="no-ranges-available-placeholder" disabled>Нет доступных диапазонов</SelectItem>
                    )}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4 border-t pt-4 mt-2">
            <Label className="text-right">Шрифт</Label>
            <div className="col-span-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adaptiveFont"
                  checked={editingButton?.isFontAdaptive ?? true}
                  onCheckedChange={(checked) => {
                    setEditingButton(prev => prev ? { ...prev, isFontAdaptive: !!checked } : null);
                  }}
                />
                <Label htmlFor="adaptiveFont" className="font-normal">Адаптивный</Label>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  id="fontSize"
                  type="number"
                  value={editingButton?.fontSize || 16}
                  onChange={(e) => setEditingButton(prev => prev ? { ...prev, fontSize: parseInt(e.target.value) || 16 } : null)}
                  className="w-16 h-8"
                  min="1"
                  disabled={editingButton?.isFontAdaptive ?? true}
                />
                <Label htmlFor="fontSize" className="font-normal text-sm text-muted-foreground">px</Label>
              </div>

              <RadioGroup
                value={editingButton?.fontColor || 'white'}
                onValueChange={(value: 'white' | 'black') => {
                  setEditingButton(prev => prev ? { ...prev, fontColor: value } : null);
                }}
                className="flex gap-4"
                disabled={editingButton?.isFontAdaptive ?? true}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="white" id="fontWhite" />
                  <Label htmlFor="fontWhite" className="font-normal">Белый</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="black" id="fontBlack" />
                  <Label htmlFor="fontBlack" className="font-normal">Черный</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4 border-t pt-4 mt-2">
            <Label htmlFor="buttonWidth" className="text-right">
              Ширина
            </Label>
            <Input
              id="buttonWidth"
              type="number"
              value={editingButton?.width || 0}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setEditingButton(prev => prev ? { ...prev, width: isNaN(value) ? 0 : value } : null);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="buttonHeight" className="text-right">
              Высота
            </Label>
            <Input
              id="buttonHeight"
              type="number"
              value={editingButton?.height || 0}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setEditingButton(prev => prev ? { ...prev, height: isNaN(value) ? 0 : value } : null);
              }}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4 border-t pt-4 mt-2">
            <Label className="text-right col-start-1">Опции</Label>
            <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                    id="showLegend"
                    checked={editingButton?.showLegend ?? false}
                    onCheckedChange={(checked) => {
                        setEditingButton(prev => prev ? { ...prev, showLegend: !!checked } : null);
                    }}
                    disabled={editingButton?.type === 'label' || editingButton?.type === 'exit'}
                />
                <Label htmlFor="showLegend" className="font-normal">
                    Показать легенду
                </Label>
                {editingButton?.showLegend && editingButton?.type === 'normal' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 ml-2"
                    onClick={onOpenLegendPreview}
                  >
                    Предпросмотр
                  </Button>
                )}
            </div>
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Отмена</Button>
          <Button onClick={onSave}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
