import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";
import {
  Background,
  EntityField,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveBreadcrumbs,
  resolveComponentData,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  useDocument,
  useTemplateProps,
  VisibilityWrapper,
} from "@yext/visual-editor";

type QuickServiceBreadcrumbsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  rootLabel: YextEntityField<TranslatableString>;
  textStyles: StyledTextValue;
  fontColor?: ThemeColor;
  includeCurrentLocation: boolean;
};

const fields: YextFields<QuickServiceBreadcrumbsProps> = {
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
  rootLabel: {
    label: "Root Label",
    type: "entityField",
    filter: { types: ["type.string"] },
  },
  textStyles: {
    label: "Text Styles",
    type: "styledText",
  },
  fontColor: {
    label: "Font Color",
    type: "basicSelector",
    options: "SITE_COLOR",
  },
  includeCurrentLocation: {
    label: "Include Current Location",
    type: "radio",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
};

const QuickServiceBreadcrumbsStyles = String.raw`
.quick-service-breadcrumbs {
  padding: 14px 28px;
  font-family: "Hubot Sans", "Avenir Next", "Segoe UI", sans-serif;
}
.quick-service-breadcrumbs-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.quick-service-breadcrumbs-link {
  color: inherit;
  text-decoration: none;
}
.quick-service-breadcrumbs-link:hover,
.quick-service-breadcrumbs-link:focus-visible {
  text-decoration: underline;
}
.quick-service-breadcrumbs-separator {
  opacity: 0.65;
}
.quick-service-breadcrumbs-current {
  opacity: 0.82;
}
@media (max-width: 640px) {
  .quick-service-breadcrumbs { padding: 12px 20px; }
}
`;

const QuickServiceBreadcrumbsComponent: PuckComponent<
  QuickServiceBreadcrumbsProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const locale = streamDocument.locale ?? "en";
  const breadcrumbs = resolveBreadcrumbs(streamDocument);
  const rootLabel = resolveComponentData(
    props.rootLabel,
    locale,
    streamDocument,
  );
  const currentLocationLabel = streamDocument.name ?? "";
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
  );
  const textStyle: React.CSSProperties = {
    color:
      getThemeColorCssValue(props.fontColor) ??
      getThemeColorCssValue(props.section.backgroundColor.contrastingColor),
    fontFamily:
      props.textStyles.fontFamily === "default"
        ? undefined
        : props.textStyles.fontFamily,
    fontSize:
      props.textStyles.fontSize === "default"
        ? undefined
        : props.textStyles.fontSize,
    fontStyle:
      props.textStyles.fontStyle === "default"
        ? undefined
        : props.textStyles.fontStyle,
    fontWeight:
      props.textStyles.fontWeight === "default"
        ? undefined
        : props.textStyles.fontWeight,
    textTransform:
      props.textStyles.textTransform === "default"
        ? undefined
        : props.textStyles.textTransform,
  };

  if (!breadcrumbs.length) {
    return props.puck.isEditing ? (
      <p
        style={{
          ...sectionSurfaceStyle,
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "18px 24px",
        }}
      >
        No breadcrumbs available (section will be hidden on live page). Create a
        directory to enable breadcrumbs.
      </p>
    ) : (
      <></>
    );
  }

  const visibleBreadcrumbs = props.includeCurrentLocation
    ? breadcrumbs
    : breadcrumbs.slice(0, -1);

  if (!visibleBreadcrumbs.length) {
    return <></>;
  }

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <>
        <style>{QuickServiceBreadcrumbsStyles}</style>
        <Background
          as="nav"
          aria-label="Breadcrumbs"
          background={props.section.backgroundColor}
          className="quick-service-breadcrumbs"
          style={sectionSurfaceStyle}
        >
          <ol className="quick-service-breadcrumbs-list" style={textStyle}>
            {visibleBreadcrumbs.map(({ name, slug }, breadcrumbIndex) => {
              const isRoot = breadcrumbIndex === 0;
              const isCurrentLocation =
                props.includeCurrentLocation &&
                breadcrumbIndex === visibleBreadcrumbs.length - 1;
              const label = isCurrentLocation
                ? currentLocationLabel || name
                : isRoot && rootLabel
                  ? rootLabel
                  : name;
              const href = relativePrefixToRoot
                ? relativePrefixToRoot + slug
                : slug;

              return (
                <React.Fragment key={`${slug}-${breadcrumbIndex}`}>
                  {breadcrumbIndex > 0 && (
                    <li
                      aria-hidden="true"
                      className="quick-service-breadcrumbs-separator"
                    >
                      /
                    </li>
                  )}
                  <li>
                    {isCurrentLocation ? (
                      <span
                        aria-current="page"
                        className="quick-service-breadcrumbs-current"
                      >
                        {label}
                      </span>
                    ) : (
                      <Link
                        className="quick-service-breadcrumbs-link"
                        eventName={`breadcrumb${breadcrumbIndex}`}
                        href={href}
                      >
                        {isRoot ? (
                          <EntityField
                            displayName="Root Label"
                            fieldId={props.rootLabel.field}
                            constantValueEnabled={
                              props.rootLabel.constantValueEnabled
                            }
                          >
                            <span>{label}</span>
                          </EntityField>
                        ) : (
                          label
                        )}
                      </Link>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </Background>
      </>
    </VisibilityWrapper>
  );
};

export const QuickServiceBreadcrumbs: YextComponentConfig<QuickServiceBreadcrumbsProps> =
  {
    label: "Breadcrumbs",
    fields,
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "palette-quaternary-contrast",
        },
        visibleOnLivePage: true,
      },
      rootLabel: {
        field: "",
        constantValue: { defaultValue: "All Locations" },
        constantValueEnabled: true,
      },
      textStyles: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
      fontColor: undefined,
      includeCurrentLocation: true,
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`QuickServiceBreadcrumbs${getAnalyticsScopeHash(props.id)}`}
      >
        <QuickServiceBreadcrumbsComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };

export const config: SectionConfig = {
  id: "QuickServiceBreadcrumbs",
  displayName: "Breadcrumbs",
  description: "Breadcrumbs",
  pageSetTypes: ["ENTITY"],
};
