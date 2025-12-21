import { useEffect, useRef } from 'react';
import Picker from 'emoji-picker-element/picker';

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
  dataSource?: string;
}

export function EmojiPicker({ onEmojiClick, dataSource }: EmojiPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create picker instance with custom configuration
    const picker = new Picker({
      dataSource: dataSource || '/emoji-data/data-en.json',
    });

    pickerRef.current = picker;

    // Add event listener
    const handleEmojiClick = (event: any) => {
      onEmojiClick(event.detail.unicode);
    };

    picker.addEventListener('emoji-click', handleEmojiClick);

    // Append picker to container
    containerRef.current.appendChild(picker);

    // Cleanup
    return () => {
      picker.removeEventListener('emoji-click', handleEmojiClick);
      if (containerRef.current && containerRef.current.contains(picker)) {
        containerRef.current.removeChild(picker);
      }
    };
  }, [onEmojiClick, dataSource]);

  return <div ref={containerRef} />;
}
