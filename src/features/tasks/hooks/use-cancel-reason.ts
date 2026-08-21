import { useState } from "react";

export const useCancelReason = (
  onConfirm: (reason: string) => Promise<void>,
  onClose: () => void,
) => {
  const [reason, setReason] = useState("");

  const isValid = reason.trim().length > 0 && reason.trim().length <= 500;

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleConfirm = async () => {
    if (!reason.trim()) return;

    await onConfirm(reason.trim());

    setReason("");
  };

  return { reason, setReason, isValid, handleClose, handleConfirm };
};
