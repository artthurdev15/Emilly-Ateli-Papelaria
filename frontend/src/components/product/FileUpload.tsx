"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, X, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface FileUploadProps {
  instructions?: string | null;
  onUpload: (url: string) => void;
  currentUrl?: string;
}

const ACCEPTED = ".png,.jpg,.jpeg,.pdf,.svg,.webp";
const MAX_SIZE = 10 * 1024 * 1024;

export function FileUpload({ instructions, onUpload, currentUrl }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    setError(null);

    if (selected.size > MAX_SIZE) {
      setError("Arquivo muito grande. Máximo: 10MB");
      return;
    }

    const ext = selected.name.split(".").pop()?.toLowerCase();
    if (!["png", "jpg", "jpeg", "pdf", "svg", "webp"].includes(ext || "")) {
      setError("Formato não permitido. Use PNG, JPG, PDF, SVG ou WebP.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setUploading(true);

    try {
      const result = await api.upload(selected, "artwork");
      onUpload(result.url);
    } catch (err: any) {
      setError(err.message || "Erro ao enviar arquivo");
      setFile(null);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const remove = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    onUpload("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="card p-6 space-y-3">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-lilac-100 rounded-xl">
          <Upload size={20} className="text-lilac-500" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 text-sm">Envie sua Arte</h4>
          <p className="text-xs text-gray-400">
            {instructions || "Formatos aceitos: PNG, JPG, PDF. Máx: 10MB"}
          </p>
        </div>
      </div>

      {preview && !error ? (
        <div className="flex items-center gap-3 p-3 bg-mint-50 rounded-xl">
          <FileText size={20} className="text-mint-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 truncate font-medium">
              {file?.name || "Arte enviada"}
            </p>
            {uploading ? (
              <p className="text-xs text-gray-400">Enviando...</p>
            ) : (
              <p className="text-xs text-mint-500 flex items-center gap-1">
                <CheckCircle size={12} /> Enviado com sucesso
              </p>
            )}
          </div>
          <button onClick={remove} className="p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-400">
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            error
              ? "border-red-200 bg-red-50"
              : "border-lilac-200 bg-lilac-50/50 hover:border-lilac-300 hover:bg-lilac-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            disabled={uploading}
          />
          <Upload size={32} className="text-lilac-300 mb-2" />
          <span className="text-sm text-gray-500 font-medium">
            {uploading ? "Enviando..." : "Clique para selecionar o arquivo"}
          </span>
          <span className="text-xs text-gray-400 mt-1">PNG, JPG, PDF ou SVG</span>
        </label>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-50 p-3 rounded-xl">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
