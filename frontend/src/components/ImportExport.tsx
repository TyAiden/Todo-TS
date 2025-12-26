import React, { useRef, useState, useEffect } from "react";
import { validateFileSize, validateFileType } from "../utils/fileUtils";

interface ImportExportProps {
  onExport: () => Promise<void>;
  onImport: (file: File) => Promise<void>;
}

function ImportExport({ onExport, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMenuOpen &&
        event.target instanceof Element &&
        !event.target.closest(".more-menu-container")
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleImportClick = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        validateFileSize(file);
        validateFileType(file);
        await onImport(file);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setError(null);
        setIsMenuOpen(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("导入文件时发生未知错误");
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleExportClick = async () => {
    try {
      setError(null);
      await onExport();
      setIsMenuOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("导出文件时发生未知错误");
      }
    }
  };

  return (
    <div className="more-menu-container">
      <button
        className="more-menu-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="更多选项"
      >
        <img src="/public/more.png" alt="更多" className="more-menu-icon" />
      </button>

      {isMenuOpen && (
        <div className="more-menu-dropdown">
          <div className="import-export-container">
            <div className="import-export">
              <button
                type="button"
                className="btn btn__secondary"
                onClick={handleImportClick}
              >
                导入任务
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".txt"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="btn btn__secondary"
                onClick={handleExportClick}
              >
                导出任务
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImportExport;
