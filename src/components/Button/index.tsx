import { ButtonHTMLAttributes } from "react";
import { StyledButton } from './style';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean,
};

export function Button({ isOutlined = false, ...props }: ButtonProps) {
return (
  <StyledButton className={`button ${isOutlined ? 'outlined' : ''}`} {...props} />
)
}