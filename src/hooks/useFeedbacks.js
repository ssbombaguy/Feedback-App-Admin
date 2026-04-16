import { useQuery, useMutation } from '@tanstack/react-query';
import { adminAPI } from '../api/api';

export const useFeedbacks = () => {
  return useQuery({
    queryKey: ['feedbacks'],
    queryFn: adminAPI.getFeedbacks,
    staleTime: 5 * 60 * 1000, 
  });
};

export const useAdminCourses = () => {
  const { data: feedbacks, isLoading, isError, error } = useFeedbacks();

  const coursesMap = {};
  feedbacks?.forEach((fb) => {
    const name = fb.course_name; 
    if (!coursesMap[name]) {
      coursesMap[name] = 0;
    }
    coursesMap[name]++;
  });

  const courses = Object.keys(coursesMap).map((name) => ({
    courseName: name,
    totalFeedbacks: coursesMap[name],
  }));

  return { 
    courses, 
    isLoading, 
    isError, 
    error 
  };
};

export const useSendNotification = () => {
  return useMutation({
    mutationFn: (data) => adminAPI.sendNotification(data),
  });
};