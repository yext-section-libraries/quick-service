import type * as React from "react";
import "../shared/typography.css";

import type { SectionConfig } from "@yext/visual-editor";
import { msg } from "@yext/visual-editor/section-library-support";

import { WithId, WithPuckProps } from "@puckeditor/core";
import { CircleSlash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Body,
  EntityField,
  PageSection,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  type YextTransformedProps,
  backgroundColors,
  getDefaultRTF,
  getThemeColorCssValue,
  resolveComponentData,
  resolveYextEntityField,
  useDocument,
} from "@yext/visual-editor";
import { withBodyTypography } from "../shared/sectionHelpers";

type QuickServiceBannerProps = {
  data: {
    text: YextEntityField<TranslatableRichText>;
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  styles: {
    textAlignment: "left" | "center" | "right";
  };
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const QuickServiceBannerFields = {
  data: {
    label: msg("fields.bannerText", "Banner Text"),
    type: "object",
    objectFields: {
      text: {
        label: msg("fields.text", "Text"),
        type: "entityField",
        filter: {
          types: ["type.rich_text_v2"],
        },
      },
      styles: {
        label: msg("fields.textStyles", "Text Styles"),
        type: "styledText",
        transform: true,
      },
      fontColor: {
        label: msg("fields.textColor", "Text Color"),
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
  styles: {
    label: msg("fields.styles", "Styles"),
    type: "object",
    objectFields: {
      textAlignment: {
        label: msg("fields.textAlignment", "Text Alignment"),
        type: "radio",
        options: [
          { label: msg("fields.options.left", "Left"), value: "left" },
          { label: msg("fields.options.center", "Center"), value: "center" },
          { label: msg("fields.options.right", "Right"), value: "right" },
        ],
      },
    },
  },
  section: {
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
  },
} satisfies YextFields<QuickServiceBannerProps>;

const isRichTextEmpty = (value: unknown): boolean => {
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

const QuickServiceBannerComponent: React.FC<
  WithPuckProps<
    WithId<
      YextTransformedProps<
        QuickServiceBannerProps,
        typeof QuickServiceBannerFields
      >
    >
  >
> = ({ data, styles, section, puck }) => {
  const { i18n } = useTranslation();
  const streamDocument = useDocument();
  const isMappedField =
    !data.text.constantValueEnabled && Boolean(data.text.field);

  if (
    isMappedField &&
    isRichTextEmpty(
      resolveYextEntityField(streamDocument, data.text, i18n.language),
    )
  ) {
    if (!puck.isEditing) {
      return <></>;
    }

    return (
      <PageSection
        background={section.backgroundColor}
        className="flex items-center justify-center"
      >
        <div className="relative flex h-20 w-full flex-row items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4">
          <CircleSlash2 className="h-10 w-10 flex-shrink-0 text-gray-400" />
          <div className="flex flex-col items-start">
            <Body className="text-gray-500" variant="sm">
              Section hidden for this page
            </Body>
            <Body className="text-gray-500" variant="sm">
              The mapped banner field is empty
            </Body>
          </div>
        </div>
      </PageSection>
    );
  }

  const richTextStyleOverrides = {
    ...data.styles,
    color: getThemeColorCssValue(
      data.fontColor ?? section.backgroundColor.contrastingColor,
    ),
  };
  const resolvedText = resolveComponentData(
    data.text,
    i18n.language,
    streamDocument,
  );

  if (!resolvedText) {
    return <></>;
  }

  return (
    <PageSection
      background={section.backgroundColor}
      style={withBodyTypography(richTextStyleOverrides)}
      className={`flex items-center ${
        {
          left: "justify-start text-left",
          center: "justify-center text-center",
          right: "justify-end text-right",
        }[styles.textAlignment]
      }`}
    >
      <EntityField
        constantValueEnabled={data.text.constantValueEnabled}
        displayName="Banner Text"
        fieldId={data.text.field}
      >
        {typeof resolvedText === "string" ? (
          <Body style={richTextStyleOverrides}>{resolvedText}</Body>
        ) : (
          resolvedText
        )}
      </EntityField>
    </PageSection>
  );
};

/**
 * Displays a full-width, editor-configurable rich-text banner.
 */
export const QuickServiceBanner: YextComponentConfig<
  QuickServiceBannerProps,
  typeof QuickServiceBannerFields
> = {
  label: msg("components.bannerLabel", "Banner"),
  fields: QuickServiceBannerFields,
  defaultProps: {
    data: {
      text: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF("Banner Text"),
        },
        constantValueEnabled: true,
      },
      styles: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
    },
    styles: {
      textAlignment: "center",
    },
    section: {
      backgroundColor: backgroundColors.color1.value,
      visibleOnLivePage: true,
    },
  },
  render: (props) => (
    <VisibilityWrapper
      isEditing={props.puck.isEditing}
      liveVisibility={props.section.visibleOnLivePage}
    >
      <QuickServiceBannerComponent {...props} />
    </VisibilityWrapper>
  ),
};

export const config: SectionConfig = {
  id: "QuickServiceBanner",
  displayName: "Banner",
  description: "Banner",
  pageSetTypes: ["ENTITY"],
};
