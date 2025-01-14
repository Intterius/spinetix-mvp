import { Dialog, DialogTitle, Box } from '@mui/material';
import { ChromePicker } from 'react-color';

interface ColorPickerDialogProps {
  open: boolean;
  currentColor: string;
  onClose: () => void;
  onColorChange: (color: string) => void;
}

const ColorPickerDialog = ({
  open,
  currentColor,
  onClose,
  onColorChange,
}: ColorPickerDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Choose Color</DialogTitle>
      <Box sx={{ p: 2 }}>
        <ChromePicker
          color={currentColor}
          onChange={(color) => onColorChange(color.hex)}
        />
      </Box>
    </Dialog>
  );
};

export default ColorPickerDialog;
