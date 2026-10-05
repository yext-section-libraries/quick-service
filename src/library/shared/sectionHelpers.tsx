import * as React from "react";
import {
  MaybeRTF,
  getThemeColorCssValue,
  resolveComponentData,
  type MaybeRTFProps,
  type RichText,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

export type SectionProps = {
  backgroundColor: ThemeColor;
  visibleOnLivePage: boolean;
};

export const sectionField: YextFields<{ section: SectionProps }>["section"] = {
  label: "Section",
  type: "object",
  objectFields: {
    backgroundColor: {
      label: "Background Color",
      type: "basicSelector",
      options: "BACKGROUND_COLOR",
    },
    visibleOnLivePage: {
      label: "Visible on Live Page",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  },
};

/** Options formerly exposed by the Visual Editor as ThemeOptions.ASPECT_RATIO. */
export const aspectRatioOptions = [
  { label: "1:1", value: 1 },
  { label: "5:4", value: 1.25 },
  { label: "4:3", value: 1.33 },
  { label: "3:2", value: 1.5 },
  { label: "5:3", value: 1.67 },
  { label: "16:9", value: 1.78 },
  { label: "2:1", value: 2 },
  { label: "3:1", value: 3 },
  { label: "4:1", value: 4 },
  { label: "4:5", value: 0.8 },
  { label: "3:4", value: 0.75 },
  { label: "2:3", value: 0.67 },
];

export const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

export const resolveStringEntityFieldValue = (
  field: YextEntityField<string | TranslatableString> | undefined,
  locale: string,
  streamDocument: Record<string, unknown>,
  fallback = "",
): string => {
  if (!field) {
    return fallback;
  }

  const resolvedValue = resolveComponentData(field, locale, streamDocument, {
    output: "plainText",
  }).trim();
  if (resolvedValue) {
    return resolvedValue;
  }

  return toRenderableText(field.constantValue, fallback).trim();
};

export const resolveStyledTextStyles = (
  styles:
    | Partial<
        Pick<
          StyledTextValue,
          "fontFamily" | "fontSize" | "fontWeight" | "fontStyle" | "textTransform"
        >
      >
    | undefined,
) => ({
  fontFamily: styles?.fontFamily === "default" ? undefined : styles?.fontFamily,
  fontSize: styles?.fontSize === "default" ? undefined : styles?.fontSize,
  fontWeight: styles?.fontWeight === "default" ? undefined : styles?.fontWeight,
  fontStyle: styles?.fontStyle === "default" ? undefined : styles?.fontStyle,
  textTransform:
    styles?.textTransform === "default" ? undefined : styles?.textTransform,
});

/** Preserve body field overrides when nested components redefine theme tokens. */
export const resolveStyledBodyStyles = (
  styles: Parameters<typeof resolveStyledTextStyles>[0],
) => {
  const textStyle = resolveStyledTextStyles(styles);
  return {
    ...textStyle,
    ...Object.fromEntries(
      Object.entries(textStyle)
        .filter(([, value]) => value !== undefined)
        .map(([property, value]) => [`--quick-service-body-${property}`, value]),
    ),
  };
};

export const toRenderableText = (value: unknown, fallback = ""): string => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const nestedValue = "text" in record ? record.text : record.defaultValue;
    if (typeof nestedValue === "string" || typeof nestedValue === "number") {
      return String(nestedValue);
    }
  }

  return fallback;
};

export const renderRichText = (
  value: unknown,
  richTextStyleOverrides?: MaybeRTFProps["richTextStyleOverrides"],
): React.ReactNode => {
  const textStyle = resolveStyledTextStyles(richTextStyleOverrides);
  const bodyStyle = resolveStyledBodyStyles(richTextStyleOverrides);
  const bodyVariables = Object.fromEntries(
    Object.entries(textStyle)
      .filter(([, value]) => value !== undefined)
      .map(([property, value]) => [`--${property}-body-${property}`, value]),
  );
  const color =
    typeof richTextStyleOverrides?.color === "object"
      ? getThemeColorCssValue(richTextStyleOverrides.color)
      : richTextStyleOverrides?.color;

  if (React.isValidElement(value)) {
    if (value.type === MaybeRTF) {
      const element = value as React.ReactElement<MaybeRTFProps>;
      return React.cloneElement(element, {
        richTextStyleOverrides: { ...textStyle, color },
        style: { ...element.props.style, ...bodyStyle, ...bodyVariables, color },
      });
    }

    const element = value as React.ReactElement<{
      style?: React.CSSProperties;
      children?: React.ReactNode;
    }>;
    const child = element.props.children;
    const isMaybeRTFChild = React.isValidElement(child) && child.type === MaybeRTF;
    const isRichTextChild = React.isValidElement<{
      className?: string;
      style?: React.CSSProperties;
    }>(child) && child.props.className?.includes("rtf-wrapper");

    return React.cloneElement(
      element,
      {
        children:
          isMaybeRTFChild
            ? renderRichText(child, richTextStyleOverrides)
            : isRichTextChild
            ? React.cloneElement(child, {
                style: {
                  ...child.props.style,
                  ...bodyStyle,
                  ...bodyVariables,
                  color,
                },
              })
            : child,
        style: {
          ...element.props.style,
          ...bodyStyle,
          // Rich-text descendants read body tokens, so overrides must reach them.
          ...bodyVariables,
          color,
        },
      },
    );
  }

  const data =
    typeof value === "string" ||
    (typeof value === "object" && value !== null && "html" in value)
      ? (value as RichText | string)
      : undefined;

  return (
    <MaybeRTF
      data={data}
      richTextStyleOverrides={{ ...textStyle, color }}
    />
  );
};

export const isRichTextEmpty = (value: unknown): boolean => {
  if (!value) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (typeof value === "object" && "html" in value) {
    const html = (value as { html?: unknown }).html;
    return typeof html !== "string" || html.trim() === "";
  }

  return false;
};
