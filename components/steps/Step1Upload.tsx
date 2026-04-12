"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { usePipelineStore } from "@/store/pipeline";
import FileCard from "@/components/ui/FileCard";
import type { ParsedDoc } from "@/types";

export default function Step1Upload() {
  const { files, setFiles, parsedDocs, setParsedDocs, setStep } =
    usePipelineStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);

      // Parse text files client-side
      const newDocs: ParsedDoc[] = [...parsedDocs];
      for (const file of acceptedFiles) {
        if (file.name.endsWith(".txt")) {
          const text = await file.text();
          newDocs.push({ name: file.name, text });
        }
        // PDF and DOCX will be parsed server-side during ingest
        // For now, add a placeholder so we know they exist
        if (file.name.endsWith(".pdf") || file.name.endsWith(".docx")) {
          const reader = new FileReader();
          const text = await new Promise<string>((resolve) => {
            reader.onload = () => {
              // Store base64 for server-side parsing
              const base64 = (reader.result as string).split(",")[1];
              resolve(base64);
            };
            reader.readAsDataURL(file);
          });
          newDocs.push({ name: file.name, text });
        }
      }
      setParsedDocs(newDocs);
    },
    [files, parsedDocs, setFiles, setParsedDocs]
  );

  const removeFile = (index: number) => {
    const fileName = files[index].name;
    const newFiles = files.filter((_, i) => i !== index);
    const newDocs = parsedDocs.filter((d) => d.name !== fileName);
    setFiles(newFiles);
    setParsedDocs(newDocs);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  const canProceed = files.length > 0 && parsedDocs.length > 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className="relative flex flex-col items-center justify-center gap-3 sm:gap-4 p-6 sm:p-10 rounded cursor-pointer transition-all duration-300 corner-accents"
        style={{
          background: isDragActive ? "var(--surface-elevated)" : "var(--surface)",
          border: `1px dashed ${isDragActive ? "var(--accent)" : "var(--border)"}`,
          boxShadow: isDragActive
            ? "0 0 30px var(--accent-glow), inset 0 0 30px var(--accent-glow)"
            : "none",
        }}
      >
        <input {...getInputProps()} />

        {/* Upload icon */}
        <motion.div
          animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            style={{ color: isDragActive ? "var(--accent)" : "var(--text-muted)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </motion.div>

        <div className="text-center">
          <p
            className="text-sm"
            style={{
              color: isDragActive ? "var(--accent)" : "var(--text)",
              fontFamily: "var(--font-body)",
            }}
          >
            {isDragActive
              ? "Drop files here..."
              : "Drag & drop files, or click to browse"}
          </p>
          <p
            className="text-xs mt-2"
            style={{
              color: "var(--text-dim)",
              fontFamily: "var(--font-body)",
            }}
          >
            Supports PDF, TXT, DOCX
          </p>
        </div>
      </div>

      {/* File list */}
      <AnimatePresence mode="popLayout">
        {files.map((file, index) => (
          <FileCard
            key={file.name + file.size}
            name={file.name}
            size={file.size}
            onRemove={() => removeFile(index)}
          />
        ))}
      </AnimatePresence>

      {/* File count */}
      {files.length > 0 && (
        <p
          className="text-xs text-center"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
        >
          {files.length} file{files.length !== 1 ? "s" : ""} selected
        </p>
      )}

      {/* Next button */}
      <motion.button
        onClick={() => setStep(2)}
        disabled={!canProceed}
        className="self-stretch sm:self-end px-8 py-3 text-xs uppercase tracking-widest font-medium transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
        style={{
          background: canProceed ? "var(--accent)" : "var(--surface)",
          color: canProceed ? "var(--bg)" : "var(--text-dim)",
          border: `1px solid ${canProceed ? "var(--accent)" : "var(--border)"}`,
          fontFamily: "var(--font-body)",
          opacity: canProceed ? 1 : 0.5,
        }}
        whileHover={canProceed ? { scale: 1.02 } : {}}
        whileTap={canProceed ? { scale: 0.98 } : {}}
      >
        Next &rarr;
      </motion.button>
    </div>
  );
}
