import { FileText } from "lucide-react";

export default function SourceChip({ source }: { source: string }) {
  return (
    <span className="chip" title={source}>
      <FileText size={13} className="shrink-0" />
      <span className="truncate">{source}</span>
    </span>
  );
}
