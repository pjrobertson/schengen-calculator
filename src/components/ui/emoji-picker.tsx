import { useState } from 'react';
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';

interface EmojiPickerPopoverProps {
  value?: string;
  onChange: (emoji: string) => void;
  children?: React.ReactNode;
}

export function EmojiPickerPopover({ value, onChange, children }: EmojiPickerPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(emojiData.emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            aria-label="Select emoji"
          >
            {value || <Smile className="w-4 h-4" />}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-0" align="start">
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          theme={Theme.AUTO}
          searchPlaceholder="Search emoji..."
          width={350}
          height={400}
          previewConfig={{ showPreview: false }}
          emojiStyle={EmojiStyle.NATIVE}
        />
      </PopoverContent>
    </Popover>
  );
}
