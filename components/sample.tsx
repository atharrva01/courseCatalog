// components/sample.tsx
"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useCourseContract } from "@/hooks/useContract";

const SampleIntegration = () => {
  const { isConnected } = useAccount();
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [price, setPrice] = useState("");
  const [courseId, setCourseId] = useState("");

  const { data, actions, state } = useCourseContract();

  const handleAddCourse = async () => {
    try {
      await actions.addCourse(title, instructor, price);
      setTitle("");
      setInstructor("");
      setPrice("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetCourse = async () => {
    try {
      await actions.getCourse(courseId);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isConnected) return "Connect Wallet to Continue";

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 space-y-4 bg-white shadow-lg border rounded-lg max-w-lg w-full">
        <h1 className="text-xl font-bold">Course Catalog Contract Demo</h1>

        <div>
          <p>Total Courses: {data.totalCourses}</p>
        </div>

        <div className="space-y-2">
          <input
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            placeholder="Instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            placeholder="Price (wei)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 w-full"
          />
          <button
            disabled={state.isLoading}
            onClick={handleAddCourse}
            className="bg-blue-600 text-white px-4 py-2"
          >
            {state.isLoading ? "Submitting..." : "Add Course"}
          </button>
        </div>

        <div className="space-y-2">
          <input
            placeholder="Course ID"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="border p-2 w-full"
          />
          <button
            disabled={state.isLoading}
            onClick={handleGetCourse}
            className="bg-gray-700 text-white px-4 py-2"
          >
            Fetch Course
          </button>
        </div>

        {data.course && (
          <div className="border p-4 rounded">
            <p>
              <strong>ID:</strong> {data.course[0].toString()}
            </p>
            <p>
              <strong>Title:</strong> {data.course[1]}
            </p>
            <p>
              <strong>Instructor:</strong> {data.course[2]}
            </p>
            <p>
              <strong>Price:</strong> {data.course[3].toString()}
            </p>
          </div>
        )}

        {state.hash && <p>Tx: {state.hash}</p>}
        {state.error && (
          <p className="text-red-500">Error: {state.error.message}</p>
        )}
      </div>
    </div>
  );
};

export default SampleIntegration;
