import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
}

/**
 * Per-page SEO metadata. Renders <title>, <meta name="description">,
 * canonical URL, and OpenGraph/Twitter equivalents.
 */
const SEO = ({ title, description, canonical }: SEOProps) => {
  const url =
    canonical ||
    (typeof window !== "undefined"
      ? `https://www.sonoviewforyou.com${window.location.pathname}`
      : "https://www.sonoviewforyou.com/");

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
