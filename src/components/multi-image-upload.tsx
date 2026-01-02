"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


interface MultiImageUploadProps {
    label: string;
    description?: string;
    onImagesChange: (files: File[]) => void;
}

export function MultiImageUpload({ label, description, onImagesChange }: MultiImageUploadProps) {
    const [images, setImages] = useState<{ id: string; file: File; preview: string; isConverting?: boolean }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync state with parent component safely
    useEffect(() => {
        const readyFiles = images
            .filter(img => !img.isConverting)
            .map(img => img.file);
        onImagesChange(readyFiles);
    }, [images, onImagesChange]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Create unique IDs for new files to track their loading state
        const newFileEntries = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: "",
            isConverting: true
        }));

        setImages(prev => [...prev, ...newFileEntries].slice(0, 10));

        const processedImages = await Promise.all(newFileEntries.map(async (entry) => {
            let file = entry.file;

            // Handle HEIC/HEIF conversion
            if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic")) {
                try {
                    const heic2any = (await import("heic2any")).default;
                    const convertedBlob = await heic2any({
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.7
                    });
                    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                    file = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
                } catch (err) {
                    console.error("HEIC conversion failed:", err);
                }
            }

            return {
                ...entry,
                file,
                preview: URL.createObjectURL(file),
                isConverting: false
            };
        }));

        setImages(prev => {
            return prev.map(img => {
                const found = processedImages.find(p => p.id === img.id);
                return found || img;
            });
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (id: string) => {
        setImages(prev => prev.filter((img) => img.id !== id));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <label className="text-lg font-bold flex items-center gap-2">
                    {label}
                </label>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <AnimatePresence>
                    {images.map((img) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative aspect-square rounded-2xl overflow-hidden border bg-muted flex items-center justify-center"
                        >
                            {img.isConverting ? (
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            ) : (
                                <>
                                    <img
                                        src={img.preview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => removeImage(img.id)}
                                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all shadow-lg"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {images.length < 10 && (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-[0.98]"
                    >
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Plus className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            Add Photo
                        </span>
                    </button>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*,.heic,.HEIC"
                className="hidden"
            />
        </div>
    );
}
