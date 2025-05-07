"use client";

import { Download } from "lucide-react";

interface ExportFormProps {
  user: {
    userId: string;
    role: string;
  };
  events: { eventId: string; title: string }[];
}

export default function ExportForm({ user, events }: ExportFormProps) {
  async function handleSubmit(formData: FormData) {
    const response = await fetch("/api/export-statistics", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      // Get the filename from the content-disposition header if available
      const contentDisposition = response.headers.get("content-disposition");
      let filename = "export.csv";
      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      // Convert the response to a blob and download it
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      // Handle error
      const errorText = await response.text();
      alert(`Export failed: ${errorText}`);
    }
  }

  return (
    <form action={handleSubmit} className="flex gap-2">
      <input type="hidden" name="userId" value={user.userId} />
      <input type="hidden" name="role" value={user.role} />
      <select
        name="eventId"
        className="select select-bordered"
        defaultValue=""
        required
      >
        <option value="" disabled>
          Select an event
        </option>
        {events.map((event) => (
          <option key={event.eventId} value={event.eventId}>
            {event.title}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary">
        <Download className="h-5 w-5" /> Export Report
      </button>
    </form>
  );
}
