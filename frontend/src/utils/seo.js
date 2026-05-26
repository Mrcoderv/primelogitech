/**
 * SEO Utility Functions
 * Handles meta tags, structured data, and SEO best practices
 */

export const setSeoMeta = (title, description, keywords = '', ogImage = '', ogUrl = '') => {
  // Set page title
  document.title = title;

  // Remove existing meta tags to avoid duplicates
  const existingMeta = document.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name="twitter:"], meta[name="keywords"]');
  existingMeta.forEach(tag => tag.remove());

  // Description meta tag
  const descMeta = document.createElement('meta');
  descMeta.name = 'description';
  descMeta.content = description;
  document.head.appendChild(descMeta);

  // Keywords meta tag
  if (keywords) {
    const keywordsMeta = document.createElement('meta');
    keywordsMeta.name = 'keywords';
    keywordsMeta.content = keywords;
    document.head.appendChild(keywordsMeta);
  }

  // Open Graph tags
  const ogTitle = document.createElement('meta');
  ogTitle.setAttribute('property', 'og:title');
  ogTitle.content = title;
  document.head.appendChild(ogTitle);

  const ogDesc = document.createElement('meta');
  ogDesc.setAttribute('property', 'og:description');
  ogDesc.content = description;
  document.head.appendChild(ogDesc);

  if (ogImage) {
    const ogImg = document.createElement('meta');
    ogImg.setAttribute('property', 'og:image');
    ogImg.content = ogImage;
    document.head.appendChild(ogImg);
  }

  if (ogUrl) {
    const ogUrlTag = document.createElement('meta');
    ogUrlTag.setAttribute('property', 'og:url');
    ogUrlTag.content = ogUrl;
    document.head.appendChild(ogUrlTag);
  }

  // Twitter Card tags
  const twitterCard = document.createElement('meta');
  twitterCard.name = 'twitter:card';
  twitterCard.content = 'summary_large_image';
  document.head.appendChild(twitterCard);

  const twitterTitle = document.createElement('meta');
  twitterTitle.name = 'twitter:title';
  twitterTitle.content = title;
  document.head.appendChild(twitterTitle);

  const twitterDesc = document.createElement('meta');
  twitterDesc.name = 'twitter:description';
  twitterDesc.content = description;
  document.head.appendChild(twitterDesc);

  if (ogImage) {
    const twitterImg = document.createElement('meta');
    twitterImg.name = 'twitter:image';
    twitterImg.content = ogImage;
    document.head.appendChild(twitterImg);
  }
};

export const setStructuredData = (data) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) existingScript.remove();

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

export const getOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Prime Logic Tech',
    description: 'Modern IT solutions and digital services for businesses',
    url: 'https://primelogitech.com',
    logo: 'https://primelogitech.com/primelogilogo.jpeg',
    sameAs: [
      'https://www.facebook.com/primelogitech',
      'https://www.twitter.com/primelogitech',
      'https://www.linkedin.com/company/primelogitech',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bhaktapur',
      addressRegion: 'Thimi',
      addressCountry: 'NP',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+977-1-234-5678',
      email: 'primelogictech3@gmail.com',
    },
  };
};

export const getBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const getLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Prime Logic Tech',
    image: 'https://primelogitech.com/primelogilogo.jpeg',
    description: 'Professional IT solutions and digital services',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bhaktapur, Thimi',
      addressLocality: 'Bhaktapur',
      addressRegion: 'Thimi',
      postalCode: '44800',
      addressCountry: 'NP',
    },
    telephone: '+977-1-234-5678',
    url: 'https://primelogitech.com',
    email: 'primelogictech3@gmail.com',
  };
};
