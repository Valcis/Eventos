export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
  isClosable?: boolean;
}

export interface ToastItem {
  title: string;
  description?: string;
  variant: ToastVariant;
  durationMs?: number;
  isClosable: boolean;
}
