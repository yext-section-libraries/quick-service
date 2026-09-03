import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  Background,
  EntityField,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  getAnalyticsScopeHash,
  getAggregateRating,
  resolveComponentData,
  ReviewStars,
  type StyledTextValue,
  type ThemeColor,
  type YextEntityField,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextFields,
  TranslatableString,
} from "@yext/visual-editor";

type QuickServiceReviewsProps = {
  section: {
    backgroundColor: ThemeColor;
    cardBackgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor: ThemeColor | undefined;
  };
  content: {
    styles: StyledTextValue;
    fontColor: ThemeColor | undefined;
  };
};

type FirstPartyReview = {
  authorName: string;
  rating: string;
  reviewDate: string;
  content: string;
};

const sampleReviews: FirstPartyReview[] = [
  {
    authorName: "Sample Guest",
    rating: "5",
    reviewDate: "",
    content:
      "Sample review data shown only in the editor. This will not appear on the live page.",
  },
  {
    authorName: "Sample Guest",
    rating: "4",
    reviewDate: "",
    content:
      "Add real first-party reviews to replace this sample content before publishing.",
  },
];

const REVIEW_PUBLISHER_VALUE = "FIRSTPARTY" as const;

const QuickServiceReviewsStyles = String.raw`
@import url("https://fonts.googleapis.com/css2?family=Baloo:wght@400..800&family=Baloo+2:wght@400..800&family=Hubot+Sans:wght@400..700&display=swap");

:root {
  --font--heading-bold--family: "Baloo", "Trebuchet MS", sans-serif;
  --font--heading-light--family: "Baloo 2", "Trebuchet MS", sans-serif;
  --font--paragraph--family: "Hubot Sans", "Avenir Next", "Segoe UI", sans-serif;
  --section-heading-content-gap: 30px;
  --split-section-heading-content-gap: 30px;
  --bc-white: #ffffff;
  --bc-text: var(--colors-palette-quaternary, #373737);
  --bc-text-inverse: var(--colors-palette-quaternary-contrast, #ffffff);
  --bc-border: #111111;
  --bc-shadow: var(--colors-palette-quaternary, #000000);
  --bc-surface-dark: var(--colors-palette-quaternary, #222222);
  --bc-surface-dark-alt: var(--colors-palette-quaternary, #1f2023);
  --bc-primary: var(--colors-palette-primary, #acca64);
  --bc-primary-contrast: var(--colors-palette-primary-contrast, #222222);
  --bc-secondary: var(--colors-palette-secondary, #8eaa4d);
  --bc-secondary-contrast: var(--colors-palette-secondary-contrast, #ffffff);
  --bc-tertiary: var(--colors-palette-tertiary, #fa688e);
  --bc-tertiary-contrast: var(--colors-palette-tertiary-contrast, #111111);
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: var(--font--paragraph--family); color: var(--bc-text); background: var(--bc-white); }
body.no-scroll { overflow: hidden; }
p { font-weight: 400; }

h1, h2, h3, h4, h5, h6,
.site-brand {
  font-family: var(--font--heading-bold--family);
}


.mobile-nav-brand,
.quick-service-detail-label {
  font-family: var(--font--heading-light--family);
}

.site-header button,
.quick-service-footer-form input,
.quick-service-footer-form button,
.quick-service-faq-trigger,
.site-header-btn,
.quick-service-featured-cta,
.quick-service-events-cta,
.quick-service-footer-form button {
  font-family: var(--font--paragraph--family);
}

.site-header {
  position: relative;
  z-index: 20;
  background: var(--bc-surface-dark);
  color: var(--bc-text-inverse);
  border-top: 2px solid var(--bc-border);
}
.site-header-inner {
  position: relative;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 10px 28px;
}
.menu-toggle {
  display: none;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-direction: column;
  cursor: pointer;
}
.menu-toggle span {
  width: 18px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  display: block;
  transition: transform .2s ease, opacity .2s ease;
}
.menu-toggle.is-open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.menu-toggle.is-open span:nth-child(2) { opacity: 0; }
.menu-toggle.is-open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
.site-header-left,
.site-header-right {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}
.site-header-right {
  justify-content: flex-end;
}
.site-header-center {
  flex: 0 0 auto;
  position: relative;
}
.site-brand-measure {
  position: absolute;
  visibility: hidden;
  white-space: nowrap;
  pointer-events: none;
  font-family: var(--font--heading-bold--family);
  font-size: 24px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.site-brand {
  color: var(--bc-text-inverse);
  text-decoration: none;
  font-size: 24px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.02em;
  display: inline-block;
}
.site-brand-line {
  display: block;
  white-space: nowrap;
}
.site-brand--split {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  text-align: center;
}
.site-brand--split .site-brand-line--secondary {
  display: block;
}
.site-brand--split .site-brand-line {
  white-space: normal;
  text-align: center;
  text-wrap: balance;
  overflow-wrap: anywhere;
}
.site-brand-line--secondary {
  display: none;
}
.site-header-btn {
  color: var(--bc-text-inverse);
  text-decoration: none;
  font-family: inherit;
  font-size: 16px;
  line-height: 1;
  font-weight: 400;
  letter-spacing: 0.02em;
  transition: opacity .2s ease;
}
.site-header-btn:hover,
.site-header-btn:focus-visible {
  opacity: .75;
}
.site-social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  transition: opacity .2s ease;
}
.site-social-link img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.site-social-link:hover,
.site-social-link:focus-visible {
  opacity: .75;
}
.mobile-nav {
  position: fixed;
  inset: 0;
  background: rgba(13, 16, 20, 0.96);
  backdrop-filter: blur(2px);
  z-index: 35;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  will-change: opacity;
  transition: opacity .34s cubic-bezier(.22, .61, .36, 1), visibility 0s linear .34s;
}
.mobile-nav.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition: opacity .34s cubic-bezier(.22, .61, .36, 1), visibility 0s linear 0s;
}
.mobile-nav-inner {
  width: 100%;
  min-height: 100%;
  padding: 10px 28px 32px;
  display: grid;
  align-content: start;
  gap: 14px;
  opacity: 0;
  will-change: opacity;
  transition: opacity .22s ease;
}
.mobile-nav.is-open .mobile-nav-inner {
  opacity: 1;
}
.mobile-nav-header {
  position: relative;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  min-height: 58px;
  gap: 8px;
}
.mobile-nav-brand {
  margin: 0;
  color: rgba(248, 248, 248, 0.96);
  letter-spacing: 0.02em;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
  grid-column: 2;
  width: 100%;
  max-width: none;
  min-width: 0;
  justify-self: center;
  padding-inline: 0;
  white-space: normal;
  text-wrap: balance;
  overflow-wrap: anywhere;
  word-break: normal;
}
.mobile-nav-brand .site-brand-line {
  white-space: normal;
  text-wrap: balance;
  overflow-wrap: anywhere;
  word-break: normal;
}
.mobile-nav-brand-measure {
  position: absolute;
  visibility: hidden;
  white-space: nowrap;
  pointer-events: none;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
}
.mobile-nav-brand--split {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.mobile-nav-brand--split .site-brand-line {
  white-space: normal;
  text-wrap: balance;
  overflow-wrap: anywhere;
  text-align: center;
}
.mobile-nav-brand--split .site-brand-line--secondary {
  display: block;
}
.mobile-nav-close {
  position: absolute;
  left: 0;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 38px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}
.mobile-nav-inner a {
  color: #eef2f6;
  text-decoration: none;
  font-size: 20px;
  font-family: inherit;
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 8px 0;
}
.mobile-nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 4px 0 2px;
}
.mobile-nav-socials {
  margin-top: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
.mobile-nav-socials .site-social-link {
  width: 40px;
  height: 40px;
  overflow: hidden;
}
.mobile-nav-socials .site-social-link img {
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: contain;
  transform: none;
}

.pill {
  border: 0;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 14px;
  font-weight: 500;
  background: var(--bc-tertiary);
  color: var(--bc-tertiary-contrast);
}

.quick-service-static-announcement { background: var(--bc-surface-dark-alt); color: var(--bc-text-inverse); text-align: center; padding: 22px 28px; font-size: 16px; line-height: 1.45; }
.quick-service-static-announcement-text { display: block; width: 700px; max-width: 100%; margin: 0 auto; }

.split-banner { border-top: 2px solid var(--bc-border); }
.quick-service-details-section,
.quick-service-hours-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}
.split-banner-wrap { display: grid; grid-template-columns: 1fr 1fr; }
.split-banner-text { background: inherit; padding: clamp(30px, 4.2vw, 58px); }
.split-banner-image img { width: 100%; height: 100%; min-height: 420px; object-fit: cover; display: block; }

.split-banner-heading {
  margin: 0 0 var(--split-section-heading-content-gap);
  font-family: var(--font--heading-bold--family);
  font-weight: 700;
  line-height: 1.08;
  font-size: clamp(28px, 3.4vw, 44px);
  letter-spacing: 0.01em;
}
.split-banner-text > :not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):first-of-type {
  margin-top: 0;
  padding-top: 0;
}

.quick-service-detail-group { margin: 0 0 26px; padding-bottom: 20px; border-bottom: 1px solid rgba(55, 55, 55, 0.14); }
.quick-service-detail-group:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: 0; }
.quick-service-detail-label { margin: 0 0 10px; font-size: 16px; font-weight: 600; line-height: 1.2; letter-spacing: 0.03em; }
.quick-service-detail-value { margin: 0 0 10px; font-size: 16px; line-height: 1.5; }
.quick-service-detail-ctas { margin: 0; display: flex; flex-wrap: wrap; gap: 24px; }
.quick-service-detail-cta {
  display: inline-block;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-decoration: underline;
  text-underline-offset: 0.12em;
  border-bottom: 0;
  padding-bottom: 0;
  line-height: 1.2;
  color: inherit;
  transition: opacity .2s ease, text-decoration-color .2s ease;
}
.quick-service-detail-cta:hover,
.quick-service-detail-cta:focus-visible {
  opacity: .75;
  text-decoration: none;
}

.quick-service-hours-row { margin: 0; padding: 13px 0; border-bottom: 1px solid rgba(55, 55, 55, 0.14); display: flex; justify-content: space-between; gap: 20px; }
.quick-service-hours-day, .quick-service-hours-time { font-size: 16px; line-height: 1.5; }
.quick-service-hours-row-active .quick-service-hours-day, .quick-service-hours-row-active .quick-service-hours-time { font-weight: 700; }
.quick-service-hours-list { margin: 0 0 28px; }
.quick-service-hours-note { margin: 0 !important; padding: 0 !important; font-size: 16px; line-height: 1.5; }

.quick-service-offerings-section {
  background: #fff;
  border-top: 2px solid #111;
  margin: 0;
  padding: 0;
}
.quick-service-offerings-header {
  background: inherit;
  padding: clamp(30px, 4.2vw, 58px) clamp(30px, 4.2vw, 58px) 0;
}
.quick-service-offerings-main-heading {
  margin: 0 0 var(--section-heading-content-gap);
  text-align: center;
}
.quick-service-offerings-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
}
.quick-service-offerings-list-panel {
  background: inherit;
  padding: 0 clamp(30px, 4.2vw, 58px) clamp(30px, 4.2vw, 58px);
}
.quick-service-offerings-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 16px;
}
.quick-service-offerings-list li {
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: start;
  gap: 12px;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: 0;
}
.quick-service-offerings-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-color: #373737;
  transform: translateY(2px);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}
.quick-service-offerings-icon-check {
  -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="black" d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 96C196.3 96 96 196.3 96 320C96 443.7 196.3 544 320 544C443.7 544 544 443.7 544 320C544 196.3 443.7 96 320 96zM403.1 230.6C408.3 223.5 418.3 221.9 425.4 227.1C432.5 232.3 434.1 242.3 428.9 249.4L300.9 425.4C298.1 429.2 293.9 431.6 289.2 431.9C284.5 432.2 279.9 430.6 276.6 427.3L212.6 363.3C206.4 357.1 206.4 346.9 212.6 340.7C218.8 334.5 229 334.5 235.2 340.7L285.9 391.4L402.9 230.6z"/></svg>') no-repeat center / contain;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="black" d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 96C196.3 96 96 196.3 96 320C96 443.7 196.3 544 320 544C443.7 544 544 443.7 544 320C544 196.3 443.7 96 320 96zM403.1 230.6C408.3 223.5 418.3 221.9 425.4 227.1C432.5 232.3 434.1 242.3 428.9 249.4L300.9 425.4C298.1 429.2 293.9 431.6 289.2 431.9C284.5 432.2 279.9 430.6 276.6 427.3L212.6 363.3C206.4 357.1 206.4 346.9 212.6 340.7C218.8 334.5 229 334.5 235.2 340.7L285.9 391.4L402.9 230.6z"/></svg>') no-repeat center / contain;
}
.quick-service-offerings-icon-x {
  -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="black" d="M320 96C443.7 96 544 196.3 544 320C544 443.7 443.7 544 320 544C196.3 544 96 443.7 96 320C96 196.3 196.3 96 320 96zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM228.7 228.7C222.5 234.9 222.5 245.1 228.7 251.3L297.4 320L228.7 388.7C222.5 394.9 222.5 405.1 228.7 411.3C234.9 417.5 245.1 417.5 251.3 411.3L320 342.6L388.7 411.3C394.9 417.5 405.1 417.5 411.3 411.3C417.5 405.1 417.5 394.9 411.3 388.7L342.6 320L411.3 251.3C417.5 245.1 417.5 234.9 411.3 228.7C405.1 222.5 394.9 222.5 388.7 228.7L320 297.4L251.3 228.7C245.1 222.5 234.9 222.5 228.7 228.7z"/></svg>') no-repeat center / contain;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="black" d="M320 96C443.7 96 544 196.3 544 320C544 443.7 443.7 544 320 544C196.3 544 96 443.7 96 320C96 196.3 196.3 96 320 96zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM228.7 228.7C222.5 234.9 222.5 245.1 228.7 251.3L297.4 320L228.7 388.7C222.5 394.9 222.5 405.1 228.7 411.3C234.9 417.5 245.1 417.5 251.3 411.3L320 342.6L388.7 411.3C394.9 417.5 405.1 417.5 411.3 411.3C417.5 405.1 417.5 394.9 411.3 388.7L342.6 320L411.3 251.3C417.5 245.1 417.5 234.9 411.3 228.7C405.1 222.5 394.9 222.5 388.7 228.7L320 297.4L251.3 228.7C245.1 222.5 234.9 222.5 228.7 228.7z"/></svg>') no-repeat center / contain;
}
.quick-service-offerings-image-panel {
  background: inherit;
  padding: 0 clamp(30px, 4.2vw, 58px) clamp(30px, 4.2vw, 58px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.quick-service-offerings-image-panel img {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 0;
  margin: 0 auto;
}

.quick-service-about-section {
  background: #fff;
  border-top: 2px solid #111;
}
.quick-service-about-wrap {
  width: min(1200px, calc(100% - 96px));
  margin: 0 auto;
  padding: 52px 0;
}
.quick-service-about-text {
  padding: 0;
}
.quick-service-about-heading {
  margin: 0 0 var(--section-heading-content-gap);
  text-align: center;
}
.quick-service-about-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
.quick-service-about-text p {
  margin: 0 0 20px;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
}
.quick-service-about-text p:last-child {
  margin-bottom: 0;
}
.quick-service-about-image {
  padding: 0;
}
.quick-service-about-image img {
  width: 100%;
  max-width: 100%;
  display: block;
  height: auto;
  border-radius: 0;
  margin: 0 auto;
}

.quick-service-featured-section {
  background: #fff;
  border-top: 2px solid #111;
}
.quick-service-featured-grid {
  display: grid;
  grid-template-columns: .75fr 1fr 1fr 1fr;
}
.quick-service-featured-title-card {
  background: var(--bc-primary);
  border-right: 2px solid var(--bc-border);
  border-bottom: 2px solid var(--bc-border);
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;
}
.quick-service-featured-title {
  margin: 0;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-align: center;
}
.quick-service-featured-item-card {
  border-bottom: 2px solid #111;
  border-right: 2px solid #111;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.quick-service-featured-item-card:last-child {
  border-right: 0;
}
.quick-service-featured-item-card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.quick-service-featured-copy {
  padding: 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 200px;
}
.quick-service-featured-copy h3 {
  margin: 0 0 10px;
  font-size: 20px;
  line-height: 1.12;
  font-weight: 700;
}
.quick-service-featured-copy p {
  margin: 0 0 12px;
  font-size: 16px;
  line-height: 1.5;
}
.quick-service-featured-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  white-space: nowrap;
  background: var(--bc-white);
  color: black;
  text-decoration: none;
  font-size: 16px;
  line-height: 1;
  font-weight: 400;
  border: 2px solid var(--bc-border);
  box-shadow: 4px 4px 0 black;  transition: background-color .2s ease, transform .12s ease, box-shadow .12s ease;
  margin-top: auto;
}
.quick-service-featured-cta:hover,
.quick-service-featured-cta:focus-visible {
  background: var(--bc-primary);
  transform: translate3d(4px, 4px, 0);
  box-shadow: 0 0 0 #111;
}

.quick-service-reviews-section {
  background: inherit;
}
.quick-service-reviews-wrap {
  width: min(1200px, calc(100% - 96px));
  margin: 0 auto;
  padding: 52px 0;
}
.quick-service-reviews-heading {
  margin: 0 0 var(--section-heading-content-gap);
  text-align: center;
}
.quick-service-reviews-summary {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 18px;
  line-height: 1.2;
}
.quick-service-reviews-score,
.quick-service-reviews-label {
  font-size: inherit;
  line-height: inherit;
  font-weight: 600;
}
.quick-service-reviews-stars {
  color: currentColor;
  letter-spacing: 0.03em;
  font-size: 18px;
  line-height: 1;
}
.quick-service-reviews-divider {
  color: currentColor;
  opacity: 0.5;
}
.quick-service-reviews-count {
  font-weight: 400;
}
.quick-service-reviews-recent {
  margin: 18px 0 22px;
  text-align: center;
  font-size: inherit;
  line-height: 1.2;
  font-weight: 500;
}
.quick-service-reviews-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-left: 2px solid #111;
  border-top: 2px solid #111;
}
.quick-service-review-card {
  background: inherit;
  border-right: 2px solid #111;
  border-bottom: 2px solid #111;
  padding: 22px;
  min-height: auto;
}
.quick-service-review-head {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}
.quick-service-review-head h3 {
  margin: 0;
  font-size: 18px;
  line-height: 1.1;
  font-weight: 500;
}
.quick-service-review-rating {
  margin: 0 0 12px;
  font-size: 16px;
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.quick-service-review-text {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

@media (max-width: 1100px) {
  :root {
    --section-heading-content-gap: 24px;
    --split-section-heading-content-gap: 24px;
  }

  .quick-service-about-text { order: 1; }
  .quick-service-about-image { order: 2; }
  .quick-service-about-wrap {
    width: calc(100% - 44px);
    padding: 36px 0;
  }

  .quick-service-featured-grid {
    grid-template-columns: 1fr 1fr;
  }
  .quick-service-featured-title-card,
  .quick-service-featured-item-card {
    border-right: 2px solid #111;
  }
  .quick-service-featured-item-card:nth-child(2n) {
    border-right: 0;
  }
  .quick-service-featured-title-card {
    min-height: 220px;
  }
  .quick-service-featured-copy {
    min-height: 220px;
  }

  .quick-service-reviews-wrap {
    width: calc(100% - 44px);
    padding: 36px 0;
  }
  .quick-service-reviews-recent {
    font-size: inherit;
    text-align: left;
  }
  .quick-service-reviews-summary {
    justify-content: flex-start;
    text-align: left;
  }
}

.quick-service-events-section {
  border-top: 2px solid var(--bc-border);
  border-bottom: 2px solid var(--bc-border);
  background: var(--bc-white);
}
.quick-service-events-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 560px;
}

.quick-service-events-list {
  margin: 0 0 28px;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}
.quick-service-events-list li {
  font-size: 18px;
  line-height: 1.35;
}
.quick-service-events-list li::before {
  content: "+ ";
  font-weight: 700;
}
.quick-service-events-cta {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 18px;
  background: var(--bc-white);
  color: var(--bc-text);
  text-decoration: none;
  font-size: 16px;
  line-height: 1;
  font-weight: 400;
  border: 2px solid var(--bc-border);
  box-shadow: 4px 4px 0 black;  transition: background-color .2s ease, transform .12s ease, box-shadow .12s ease;
}
.quick-service-events-cta:hover,
.quick-service-events-cta:focus-visible {
  background: var(--colors-palette-primary, var(--colors-palette-primary));
  color: var(--colors-palette-primary-contrast, var(--colors-palette-primary-contrast));
  transform: translate3d(4px, 4px, 0);
  box-shadow: none;
  border-color: #000;
}
.quick-service-events-image {
  order: 1;
  padding: clamp(24px, 3vw, 46px);
}
.quick-service-events-image img {
  width: 100%;
  height: 100%;
  min-height: 460px;
  object-fit: cover;
  display: block;
}

.quick-service-faq-section {
  background: var(--bc-white);
  border-bottom: 2px solid var(--bc-border);
}
.quick-service-faq-wrap {
  width: min(980px, calc(100% - 56px));
  margin: 0 auto;
  padding: 34px 0 40px;
}
.quick-service-faq-heading {
  margin: 0 0 var(--section-heading-content-gap);
  text-align: center;
}
.quick-service-faq-item {
  border: 2px solid var(--bc-border);
  background: var(--bc-white);
  margin: 0 auto 16px;
  max-width: 920px;
}
.quick-service-faq-trigger {
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  padding: clamp(14px, 1.4vw, 18px) clamp(16px, 2vw, 26px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  text-align: left;
}
.quick-service-faq-label {
  display: flex;
  align-items: center;
  font-size: clamp(16px, 1.5vw, 20px);
  line-height: 1;
  text-transform: none;
  margin: 0;
}
.quick-service-faq-icon {
  width: 22px;
  height: 22px;
  position: relative;
  flex: 0 0 auto;
}
.quick-service-faq-icon::before,
.quick-service-faq-icon::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: #474747;
  transform: translateY(-50%);
}
.quick-service-faq-icon::after {
  transform: translateY(-50%) rotate(90deg);
}
.quick-service-faq-item.is-open .quick-service-faq-icon::after {
  display: none;
}
.quick-service-faq-panel {
  display: grid;
  grid-template-rows: 0fr;
  padding: 0 clamp(16px, 2vw, 26px) 0;
  max-width: 100%;
  overflow: hidden;
  opacity: 0;
  transition: grid-template-rows .32s cubic-bezier(.22, .61, .36, 1), opacity .24s ease;
}
.quick-service-faq-item.is-open .quick-service-faq-panel {
  grid-template-rows: 1fr;
  opacity: 1;
  padding-bottom: clamp(14px, 1.4vw, 18px);
}
.quick-service-faq-panel-inner {
  min-height: 0;
  overflow: hidden;
}
.quick-service-faq-panel p {
  margin: 0 0 14px;
  font-size: 16px;
  line-height: 1.6;
}
.quick-service-faq-panel p:last-child {
  margin-bottom: 0;
}

.quick-service-events-alt-section {
  border-bottom: 2px solid var(--bc-border);
  background: var(--bc-white);
}
.quick-service-events-alt-header {
  width: min(1200px, calc(100% - 96px));
  margin: 0 auto;
  padding: 34px 0 0;
}
.quick-service-events-alt-heading {
  margin: 0 0 var(--split-section-heading-content-gap);
  text-align: center;
}
.quick-service-events-alt-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  min-height: 560px;
}
.quick-service-events-alt-image {
  padding: 0 clamp(24px, 3vw, 46px) clamp(24px, 3vw, 46px);
}
.quick-service-events-alt-map {
  width: 100%;
  height: 100%;
  min-height: 460px;
  display: block;
  border: 0;
  border: 2px solid var(--bc-border);
}
.quick-service-events-alt-copy {
  padding: 0 clamp(34px, 4vw, 64px) clamp(34px, 4vw, 64px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.quick-service-events-alt-copy > :not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):first-of-type {
  margin-top: 0;
  padding-top: 0;
}
.quick-service-events-alt-copy p {
  margin: 0 0 22px;
  font-size: 20px;
  line-height: 1.45;
}
.quick-service-location-list {
  margin: 0;
}
.quick-service-location-item {
  padding: 16px 0;
  margin: 0;
  border-bottom: 1px solid #111;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.quick-service-location-item:first-child {
  padding-top: 0;
}
.quick-service-location-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}
.quick-service-location-item h3 {
  margin: 0;
  font-size: 20px;
  line-height: 1.25;
  font-weight: 600;
}
.quick-service-location-item p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}
.quick-service-location-link {
  display: inline-block;
  margin: 0;
  align-self: flex-start;
}

@media (min-width: 1101px) {
  .quick-service-details-flipped-section .split-banner-image { order: 1; }
  .quick-service-details-flipped-section .split-banner-text { order: 2; }
}

@media (max-width: 1100px) {
  .mobile-nav {
    backdrop-filter: none;
  }

  .menu-toggle {
    display: inline-flex;
    position: absolute;
    left: 28px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }
  .site-header-left,
  .site-header-right {
    display: none;
  }
  .site-header-center {
    width: 100%;
    text-align: center;
    padding: 0 52px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .site-brand {
    font-size: 18px;
    line-height: 1.05;
    display: inline-block;
    max-width: 100%;
    white-space: normal;
    text-wrap: balance;
    overflow-wrap: anywhere;
  }
  .site-brand .site-brand-line {
    white-space: normal;
    text-wrap: balance;
    overflow-wrap: anywhere;
  }
  .site-brand-measure {
    font-size: 18px;
    line-height: 1.05;
  }
  .site-brand-line--secondary {
    margin-top: 4px;
  }



  .split-banner-wrap { grid-template-columns: 1fr; }
  .split-banner-text { padding: 30px 22px; }
  .split-banner-image img { min-height: 320px; max-height: 440px; }
  .quick-service-offerings-wrap { grid-template-columns: 1fr; }
  .quick-service-offerings-image-panel {
    margin: 0;
    padding: 0 22px 30px;
  }
  .quick-service-events-grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .quick-service-events-copy {
    order: 1;
    border-left: 0;
    border-right: 0;
    border-bottom: 2px solid #111;
    padding: 34px 24px;
  }
  .quick-service-events-copy h2 {
    font-size: clamp(24px, 6vw, 38px);
    line-height: 1.2;
  }
  .quick-service-events-copy p {
    font-size: 18px;
  }
  .quick-service-events-list li {
    font-size: 16px;
  }
  .quick-service-events-image {
    order: 2;
    padding: 24px;
  }
  .quick-service-events-image img {
    min-height: 360px;
  }

  .quick-service-faq-wrap {
    width: calc(100% - 40px);
    padding: 28px 0 34px;
  }
  .quick-service-faq-heading {
    margin-bottom: var(--section-heading-content-gap);
  }
  .quick-service-faq-label {
    font-size: 16px;
  }
  .quick-service-faq-panel p {
    font-size: 16px;
  }

  .quick-service-events-alt-grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .quick-service-events-alt-header {
    width: calc(100% - 44px);
    padding-top: 30px;
  }
  .quick-service-events-alt-copy {
    order: 1;
    border-left: 0;
    border-bottom: 0;
    padding: 0 24px 34px;
  }
  .quick-service-events-alt-image {
    order: 2;
    padding: 24px;
  }
  .quick-service-events-alt-map {
    min-height: 360px;
  }
  .quick-service-events-alt-copy p {
    font-size: 18px;
  }
  .quick-service-location-item h3 { font-size: 20px; }
}

@media (max-width: 700px) {
  .site-header-inner { padding: 10px 14px; }
  .menu-toggle { left: 14px; }
  .site-header-center { padding: 0 42px; }
  .site-brand { font-size: 18px; }
  .site-brand-measure { font-size: 18px; }
  .site-brand-line--secondary {
    font-size: inherit;
    margin-top: 3px;
  }
  .mobile-nav-inner { padding: 10px 14px 28px; }
  .mobile-nav-brand {
    font-size: 18px;
    max-width: none;
    padding-inline: 0;
  }
  .mobile-nav-inner a { font-size: 18px; }



  .quick-service-offerings-header {
    padding: 30px 16px 0;
  }
  .split-banner-text { padding: 30px 16px; }
  .quick-service-offerings-list-panel,
  .quick-service-offerings-image-panel { padding: 0; }
  .quick-service-offerings-list-panel { padding: 0 16px 30px; }
  .quick-service-offerings-image-panel {
    margin: 0;
    padding: 0 16px 30px;
  }
  .quick-service-about-wrap {
    width: calc(100% - 32px);
    padding: 30px 0;
  }
  .quick-service-offerings-image-panel img,
  .quick-service-about-image img { max-width: 100%; }

  .quick-service-featured-grid {
    grid-template-columns: 1fr;
  }
  .quick-service-featured-title-card,
  .quick-service-featured-item-card {
    border-right: 0;
  }
  .quick-service-featured-copy {
    padding: 16px;
    min-height: auto;
  }
  .quick-service-featured-copy h3 {
    font-size: 24px;
  }
  .quick-service-featured-cta {
    margin-top: 12px;
  }

  .quick-service-reviews-wrap {
    width: calc(100% - 32px);
    padding: 30px 0;
  }
  .quick-service-reviews-summary {
    gap: 6px;
    font-size: 16px;
    flex-wrap: wrap;
    justify-content: flex-start;
    text-align: left;
  }
  .quick-service-reviews-stars {
    font-size: 16px;
  }
  .quick-service-reviews-recent {
    font-size: inherit;
    margin: 14px 0 18px;
    text-align: left;
  }
  .quick-service-reviews-grid {
    grid-template-columns: 1fr;
  }
  .quick-service-review-card {
    min-height: auto;
    padding: 18px 16px;
  }
  .quick-service-review-head h3 {
    font-size: 18px;
  }

  .quick-service-events-copy {
    padding: 30px 16px;
  }
  .quick-service-events-copy h2 {
    font-size: clamp(22px, 8vw, 34px);
    line-height: 1.22;
  }
  .quick-service-events-copy p {
    font-size: 16px;
  }
  .quick-service-events-list li {
    font-size: 16px;
  }
  .quick-service-events-cta {
    min-height: 46px;
    font-size: 16px;
    padding: 0 14px;
  }
  .quick-service-events-image {
    padding: 16px;
  }
  .quick-service-events-image img {
    min-height: 280px;
  }

  .quick-service-faq-wrap {
    width: calc(100% - 24px);
    padding: 20px 0 24px;
  }
  .quick-service-faq-heading {
    margin-bottom: 24px;
  }
  .quick-service-faq-item {
    margin-bottom: 10px;
  }
  .quick-service-faq-trigger {
    padding: 16px 14px;
  }
  .quick-service-faq-label {
    font-size: 16px;
  }
  .quick-service-faq-icon {
    width: 20px;
    height: 20px;
  }
  .quick-service-faq-icon::before,
  .quick-service-faq-icon::after {
    height: 2px;
  }
  .quick-service-faq-panel {
    padding: 0 12px 0;
  }
  .quick-service-faq-item.is-open .quick-service-faq-panel {
    padding-bottom: 16px;
  }
  .quick-service-faq-panel p {
    font-size: 16px;
    line-height: 1.6;
  }

  .quick-service-events-alt-copy {
    padding: 0 16px 30px;
  }
  .quick-service-events-alt-header {
    width: calc(100% - 32px);
    padding-top: 24px;
  }
  .quick-service-events-alt-copy p {
    font-size: 16px;
  }
  .quick-service-location-item { padding: 12px 0; }
  .quick-service-location-item:first-child { padding-top: 0; }
  .quick-service-location-item h3 { font-size: 18px; }
  .quick-service-location-item { gap: 6px; }
  .quick-service-events-alt-image {
    padding: 16px;
  }
  .quick-service-events-alt-map {
    min-height: 280px;
  }
}

.quick-service-footer-light {
  background: #fff;
  padding: 18px 28px 20px;
}
.quick-service-footer-top {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  font-size: 14px;
}
.quick-service-footer-social,
.quick-service-footer-links,
.quick-service-footer-legal {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.quick-service-footer-links {
  justify-content: center;
  width: 100%;
}
.quick-service-footer-light a {
  color: #373737;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.03em;
  text-decoration: underline;
  text-underline-offset: 0.12em;
  transition: opacity .2s ease, text-decoration-color .2s ease;
}
.quick-service-footer-light a:hover,
.quick-service-footer-light a:focus-visible {
  opacity: .75;
  text-decoration: none;
}
.quick-service-footer-copy {
  margin: 0;
  white-space: nowrap;
}
.quick-service-footer-logo {
  margin: 64px 0 56px;
  text-align: center;
  font-size: clamp(32px, 4.8vw, 56px);
  line-height: 1;
  font-weight: 500;
  letter-spacing: 0.01em;
}
.quick-service-footer-bottom {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 24px;
}
.quick-service-footer-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
  flex-wrap: wrap;
}
.quick-service-footer-bottom > .quick-service-footer-social {
  justify-content: flex-start;
}
.quick-service-footer-bottom > .quick-service-footer-copy {
  text-align: center;
}
.quick-service-footer-app-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.quick-service-footer-app-badges a {
  display: inline-flex;
  opacity: 0.9;
  transition: opacity .2s ease;
}
.quick-service-footer-app-badges a:hover,
.quick-service-footer-app-badges a:focus-visible {
  opacity: 1;
}
.quick-service-footer-app-badges img {
  width: 132px;
  height: 40px;
  object-fit: contain;
  display: block;
}
.quick-service-footer-legal {
  justify-content: flex-end;
  font-size: 14px;
  letter-spacing: 0.02em;
}

@media (max-width: 1100px) {
  .quick-service-footer-light {
    padding: 16px;
  }
  .quick-service-footer-top {
    font-size: 14px;
    grid-template-columns: 1fr;
    justify-items: start;
    text-align: left;
  }
  .quick-service-footer-legal { font-size: 14px; }
  .quick-service-footer-copy {
    white-space: normal;
  }
  .quick-service-footer-logo {
    margin: 34px 0 30px;
    font-size: clamp(26px, 7vw, 40px);
    font-weight: 500;
    text-align: left;
  }
  .quick-service-footer-bottom {
    grid-template-columns: 1fr;
    justify-items: start;
    text-align: left;
  }
  .quick-service-footer-meta {
    align-items: flex-start;
    gap: 12px;
  }
  .quick-service-footer-social,
  .quick-service-footer-links,
  .quick-service-footer-legal {
    gap: 12px;
    justify-content: flex-start;
  }
  .quick-service-footer-app-badges {
    justify-content: flex-start;
  }
  .quick-service-footer-legal { justify-content: flex-start; }
}

@media (max-width: 700px) {
}

/* Heading alignment hierarchy */
/* Desktop: offerings left, about centered */
.quick-service-offerings-main-heading {
  text-align: left;
}

.quick-service-about-heading {
  text-align: center;
}

/* Tablet + Mobile: all major section headings left */
@media (max-width: 1023px) {
  .split-banner-heading,
  .quick-service-offerings-main-heading,
  .quick-service-about-heading,
  .quick-service-featured-title,
  .quick-service-reviews-heading,
  .quick-service-faq-heading,
  .quick-service-events-alt-heading {
    text-align: left;
  }
}

.quick-service-map-placeholder {
  display: grid;
  place-items: center;
  padding: clamp(24px, 3vw, 46px);
  border: 2px solid var(--bc-border);
  box-shadow: inset 0 0 0 1px rgba(17, 17, 17, 0.08);
  background:
    linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,250,250,0.94) 100%),
    repeating-linear-gradient(
      0deg,
      rgba(17,17,17,0.12),
      rgba(17,17,17,0.12) 1px,
      transparent 1px,
      transparent 32px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(17,17,17,0.12),
      rgba(17,17,17,0.12) 1px,
      transparent 1px,
      transparent 32px
    );
}

.quick-service-map-placeholder span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--bc-text);
}`;

const textValue = (value: unknown) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }

  return "";
};

const resolveStyledTextStyles = (
  styles: StyledTextValue | undefined,
): React.CSSProperties => ({
  fontFamily: styles?.fontFamily === "default" ? undefined : styles?.fontFamily,
  fontSize: styles?.fontSize === "default" ? undefined : styles?.fontSize,
  fontWeight: styles?.fontWeight === "default" ? undefined : styles?.fontWeight,
  fontStyle: styles?.fontStyle === "default" ? undefined : styles?.fontStyle,
  textTransform:
    styles?.textTransform === "default" ? undefined : styles?.textTransform,
});

const getFirstPartyReviewsAggregate = (streamDocument: any) => {
  const aggregates = streamDocument?.ref_reviewsAgg;
  if (!Array.isArray(aggregates)) return null;

  const match = aggregates.find((item) => {
    return (
      item &&
      typeof item === "object" &&
      (item as Record<string, unknown>).publisher === REVIEW_PUBLISHER_VALUE
    );
  });

  return match && typeof match === "object"
    ? (match as Record<string, unknown>)
    : null;
};

const formatReviewDate = (value: unknown) => {
  if (value == null) return "";

  const date =
    typeof value === "number"
      ? new Date(value)
      : typeof value === "string" && value.trim().length > 0
        ? new Date(value)
        : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${month}/${day}/${year}`;
};

const getFirstPartyTopReviews = (streamDocument: any) => {
  const firstPartyAggregate = getFirstPartyReviewsAggregate(streamDocument);
  const aggregateTopReviews = firstPartyAggregate?.topReviews;
  const topReviews = Array.isArray(aggregateTopReviews)
    ? aggregateTopReviews
    : [];

  return topReviews
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const content = textValue(record.content);
      if (!content) {
        return null;
      }

      return {
        authorName: textValue(record.authorName),
        rating: textValue(record.rating),
        reviewDate: formatReviewDate(record.reviewDate),
        content,
      } satisfies FirstPartyReview;
    })
    .filter((item): item is FirstPartyReview => Boolean(item))
    .slice(0, 4);
};

const headingFields: YextFields<QuickServiceReviewsProps["heading"]> = {
  text: {
    label: "Text",
    type: "entityField",
    filter: { types: ["type.string"] },
  },
  styles: {
    label: "Text Styles",
    type: "styledText",
  },
  fontColor: {
    label: "Font Color",
    type: "basicSelector",
    options: "SITE_COLOR",
  },
};

const sectionFields: YextFields<QuickServiceReviewsProps["section"]> = {
  visibleOnLivePage: {
    label: "Visible on Live Page",
    type: "radio",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  backgroundColor: {
    label: "Background Color",
    type: "basicSelector",
    options: "BACKGROUND_COLOR",
  },
  cardBackgroundColor: {
    label: "Card Background Fill",
    type: "basicSelector",
    options: "BACKGROUND_COLOR",
  },
};

const fields: YextFields<QuickServiceReviewsProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: sectionFields,
  },
  heading: {
    label: "Heading",
    type: "object",
    objectFields: headingFields,
  },
  content: {
    label: "Content",
    type: "object",
    objectFields: {
      styles: {
        label: "Text Styles",
        type: "styledText",
      },
      fontColor: {
        label: "Font Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
};

const QuickServiceReviewsComponent: PuckComponent<QuickServiceReviewsProps> = (
  props,
) => {
  const streamDocument = useDocument<any>();
  const locale = streamDocument?.locale ?? "en";
  const isEditing = Boolean(props.puck?.isEditing);
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
  );
  const cardSurfaceStyle = getSurfaceColorStyle(
    props.section.cardBackgroundColor,
    streamDocument,
  );
  const headingStyles = resolveStyledTextStyles(props.heading.styles);
  const headingColor = getThemeColorCssValue(props.heading.fontColor);
  const contentStyles = resolveStyledTextStyles(props.content.styles);
  const contentColor = getThemeColorCssValue(props.content.fontColor);
  const textStyle: React.CSSProperties = {
    ...contentStyles,
    ...(contentColor ? { color: contentColor } : {}),
  };
  const cardTextStyle: React.CSSProperties = {
    ...contentStyles,
    ...(contentColor ? { color: contentColor } : {}),
  };
  const resolvedHeadingText = textValue(
    resolveComponentData(props.heading.text, locale, streamDocument),
  );
  const { averageRating, reviewCount } = getAggregateRating(streamDocument);
  const entityReviews = getFirstPartyTopReviews(streamDocument);
  const hasReviews = entityReviews.length > 0;
  if (!hasReviews && !isEditing) {
    return <></>;
  }

  const rating = hasReviews
    ? averageRating > 0
      ? averageRating.toFixed(1)
      : ""
    : isEditing
      ? "4.5"
      : "";
  const reviewCountValue = hasReviews
    ? reviewCount > 0
      ? String(reviewCount)
      : ""
    : isEditing
      ? "2"
      : "";
  const hasRating = rating.length > 0;
  const hasReviewCount = reviewCountValue.length > 0;
  const reviews = hasReviews ? entityReviews : sampleReviews;
  const helperText = "Recent Reviews:";

  return (
    <AnalyticsScopeProvider
      name={`QuickServiceReviews${getAnalyticsScopeHash(props.id)}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <>
          <style>{QuickServiceReviewsStyles}</style>
          <Background
            as="section"
            background={props.section.backgroundColor}
            className="quick-service-reviews-section"
            aria-label="Reviews"
            style={{
              ...sectionSurfaceStyle,
            }}
          >
            <div className="quick-service-reviews-wrap">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
              <h2
                className="split-banner-heading quick-service-reviews-heading"
                style={{
                  ...headingStyles,
                  ...(headingColor ? { color: headingColor } : {}),
                }}
              >
                {resolvedHeadingText}
              </h2>
              </EntityField>
              {hasRating || hasReviewCount ? (
                <p className="quick-service-reviews-summary" style={textStyle}>
                  {hasRating ? (
                    <ReviewStars
                      averageRating={Number(rating)}
                      reviewCount={
                        hasReviewCount ? Number(reviewCountValue) : undefined
                      }
                    />
                  ) : null}
                </p>
              ) : null}
              <p className="quick-service-reviews-recent" style={textStyle}>
                {helperText}
              </p>
              <div
                className="quick-service-reviews-grid"
                style={{
                  borderLeft: "2px solid currentColor",
                  borderTop: "2px solid currentColor",
                }}
              >
                {reviews.map((review, index) => {
                  const hasReviewRating = review.rating.trim().length > 0;
                  const hasReviewDate = review.reviewDate.trim().length > 0;

                  return (
                    <Background
                      as="div"
                      background={props.section.cardBackgroundColor}
                      key={`${review.authorName || "review"}-${index}`}
                      className="quick-service-review-card"
                      style={{
                        ...cardSurfaceStyle,
                        borderRight: "2px solid currentColor",
                        borderBottom: "2px solid currentColor",
                      }}
                    >
                      <div className="quick-service-review-head">
                        <h3 style={cardTextStyle}>{review.authorName}</h3>
                      </div>
                      {hasReviewRating || hasReviewDate ? (
                        <p
                          className="quick-service-review-rating"
                          style={cardTextStyle}
                        >
                          {hasReviewRating ? (
                            <ReviewStars
                              averageRating={Number(review.rating)}
                            />
                          ) : null}
                          {hasReviewRating && hasReviewDate ? (
                            <span style={{ margin: "0 6px" }}>|</span>
                          ) : null}
                          {hasReviewDate ? (
                            <span>{review.reviewDate}</span>
                          ) : null}
                        </p>
                      ) : null}
                      <p
                        className="quick-service-review-text"
                        style={cardTextStyle}
                      >
                        {review.content}
                      </p>
                    </Background>
                  );
                })}
              </div>
            </div>
          </Background>
        </>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

const defaultReviewsProps: QuickServiceReviewsProps = {
  section: {
    visibleOnLivePage: true,
    backgroundColor: {
      selectedColor: "white",
      contrastingColor: "black",
    },
    cardBackgroundColor: {
      selectedColor: "white",
      contrastingColor: "black",
    },
  },
  heading: {
    text: {
      field: "",
      constantValue: { defaultValue: "Reviews" },
      constantValueEnabled: true,
    },
    styles: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
    },
    fontColor: undefined,
  },
  content: {
    styles: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
    },
    fontColor: undefined,
  },
};

export const QuickServiceReviews: YextComponentConfig<QuickServiceReviewsProps> =
  {
    label: "Reviews",
    fields,
    defaultProps: defaultReviewsProps,
    render: (props) => <QuickServiceReviewsComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "QuickServiceReviews",
  displayName: "Reviews",
  description: "Reviews",
  pageSetTypes: ["ENTITY"],
};
