import { useEffect, useRef, createElement } from 'react';
import 'emoji-picker-element';

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiClick }: EmojiPickerProps) {
  const ref = useRef<any>(null);

  useEffect(() => {
    const picker = ref.current;
    if (!picker) return;

    const handleEmojiClick = (event: any) => {
      onEmojiClick(event.detail.unicode);
    };

    picker.addEventListener('emoji-click', handleEmojiClick);
    return () => {
      picker.removeEventListener('emoji-click', handleEmojiClick);
    };
  }, [onEmojiClick]);

  return createElement('emoji-picker', { ref });
}
