import type { ShopProduct } from "@/lib/shop";

export function ProductSchema({
  product,
  url,
}: {
  product: ShopProduct;
  url: string;
}) {
  const json: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.blurb,
    url,
  };
  if (product.image) json.image = product.image;
  if (product.asin) json.sku = product.asin;

  const offer: any = {
    "@type": "Offer",
    url,
    availability: "https://schema.org/InStock",
  };
  const priceValue = product.price
    ? product.price.replace(/[^0-9.]/g, "")
    : undefined;
  if (priceValue) {
    offer.price = priceValue;
    offer.priceCurrency = "USD";
  }
  json.offers = offer;

  if (product.rating != null && product.reviewCount != null && product.reviewCount > 0) {
    json.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
