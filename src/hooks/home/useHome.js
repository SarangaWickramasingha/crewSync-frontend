import { useMutation, useQuery } from '@tanstack/react-query';
import { feedbackApi, statsApi } from '@/src/api';

export const STATS_SUMMARY_KEY = ['home', 'stats'];

export function useStatsSummary() {
  return useQuery({ queryKey: STATS_SUMMARY_KEY, queryFn: statsApi.fetchStatsSummary });
}

export function useSubmitFeedback() {
  return useMutation({ mutationFn: feedbackApi.submitFeedback });
}
