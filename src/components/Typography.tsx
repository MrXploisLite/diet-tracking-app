import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useApp } from '../context/AppContext';

interface ThemedTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyBold' | 'caption' | 'small';
  color?: string;
}

export const ThemedText: React.FC<ThemedTextProps> = ({ 
  variant = 'body', 
  color,
  style, 
  ...props 
}) => {
  const { theme } = useApp();
  
  const textColor = color ?? theme.colors.text;
  const typographyStyle = theme.typography[variant];
  
  const combinedStyle: TextStyle[] = [
    { color: textColor },
    typographyStyle,
    style as TextStyle,
  ].filter(Boolean);

  return <Text style={combinedStyle} {...props} />;
};

export const Heading1: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="h3" {...props} />
);

export const Heading4: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="h4" {...props} />
);

export const BodyText: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="body" {...props} />
);

export const Caption: React.FC<Omit<ThemedTextProps, 'variant'>> = (props) => (
  <ThemedText variant="caption" {...props} />
);
