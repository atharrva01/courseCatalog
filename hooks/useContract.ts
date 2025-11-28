// hooks/useContract.ts
"use client";

import { useState, useEffect } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { contractABI, contractAddress } from "@/lib/contract";

export const useCourseContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState<any>(null);

  const { data: totalCourses, refetch: refetchCourseCount } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "totalCourses",
  });

  const {
    writeContractAsync,
    data: hash,
    error,
    isPending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      refetchCourseCount();
    }
  }, [isConfirmed, refetchCourseCount]);

  const addCourse = async (
    title: string,
    instructor: string,
    price: string
  ) => {
    if (!title || !instructor || !price) return;
    try {
      setIsLoading(true);
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "addCourse",
        args: [title, instructor, BigInt(price)],
      });
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getCourse = async (id: string) => {
    try {
      const data = await useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "getCourse",
        args: [BigInt(id)],
      });
      setCourse(data);
    } catch (err) {
      throw err;
    }
  };

  return {
    data: {
      totalCourses: totalCourses ? Number(totalCourses as bigint) : 0,
      course,
    },
    actions: {
      addCourse,
      getCourse,
    },
    state: {
      isLoading: isLoading || isPending || isConfirming,
      isPending,
      isConfirming,
      isConfirmed,
      hash,
      error,
    },
  };
};
