interface Props {
  value: string;
  onChange: (v: string) => void;
  onFilterClick?: () => void;
}

export default function SearchBar({ value, onChange, onFilterClick }: Props) {
  return (
    <div className="flex gap-2.5 px-5 pb-4">
      <div className="flex-1 flex items-center gap-2 bg-elevated border border-border rounded-[10px] px-3.5 py-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6b7d" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          placeholder="Nimani qidiryapsiz?"
          className="bg-transparent border-none outline-none text-white text-[14px] w-full placeholder:text-dimmer"
        />
      </div>
      <button
        onClick={onFilterClick}
        className="w-11 h-11 flex-shrink-0 bg-accent rounded-[10px] flex items-center justify-center"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#05170f" strokeWidth="2.2">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
      </button>
    </div>
  );
}
