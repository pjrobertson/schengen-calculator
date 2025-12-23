import { useEffect, useRef } from 'react';
import Picker from 'emoji-picker-element/picker';

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
  dataSource?: string;
}

export function EmojiPicker({ onEmojiClick, dataSource }: EmojiPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<any>(null);
  const onEmojiClickRef = useRef(onEmojiClick);

  // Keep the callback ref up to date
  useEffect(() => {
    onEmojiClickRef.current = onEmojiClick;
  }, [onEmojiClick]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create picker instance with custom configuration
    const picker = new Picker({
      dataSource: dataSource || '/emoji-data/data-en.json',
    });

    pickerRef.current = picker;

    // Add event listener
    const handleEmojiClick = (event: any) => {
      onEmojiClickRef.current(event.detail.unicode);
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
  }, [dataSource]); // Only recreate when dataSource changes

  return <div ref={containerRef} />;
}
