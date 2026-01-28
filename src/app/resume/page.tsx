"use client";

import { uploadResume } from "@/services/resume";

export default function ResumePage() {
    const handleUpload = async (e: any) => {
        await uploadResume(e.target.files[0]);
        alert("Resume Uploaded");
    };
    return <input type='file' onChange={handleUpload} />;
}