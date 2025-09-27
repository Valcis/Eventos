export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export type ToastOptions = {
    title: string;
    description?: string;
    variant?: ToastVariant;
    durationMs?: number;
    isClosable?: boolean;
};

export type ToastItem = {
    title: string;
    description?: string;
    variant: ToastVariant;
    durationMs?: number;
    isClosable: boolean;
};
