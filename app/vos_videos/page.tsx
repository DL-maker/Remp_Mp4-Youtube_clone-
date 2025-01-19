"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "@/components/navbar";

function generateRandomData() {
  return Array.from({ length: 7 }, () => ({
    date: `Day ${Math.floor(Math.random() * 30) + 1}`,
    abonnés: Math.floor(Math.random() * 100),
    vues: Math.floor(Math.random() * 100),
    likes: Math.floor(Math.random() * 100),
    dislikes: Math.floor(Math.random() * 100),
  }));
}

const VosVideosPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(generateRandomData());
  const [videos, setVideos] = useState<
    Array<{ id: number; date: string; type: string; url: string }>
  >([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoType, setVideoType] = useState("normale");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.includes("video/")) {
      setVideoFile(file);
    }
  };

  const handlePublish = async () => {
    if (!videoFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("type", videoType);

    try {
      const response = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();
      setVideos((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          date: new Date().toLocaleDateString(),
          type: videoType,
          url: result.url,
        },
      ]);

      // Reset
      setVideoFile(null);
      setVideoType("normale");
      setData(generateRandomData());
      if (document.getElementById("videoInput") instanceof HTMLInputElement) {
        (document.getElementById("videoInput") as HTMLInputElement).value = "";
      }
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
        <div className="text-center text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
        <div className="text-center text-red-500">Erreur : {error}</div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-100 min-h-screen">
      <Navbar toggleColumn={toggleColumn} isOpen={isOpen} />
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord</h1>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="abonnés" stroke="#7c3aed" />
          <Line type="monotone" dataKey="vues" stroke="#3b82f6" />
          <Line type="monotone" dataKey="likes" stroke="#10b981" />
          <Line type="monotone" dataKey="dislikes" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Importer une vidéo
          </label>
          <input
            id="videoInput"
            type="file"
            accept="video/mp4,video/webm"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de vidéo
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
          type="radio"
          value="normale"
          checked={videoType === "normale"}
          onChange={(e) => setVideoType(e.target.value)}
          className="form-radio text-indigo-600"
              />
              <span className="ml-2 pl-2">Normale</span>
            </label>
            <label className="inline-flex items-center">
              <input
          type="radio"
          value="short"
          checked={videoType === "short"}
          onChange={(e) => setVideoType(e.target.value)}
          className="form-radio text-indigo-600"
              />
              <span className="ml-2">Short</span>
            </label>
          </div>
        </div>

        <button
          onClick={handlePublish}
          disabled={isUploading || !videoFile}
          className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? "Téléchargement..." : "Publier la vidéo"}
        </button>
      </div>

      <table className="mt-8 bg-white rounded-lg shadow-md w-full text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Vidéo</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} className="border-b">
              <td className="px-6 py-4">{video.id}</td>
              <td className="px-6 py-4">{video.date}</td>
              <td className="px-6 py-4">{video.type}</td>
              <td className="px-6 py-4">
                <video width="200" controls className="rounded-lg">
                  <source src={video.url} type="video/mp4" />
                </video>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VosVideosPage;