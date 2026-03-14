import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO = ({
  title = "APPAIETECH - 1000+ AI Tools in One Platform",
  description = "Access ChatGPT, Midjourney, Claude, Gemini & 1000+ AI tools with one subscription. Build $10,000 apps in 10 minutes.",
  image = "/og-image.png",
  url,
}: SEOProps) => {
  const fullTitle = title.includes("APPAIETECH") ? title : `${title} | APPAIETECH`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
