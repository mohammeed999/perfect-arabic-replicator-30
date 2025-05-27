
import { useAppContext } from '@/context/AppContext';

export const useDashboard = () => {
  const context = useAppContext();
  
  return {
    ...context,
    refresh: () => {
      // Since we're using AppContext, data is already reactive
      // This is kept for compatibility but doesn't need to do anything
      console.log('Dashboard data refreshed');
    },
    isLoading: false // AppContext manages data synchronously for now
  };
};
