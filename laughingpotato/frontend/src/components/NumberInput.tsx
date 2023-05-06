import {Input} from 'semantic-ui-react';
import React from 'react';
import {useDebounce} from 'react-use';
import {toast} from 'react-toastify';

interface NumberInputProps {
  onChange: (value: number) => void;
  value?: number;
  min?: number;
  max?: number;
  defaultValue?: number;
  disabled?: boolean;
}

const NumberInput = ({
                       value, min = 0, max = 9, defaultValue = 0, onChange, disabled = false,
                     }: NumberInputProps) => {
  let rangedDefaultValue: number;
  if (defaultValue < min) {
    rangedDefaultValue = min;
  } else {
    rangedDefaultValue = defaultValue > max ? max : defaultValue;
  }
  const [internalValue, setInternalValue] = React.useState(value || rangedDefaultValue);
  const [inputValue, setInputValue] = React.useState(value || rangedDefaultValue);
  const error = React.useRef(false);

  useDebounce(() => {
    if (min <= inputValue && inputValue <= max) {
      error.current = false;
      setInternalValue(inputValue);
      onChange(inputValue);
    } else {
      toast.error(`La valeur saisie est incorrecte, elle doit être comprise entre ${min} et ${max}`);
      error.current = true;
      setInputValue(internalValue);
    }
  }, 600, [inputValue]);

  return (
    <Input
      fluid
      value={inputValue}
      type="number"
      disabled={disabled}
      min={min}
      max={max}
      error={error.current}
      onChange={(e) => setInputValue(Number(e.target.value))}
    />
  );
};

export default NumberInput;
