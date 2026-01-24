/**
 * Block Editor Component - VC.ru style editor
 * Simplified version with proper input handling
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, Type, Heading1, Image, Quote, Code, Video,
  List, ListOrdered, CheckSquare, Minus, GripVertical,
  Trash2, ChevronUp, ChevronDown, X, AlertCircle, Info, Lightbulb,
  AlertTriangle, CheckCircle, Bold, Italic, Underline, Link as LinkIcon
} from 'lucide-react';
import {
  ContentBlock,
  ContentBlockType,
  ParagraphBlock,
  HeadingBlock,
  ImageBlock,
  QuoteBlock,
  CodeBlock,
  VideoBlock,
  ListBlock,
  CalloutBlock,
  generateBlockId
} from '../lib/blogTypes';

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

// Block type menu items
const BLOCK_TYPES: { type: ContentBlockType; icon: React.ReactNode; label: string; description: string }[] = [
  { type: 'paragraph', icon: <Type size={18} />, label: 'Текст', description: 'Параграф текста' },
  { type: 'heading', icon: <Heading1 size={18} />, label: 'Заголовок', description: 'Заголовок раздела' },
  { type: 'image', icon: <Image size={18} />, label: 'Изображение', description: 'Добавить картинку' },
  { type: 'quote', icon: <Quote size={18} />, label: 'Цитата', description: 'Выделенная цитата' },
  { type: 'code', icon: <Code size={18} />, label: 'Код', description: 'Блок кода' },
  { type: 'video', icon: <Video size={18} />, label: 'Видео', description: 'YouTube, Rutube и др.' },
  { type: 'list', icon: <List size={18} />, label: 'Список', description: 'Маркированный список' },
  { type: 'callout', icon: <Info size={18} />, label: 'Выноска', description: 'Важная информация' },
  { type: 'divider', icon: <Minus size={18} />, label: 'Разделитель', description: 'Горизонтальная линия' },
];

// Callout style icons
const CALLOUT_ICONS: Record<CalloutBlock['style'], React.ReactNode> = {
  info: <Info size={20} />,
  warning: <AlertTriangle size={20} />,
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  tip: <Lightbulb size={20} />
};

const CALLOUT_COLORS: Record<CalloutBlock['style'], string> = {
  info: 'border-blue-500/30 bg-blue-500/10',
  warning: 'border-yellow-500/30 bg-yellow-500/10',
  success: 'border-green-500/30 bg-green-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  tip: 'border-neon-acid/30 bg-neon-acid/10'
};

export const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange }) => {
  const [showAddMenu, setShowAddMenu] = useState<number | null>(null);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAddMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Create new block
  const createBlock = (type: ContentBlockType, index: number) => {
    let newBlock: ContentBlock;
    const id = generateBlockId();

    switch (type) {
      case 'paragraph':
        newBlock = { id, type: 'paragraph', content: '' };
        break;
      case 'heading':
        newBlock = { id, type: 'heading', level: 2, content: '' };
        break;
      case 'image':
        newBlock = { id, type: 'image', src: '', alt: '', width: 'normal' };
        break;
      case 'quote':
        newBlock = { id, type: 'quote', content: '' };
        break;
      case 'code':
        newBlock = { id, type: 'code', language: 'javascript', content: '' };
        break;
      case 'video':
        newBlock = { id, type: 'video', provider: 'youtube', videoId: '' };
        break;
      case 'list':
        newBlock = { id, type: 'list', style: 'bullet', items: [''] };
        break;
      case 'callout':
        newBlock = { id, type: 'callout', style: 'info', content: '' };
        break;
      case 'divider':
        newBlock = { id, type: 'divider' };
        break;
      case 'embed':
        newBlock = { id, type: 'embed', provider: 'telegram', url: '' };
        break;
      default:
        newBlock = { id, type: 'paragraph', content: '' };
    }

    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
    setShowAddMenu(null);
    setFocusedBlockId(id);
  };

  // Update block - stable reference
  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    const newBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } as ContentBlock : block
    );
    onChange(newBlocks);
  };

  // Delete block
  const deleteBlock = (blockId: string) => {
    if (blocks.length === 1) {
      onChange([{ id: generateBlockId(), type: 'paragraph', content: '' } as ParagraphBlock]);
      return;
    }
    const newBlocks = blocks.filter(block => block.id !== blockId);
    onChange(newBlocks);
  };

  // Move block
  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === blockId);
    const toIndex = direction === 'up' ? index - 1 : index + 1;
    if (toIndex < 0 || toIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[toIndex]] = [newBlocks[toIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  // Render block editor based on type
  const renderBlockEditor = (block: ContentBlock, index: number) => {
    const commonProps = {
      onDelete: () => deleteBlock(block.id),
      autoFocus: focusedBlockId === block.id
    };

    switch (block.type) {
      case 'paragraph':
        return (
          <ParagraphEditor
            key={block.id}
            block={block}
            onChange={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'heading':
        return (
          <HeadingEditor
            key={block.id}
            block={block}
            onChange={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'image':
        return (
          <ImageEditor
            key={block.id}
            block={block}
            onChange={(updates) => updateBlock(block.id, updates)}
          />
        );
      case 'quote':
        return (
          <QuoteEditor
            key={block.id}
            block={block}
            onChange={(updates) => updateBlock(block.id, updates)}
          />
        );
      case 'code':
        return (
          <CodeEditor
            key={block.id}
            block={block}
            onChange={(updates) => updateBlock(block.id, updates)}
          />
        );
      case 'video':
        return (
          <VideoEditor
            key={block.id}
            block={block}
            onChange={(updates) => updateBlock(block.id, updates)}
          />
        );
      case 'list':
        return (
          <ListEditor
            key={block.id}
            block={block}
            onChange={(updates) => updateBlock(block.id, updates)}
          />
        );
      case 'callout':
        return (
          <CalloutEditor
            key={block.id}
            block={block}
            onChange={(updates) => updateBlock(block.id, updates)}
          />
        );
      case 'divider':
        return (
          <div key={block.id} className="py-4">
            <hr className="border-white/20" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="block-editor">
      {blocks.length === 0 && (
        <div className="text-center py-12 border border-dashed border-white/20 rounded">
          <p className="text-zinc-500 mb-4">Начните писать статью</p>
          <button
            onClick={() => createBlock('paragraph', -1)}
            className="px-4 py-2 bg-neon-acid text-black font-mono text-sm hover:bg-white transition-colors"
          >
            Добавить блок
          </button>
        </div>
      )}

      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="group relative mb-4"
        >
          {/* Block controls - left side */}
          <div className="absolute -left-12 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddMenu(showAddMenu === index ? null : index);
              }}
              className="p-1.5 text-zinc-500 hover:text-neon-acid hover:bg-zinc-800 rounded transition-colors"
              title="Добавить блок"
            >
              <Plus size={16} />
            </button>
            <button
              className="p-1.5 text-zinc-500 hover:text-white cursor-grab active:cursor-grabbing rounded"
              title="Перетащить"
            >
              <GripVertical size={16} />
            </button>
          </div>

          {/* Block actions - right side */}
          <div className="absolute -right-28 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => moveBlock(block.id, 'up')}
              disabled={index === 0}
              className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-30 rounded transition-colors"
              title="Вверх"
            >
              <ChevronUp size={16} />
            </button>
            <button
              onClick={() => moveBlock(block.id, 'down')}
              disabled={index === blocks.length - 1}
              className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-30 rounded transition-colors"
              title="Вниз"
            >
              <ChevronDown size={16} />
            </button>
            <button
              onClick={() => deleteBlock(block.id)}
              className="p-1.5 text-zinc-500 hover:text-red-500 rounded transition-colors"
              title="Удалить"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Add block menu */}
          {showAddMenu === index && (
            <div
              ref={menuRef}
              className="absolute left-0 top-full mt-2 z-50 bg-zinc-900 border border-white/10 shadow-xl rounded-lg p-2 w-64"
            >
              <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 px-2">
                Добавить блок
              </div>
              {BLOCK_TYPES.map((item) => (
                <button
                  key={item.type}
                  onClick={() => createBlock(item.type, index)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 rounded transition-colors"
                >
                  <span className="text-zinc-400">{item.icon}</span>
                  <div>
                    <div className="text-white text-sm">{item.label}</div>
                    <div className="text-zinc-500 text-xs">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Block content */}
          <div className="pl-2 border-l-2 border-transparent hover:border-zinc-700 transition-colors">
            {renderBlockEditor(block, index)}
          </div>
        </div>
      ))}

      {/* Add block button at the end */}
      {blocks.length > 0 && (
        <div className="relative mt-6">
          <button
            onClick={() => setShowAddMenu(showAddMenu === blocks.length ? null : blocks.length)}
            className="flex items-center gap-2 text-zinc-500 hover:text-neon-acid transition-colors py-2 px-3 border border-dashed border-zinc-700 hover:border-neon-acid rounded"
          >
            <Plus size={18} />
            <span className="text-sm">Добавить блок</span>
          </button>

          {showAddMenu === blocks.length && (
            <div
              ref={menuRef}
              className="absolute left-0 top-full mt-2 z-50 bg-zinc-900 border border-white/10 shadow-xl rounded-lg p-2 w-64"
            >
              <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 px-2">
                Добавить блок
              </div>
              {BLOCK_TYPES.map((item) => (
                <button
                  key={item.type}
                  onClick={() => createBlock(item.type, blocks.length - 1)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 rounded transition-colors"
                >
                  <span className="text-zinc-400">{item.icon}</span>
                  <div>
                    <div className="text-white text-sm">{item.label}</div>
                    <div className="text-zinc-500 text-xs">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =====================================================
// PARAGRAPH EDITOR - Simple textarea based
// =====================================================
const ParagraphEditor: React.FC<{
  block: ParagraphBlock;
  onChange: (updates: Partial<ParagraphBlock>) => void;
  onDelete: () => void;
  autoFocus?: boolean;
}> = ({ block, onChange, onDelete, autoFocus }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [localContent, setLocalContent] = useState(block.content);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [localContent]);

  // Auto focus on new block
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Sync local state with prop changes (only if different)
  useEffect(() => {
    if (block.content !== localContent) {
      setLocalContent(block.content);
    }
  }, [block.content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalContent(value);
  };

  const handleBlur = () => {
    if (localContent !== block.content) {
      onChange({ content: localContent });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Delete block on backspace if empty
    if (e.key === 'Backspace' && localContent === '') {
      e.preventDefault();
      onDelete();
    }
  };

  return (
    <div className="paragraph-block">
      <textarea
        ref={textareaRef}
        value={localContent}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Начните писать текст..."
        className="w-full bg-transparent text-white outline-none resize-none leading-relaxed min-h-[32px]"
        style={{ caretColor: '#CCFF00' }}
        rows={1}
      />
    </div>
  );
};

// =====================================================
// HEADING EDITOR
// =====================================================
const HeadingEditor: React.FC<{
  block: HeadingBlock;
  onChange: (updates: Partial<HeadingBlock>) => void;
  onDelete: () => void;
  autoFocus?: boolean;
}> = ({ block, onChange, onDelete, autoFocus }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localContent, setLocalContent] = useState(block.content);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (block.content !== localContent) {
      setLocalContent(block.content);
    }
  }, [block.content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalContent(e.target.value);
  };

  const handleBlur = () => {
    if (localContent !== block.content) {
      onChange({ content: localContent });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && localContent === '') {
      e.preventDefault();
      onDelete();
    }
  };

  const sizeClasses: Record<number, string> = {
    2: 'text-2xl',
    3: 'text-xl',
    4: 'text-lg'
  };

  return (
    <div className="heading-block">
      <div className="flex gap-2 mb-3">
        {([2, 3, 4] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange({ level })}
            className={`px-3 py-1.5 text-xs font-mono rounded ${
              block.level === level
                ? 'bg-neon-acid text-black'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            } transition-colors`}
          >
            H{level}
          </button>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={localContent}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Заголовок раздела..."
        className={`w-full bg-transparent text-white outline-none ${sizeClasses[block.level]} font-serif font-bold`}
        style={{ caretColor: '#CCFF00' }}
      />
    </div>
  );
};

// =====================================================
// IMAGE EDITOR
// =====================================================
const ImageEditor: React.FC<{
  block: ImageBlock;
  onChange: (updates: Partial<ImageBlock>) => void;
}> = ({ block, onChange }) => {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <div className="image-block space-y-3">
      {block.src ? (
        <div className="relative">
          <img
            src={block.src}
            alt={block.alt}
            className={`${
              block.width === 'full' ? 'w-full' : 
              block.width === 'wide' ? 'w-4/5 mx-auto' : 
              'w-2/3 mx-auto'
            } object-cover rounded`}
          />
          <button
            type="button"
            onClick={() => onChange({ src: '' })}
            className="absolute top-2 right-2 p-1.5 bg-black/70 text-white hover:bg-black rounded"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="border border-dashed border-white/20 rounded p-8 text-center">
          <Image size={32} className="mx-auto text-zinc-500 mb-3" />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && imageUrl) {
                onChange({ src: imageUrl });
                setImageUrl('');
              }
            }}
            placeholder="Вставьте URL изображения и нажмите Enter..."
            className="w-full bg-zinc-900 border border-white/10 px-4 py-2 text-white text-center rounded"
          />
          <button
            type="button"
            onClick={() => {
              if (imageUrl) {
                onChange({ src: imageUrl });
                setImageUrl('');
              }
            }}
            className="mt-3 px-4 py-2 bg-zinc-800 text-white text-sm hover:bg-zinc-700 rounded transition-colors"
          >
            Добавить
          </button>
        </div>
      )}

      {block.src && (
        <>
          <div className="flex gap-4">
            <input
              type="text"
              value={block.alt}
              onChange={(e) => onChange({ alt: e.target.value })}
              placeholder="Alt текст для SEO..."
              className="flex-1 bg-zinc-900 border border-white/10 px-3 py-2 text-white text-sm rounded"
            />
            <select
              value={block.width || 'normal'}
              onChange={(e) => onChange({ width: e.target.value as 'full' | 'wide' | 'normal' })}
              className="bg-zinc-900 border border-white/10 px-3 py-2 text-white text-sm rounded"
            >
              <option value="normal">Обычная</option>
              <option value="wide">Широкая</option>
              <option value="full">Во всю ширину</option>
            </select>
          </div>
          <input
            type="text"
            value={block.caption || ''}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Подпись к изображению..."
            className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-zinc-400 text-sm text-center"
          />
        </>
      )}
    </div>
  );
};

// =====================================================
// QUOTE EDITOR
// =====================================================
const QuoteEditor: React.FC<{
  block: QuoteBlock;
  onChange: (updates: Partial<QuoteBlock>) => void;
}> = ({ block, onChange }) => {
  return (
    <div className="quote-block border-l-4 border-neon-acid pl-4 py-2">
      <textarea
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Текст цитаты..."
        className="w-full bg-transparent text-white text-lg italic outline-none resize-none min-h-[80px]"
        style={{ caretColor: '#CCFF00' }}
      />
      <div className="flex gap-4 mt-2">
        <input
          type="text"
          value={block.author || ''}
          onChange={(e) => onChange({ author: e.target.value })}
          placeholder="Автор цитаты"
          className="flex-1 bg-transparent border-b border-white/10 text-zinc-400 text-sm outline-none py-1"
        />
        <input
          type="text"
          value={block.source || ''}
          onChange={(e) => onChange({ source: e.target.value })}
          placeholder="Источник"
          className="flex-1 bg-transparent border-b border-white/10 text-zinc-400 text-sm outline-none py-1"
        />
      </div>
    </div>
  );
};

// =====================================================
// CODE EDITOR
// =====================================================
const CodeEditor: React.FC<{
  block: CodeBlock;
  onChange: (updates: Partial<CodeBlock>) => void;
}> = ({ block, onChange }) => {
  const languages = [
    'javascript', 'typescript', 'python', 'html', 'css', 'json', 
    'bash', 'sql', 'jsx', 'tsx', 'go', 'rust', 'php'
  ];

  return (
    <div className="code-block bg-zinc-900 border border-white/10 rounded overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-white/10">
        <select
          value={block.language}
          onChange={(e) => onChange({ language: e.target.value })}
          className="bg-transparent text-zinc-400 text-sm outline-none cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <input
          type="text"
          value={block.filename || ''}
          onChange={(e) => onChange({ filename: e.target.value })}
          placeholder="filename.js"
          className="bg-transparent text-zinc-500 text-sm outline-none text-right w-32"
        />
      </div>
      <textarea
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="// Вставьте код..."
        className="w-full bg-transparent text-white font-mono text-sm p-4 outline-none resize-none min-h-[200px]"
        spellCheck={false}
        style={{ caretColor: '#CCFF00' }}
      />
    </div>
  );
};

// =====================================================
// VIDEO EDITOR
// =====================================================
const VideoEditor: React.FC<{
  block: VideoBlock;
  onChange: (updates: Partial<VideoBlock>) => void;
}> = ({ block, onChange }) => {
  const [videoUrl, setVideoUrl] = useState('');

  const parseVideoUrl = (url: string): { provider: 'youtube' | 'vimeo' | 'rutube' | 'custom'; videoId: string } | null => {
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return { provider: 'youtube', videoId: ytMatch[1] };

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return { provider: 'vimeo', videoId: vimeoMatch[1] };

    const rutubeMatch = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
    if (rutubeMatch) return { provider: 'rutube', videoId: rutubeMatch[1] };

    return null;
  };

  const handleAddVideo = () => {
    const parsed = parseVideoUrl(videoUrl);
    if (parsed) {
      onChange(parsed);
      setVideoUrl('');
    }
  };

  const getEmbedUrl = () => {
    switch (block.provider) {
      case 'youtube':
        return `https://www.youtube.com/embed/${block.videoId}`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${block.videoId}`;
      case 'rutube':
        return `https://rutube.ru/play/embed/${block.videoId}`;
      default:
        return '';
    }
  };

  return (
    <div className="video-block">
      {block.videoId ? (
        <div className="relative">
          <div className="aspect-video bg-zinc-900 rounded overflow-hidden">
            <iframe
              src={getEmbedUrl()}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange({ videoId: '' })}
            className="absolute top-2 right-2 p-1.5 bg-black/70 text-white hover:bg-black rounded"
          >
            <X size={16} />
          </button>
          <input
            type="text"
            value={block.caption || ''}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Подпись к видео..."
            className="w-full bg-transparent border-b border-white/10 px-0 py-2 text-zinc-400 text-sm text-center mt-2"
          />
        </div>
      ) : (
        <div className="border border-dashed border-white/20 rounded p-8 text-center">
          <Video size={32} className="mx-auto text-zinc-500 mb-3" />
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddVideo()}
            placeholder="Вставьте ссылку на YouTube, Vimeo или Rutube..."
            className="w-full bg-zinc-900 border border-white/10 px-4 py-2 text-white text-center rounded"
          />
          <button
            type="button"
            onClick={handleAddVideo}
            className="mt-3 px-4 py-2 bg-zinc-800 text-white text-sm hover:bg-zinc-700 rounded transition-colors"
          >
            Добавить
          </button>
          <p className="text-zinc-500 text-xs mt-2">
            Поддерживаются: YouTube, Vimeo, Rutube
          </p>
        </div>
      )}
    </div>
  );
};

// =====================================================
// LIST EDITOR
// =====================================================
const ListEditor: React.FC<{
  block: ListBlock;
  onChange: (updates: Partial<ListBlock>) => void;
}> = ({ block, onChange }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addItem = (afterIndex: number) => {
    const newItems = [...block.items];
    newItems.splice(afterIndex + 1, 0, '');
    onChange({ items: newItems });
    // Focus new input after render
    setTimeout(() => {
      inputRefs.current[afterIndex + 1]?.focus();
    }, 0);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...block.items];
    newItems[index] = value;
    onChange({ items: newItems });
  };

  const removeItem = (index: number) => {
    if (block.items.length === 1) return;
    const newItems = block.items.filter((_: string, i: number) => i !== index);
    onChange({ items: newItems });
    // Focus previous input
    setTimeout(() => {
      inputRefs.current[Math.max(0, index - 1)]?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(index);
    }
    if (e.key === 'Backspace' && block.items[index] === '') {
      e.preventDefault();
      removeItem(index);
    }
  };

  return (
    <div className="list-block">
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => onChange({ style: 'bullet' })}
          className={`p-2 rounded ${block.style === 'bullet' ? 'bg-neon-acid text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => onChange({ style: 'numbered' })}
          className={`p-2 rounded ${block.style === 'numbered' ? 'bg-neon-acid text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => onChange({ style: 'check' })}
          className={`p-2 rounded ${block.style === 'check' ? 'bg-neon-acid text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
        >
          <CheckSquare size={16} />
        </button>
      </div>

      <ul className="space-y-2">
        {block.items.map((item: string, index: number) => (
          <li key={index} className="flex items-center gap-2">
            <span className="text-zinc-500 w-6 flex-shrink-0">
              {block.style === 'bullet' && '•'}
              {block.style === 'numbered' && `${index + 1}.`}
              {block.style === 'check' && <CheckSquare size={16} />}
            </span>
            <input
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              placeholder="Пункт списка..."
              className="flex-1 bg-transparent text-white outline-none"
              style={{ caretColor: '#CCFF00' }}
            />
            {block.items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-zinc-500 hover:text-red-500 p-1"
              >
                <X size={14} />
              </button>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => addItem(block.items.length - 1)}
        className="mt-2 text-zinc-500 hover:text-neon-acid text-sm flex items-center gap-1"
      >
        <Plus size={14} /> Добавить пункт
      </button>
    </div>
  );
};

// =====================================================
// CALLOUT EDITOR
// =====================================================
const CalloutEditor: React.FC<{
  block: CalloutBlock;
  onChange: (updates: Partial<CalloutBlock>) => void;
}> = ({ block, onChange }) => {
  const styles: Array<CalloutBlock['style']> = ['info', 'tip', 'warning', 'success', 'error'];

  return (
    <div className={`callout-block border-l-4 p-4 rounded-r ${CALLOUT_COLORS[block.style]}`}>
      <div className="flex gap-2 mb-3">
        {styles.map((style) => (
          <button
            key={style}
            type="button"
            onClick={() => onChange({ style })}
            className={`p-1.5 rounded ${
              block.style === style
                ? 'bg-white/20'
                : 'bg-white/5 hover:bg-white/10'
            }`}
            title={style}
          >
            {CALLOUT_ICONS[style]}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={block.title || ''}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Заголовок (опционально)"
        className="w-full bg-transparent text-white font-medium outline-none mb-2"
        style={{ caretColor: '#CCFF00' }}
      />

      <textarea
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Текст выноски..."
        className="w-full bg-transparent text-white/80 outline-none resize-none min-h-[60px]"
        style={{ caretColor: '#CCFF00' }}
      />
    </div>
  );
};

export default BlockEditor;
