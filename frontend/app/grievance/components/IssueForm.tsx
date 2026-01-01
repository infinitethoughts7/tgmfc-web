"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Upload, X, FileText } from "lucide-react";

type IssueData = {
  description: string;
  voiceRecording: Blob | null;
  attachments: File[];
};

type IssueFormProps = {
  schemeTitle: string;
  initialData?: IssueData;
  onSubmit: (data: IssueData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
};

export default function IssueForm({
  schemeTitle,
  initialData,
  onSubmit,
  onBack,
  isSubmitting = false,
}: IssueFormProps) {
  const [description, setDescription] = useState(initialData?.description || "");
  const [attachments, setAttachments] = useState<File[]>(
    initialData?.attachments || []
  );
  const [voiceRecording, setVoiceRecording] = useState<Blob | null>(
    initialData?.voiceRecording || null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [errors, setErrors] = useState<{ description?: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const MAX_WORDS = 300;
  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setVoiceRecording(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeRecording = () => {
    setVoiceRecording(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      // Max 5MB per file
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 5MB.`);
        return false;
      }
      return true;
    });
    setAttachments((prev) => [...prev, ...validFiles]);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: { description?: string } = {};

    if (!description.trim()) {
      newErrors.description = "Please describe your issue";
    } else if (wordCount > MAX_WORDS) {
      newErrors.description = `Description must be ${MAX_WORDS} words or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        description,
        voiceRecording,
        attachments,
      });
    }
  };

  return (
    <div className="bg-green-100 rounded-xl p-8 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        You are Registering Grievance regarding {schemeTitle}
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Please write or Record your issue below {MAX_WORDS} words
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Issue Description */}
        <div>
          <div className="relative">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.description ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-green-500 resize-none`}
              placeholder="Describe your grievance in detail..."
              aria-describedby="word-count"
            />

            {/* Voice Recording Button */}
            <div className="absolute right-3 top-3">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full transition-colors ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
                title={isRecording ? "Stop Recording" : "Start Voice Recording"}
                aria-label={isRecording ? "Stop Recording" : "Start Voice Recording"}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {isRecording ? "Recording..." : "What to Record"}
              </p>
            </div>
          </div>

          {/* Word Count */}
          <div
            id="word-count"
            className={`mt-2 text-sm ${
              wordCount > MAX_WORDS ? "text-red-600" : "text-gray-500"
            }`}
          >
            {wordCount} / {MAX_WORDS} words
          </div>

          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Voice Recording Preview */}
        {voiceRecording && (
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <audio
              controls
              src={URL.createObjectURL(voiceRecording)}
              className="flex-1 h-10"
            />
            <button
              type="button"
              onClick={removeRecording}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full"
              aria-label="Remove recording"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* File Attachments */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            id="file-upload"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Attach Files
          </button>
          <p className="mt-2 text-sm text-gray-600">
            Please upload relevant Documents for reference (Max 5MB each)
          </p>

          {/* Attached Files List */}
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="flex-1 text-sm text-gray-700 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}