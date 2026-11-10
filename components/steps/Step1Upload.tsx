"use client";

import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { sileo } from "sileo";
import { ArrowRight, UploadCloud } from "lucide-react";
import { usePipelineStore } from "@/store/pipeline";
import FileCard from "@/components/ui/FileCard";
import type { ParsedDoc } from "@/types";

export default function Step1Upload() {
  const { files, setFiles, parsedDocs, setParsedDocs, setStep } = usePipelineStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setFiles([...files, ...acceptedFiles]);

      const newDocs: ParsedDoc[] = [...parsedDocs];
      try {
        for (const file of acceptedFiles) {
          if (file.name.endsWith(".txt")) {
            newDocs.push({ name: file.name, text: await file.text() });
          }
          if (file.name.endsWith(".pdf") || file.name.endsWith(".docx")) {
            const reader = new FileReader();
            const text = await new Promise<string>((resolve, reject) => {
              reader.onload = () => resolve((reader.result as string).split(",")[1]);
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(file);
            });
            newDocs.push({ name: file.name, text });
          }
        }
        setParsedDocs(newDocs);
        sileo.success({
          title: acceptedFiles.length === 1 ? "File added" : `${acceptedFiles.length} files added`,
          description: acceptedFiles.map((f) => f.name).join(", "),
        });
      } catch {
        sileo.error({ title: "Could not read file", description: "Try uploading it again." });
      }
    },
    [files, parsedDocs, setFiles, setParsedDocs]
  );

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    sileo.warning({
      title: "Unsupported file type",
      description: `${rejections.map((r) => r.file.name).join(", ")}. Use PDF, TXT or DOCX.`,
    });
  }, []);

  const removeFile = (index: number) => {
    const fileName = files[index].name;
    setFiles(files.filter((_, i) => i !== index));
    setParsedDocs(parsedDocs.filter((d) => d.name !== fileName));
    sileo.info({ title: "File removed", description: fileName });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  const canProceed = files.length > 0 && parsedDocs.length > 0;

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div>
        <h1 className="text-4xl sm:text-5xl">Add your documents</h1>
        <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>
          Drop in the files you want to ask questions about. Nothing is shared until you build the pipeline.
        </p>
      </div>

      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center gap-4 px-6 py-14 cursor-pointer text-center transition-all duration-300"
        style={{
          background: isDragActive ? "var(--accent-dim)" : "var(--surface)",
          border: `2px dashed ${isDragActive ? "var(--accent)" : "var(--border-active)"}`,
          borderRadius: "var(--r-card)",
          transform: isDragActive ? "scale(1.01)" : "none",
        }}
      >
        <input {...getInputProps()} />
        <span
          className="flex items-center justify-center w-16 h-16 transition-transform duration-300"
          style={{
            background: "var(--accent-dim)",
            color: "var(--accent-text)",
            borderRadius: 20,
            transform: isDragActive ? "translateY(-6px)" : "none",
          }}
        >
          <UploadCloud size={30} strokeWidth={1.8} />
        </span>
        <div>
          <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            {isDragActive ? "Drop to add" : "Drag files here or click to browse"}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>PDF, TXT or DOCX</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {files.length} file{files.length !== 1 ? "s" : ""} ready
          </p>
          {files.map((file, index) => (
            <FileCard key={file.name + file.size} name={file.name} size={file.size} onRemove={() => removeFile(index)} />
          ))}
        </div>
      )}

      <button onClick={() => setStep(2)} disabled={!canProceed} className="btn btn-primary self-stretch sm:self-end">
        Continue
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
