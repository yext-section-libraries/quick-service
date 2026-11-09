import { msg } from "@yext/visual-editor/section-library-support";
import type { CSSProperties } from "react";
import {
  resolveComponentData,
  type StyledPlainTextProps,
  type StyledRichTextProps,
  type StyledTextValue,
  type TranslatableString,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

export const plainTextFields = {
  data: {
    label: msg("fields.text", "Text"),
    type: "object",
    objectFields: {
      text: {
        label: msg("fields.text", "Text"),
        type: "entityField",
        filter: { types: ["type.string"] },
      },
    },
  },
  fontOptions: {
    label: msg("fields.fontOptions", "Font Options"),
    type: "styledText",
    includeColor: true,
    colorLabel: msg("fields.fontColor", "Font Color"),
    transform: true,
  },
} satisfies YextFields<StyledPlainTextProps>;

export const richTextFields = {
  data: {
    label: msg("fields.text", "Text"),
    type: "object",
    objectFields: {
      text: {
        label: msg("fields.text", "Text"),
        type: "entityField",
        filter: { types: ["type.string", "type.rich_text_v2"] },
      },
    },
  },
  fontOptions: {
    label: msg("fields.fontOptions", "Font Options"),
    type: "styledText",
    includeColor: true,
    colorLabel: msg("fields.fontColor", "Font Color"),
    transform: true,
  },
} satisfies YextFields<StyledRichTextProps>;

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

/** Preserve body overrides when nested components redefine theme tokens. */
export const withBodyTypography = (styles: CSSProperties = {}) => ({
  ...styles,
  ...Object.fromEntries(
    Object.entries(styles)
      .filter(
        ([property, value]) =>
          [
            "fontFamily",
            "fontSize",
            "fontWeight",
            "fontStyle",
            "textTransform",
          ].includes(property) && value !== undefined,
      )
      .flatMap(([property, value]) => [
        [`--${property}-body-${property}`, value],
        [`--quick-service-body-${property}`, value],
      ]),
  ),
});

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
