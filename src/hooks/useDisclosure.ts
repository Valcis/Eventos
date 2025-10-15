import { useCallback, useState } from 'react'

export function useDisclosure(initial: boolean = false) {
    const [isOpen, setIsOpen] = useState<boolean>(initial)
    const onOpen = useCallback(() => setIsOpen(true), [])
    const onClose = useCallback(() => setIsOpen(false), [])
    const onToggle = useCallback(() => setIsOpen(v => !v), [])
    return { isOpen, onOpen, onClose, onToggle } as const
}
