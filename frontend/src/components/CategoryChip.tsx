interface Props {
  label: string;
  icon?: string;
  active?: boolean;
  onClick: () => void;
}

export default function CategoryChip({ label, icon, active, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2.5 rounded-[9px] text-[13px] font-semibold border cursor-pointer ${
        active ? "bg-accent text-[#05170f] border-accent" : "bg-chip text-dim border-border"
      }`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </div>
  );
}
