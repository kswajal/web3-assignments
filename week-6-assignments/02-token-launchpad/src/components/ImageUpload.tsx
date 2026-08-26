import { useMemo, useEffect } from "react";
import type { ChangeEvent } from "react";

interface ImageUploadProps {
  image: File | null;
  onImageChange: (file: File | null) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageUpload({ image, onImageChange }: ImageUploadProps) {
  const previewUrl = useMemo(() => {
    if (!image) return null;
    return URL.createObjectURL(image);
  }, [image]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);
  };

  return (
    <div className="input-group">
      <label className="input-label">Token Image</label>

      {!image || !previewUrl ? (
        <div className="upload-zone" id="image-upload-zone">
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="upload-input"
            aria-label="Upload token image"
            id="image-upload-input"
          />
          <div className="upload-icon" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="upload-text">
            <span className="upload-text-highlight">Click to upload</span> or drag and drop
          </div>
          <div className="upload-hint">PNG, JPG, SVG · Max 5MB</div>
        </div>
      ) : (
        <div className="upload-zone has-file">
          <div className="upload-preview">
            <img src={previewUrl} alt="Token preview" className="preview-image" />
            <div className="preview-info">
              <span className="preview-name">{image.name}</span>
              <span className="preview-size">{formatFileSize(image.size)}</span>
            </div>
            <button
              onClick={() => onImageChange(null)}
              className="preview-remove"
              type="button"
              id="remove-image-btn"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
