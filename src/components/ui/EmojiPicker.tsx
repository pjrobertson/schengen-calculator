import { useEffect, useRef, createElement } from 'react';
import 'emoji-picker-element';

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
  dataSource?: string;
}

export function EmojiPicker({ onEmojiClick, dataSource = '/emoji-data/data-en.json' }: EmojiPickerProps) {
  const ref = useRef<any>(null);

  useEffect(() => {
    const picker = ref.current;
    if (!picker) return;

    // Set the data source to use local emoji data
    picker.dataSource = dataSource;

    const handleEmojiClick = (event: any) => {
      onEmojiClick(event.detail.unicode);
    };

    picker.addEventListener('emoji-click', handleEmojiClick);
    return () => {
      picker.removeEventListener('emoji-click', handleEmojiClick);
    };
  }, [onEmojiClick, dataSource]);

  return createElement('emoji-picker', { ref });
}
