import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { showToast } from '../store/actions/uiActions';

export default function useToast() {
  const dispatch = useDispatch();
  return useMemo(
    () => ({
      success: (m) => dispatch(showToast('success', m)),
      error: (m) => dispatch(showToast('danger', m)),
      info: (m) => dispatch(showToast('info', m)),
    }),
    [dispatch]
  );
}
