export interface CargoEntry {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  actionUrl: string;
  buttonText: string;
  icon: string;
  type: string;
  projectPage?: string;
}

export interface FreebieAsset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  date: string;
  primaryImage: string;
  stencilImage?: string;
  downloadBundleUrl: string;
  driveFolderUrl: string;
  formats: {
    format: string;
    description: string;
    url: string;
    ext: string;
  }[];
  tags: string[];
  features: string[];
  license: string;
}

export interface UpcomingPackage {
  id: string;
  title: string;
  description: string;
  price: string;
  status: string;
  formats: string[];
}

export const freebiesData: FreebieAsset[] = [
  {
    id: 'bear0-cricut-cutout',
    title: 'Grizzly Bear Illustration & Cricut Cutout Pack',
    subtitle: 'Vector SVG, Cut-Ready Cricut Silhouette, Vector PDF & High-Res Woodcut Art',
    description: 'A dual-edition wildlife illustration bundle created for crafters, woodworkers, and laser cutting enthusiasts. Features both a clean, thick-path silhouette stencil optimized for vinyl and laser cutting without brittle pieces, and a high-detail woodcut line-art illustration framed by mountain pine trees.',
    category: 'Vector & Craft Stencils',
    date: 'October 17, 2026',
    primaryImage: '/assets/freebies/bear_detailed.jpg',
    stencilImage: '/assets/freebies/bear0_ads.png',
    downloadBundleUrl: '/assets/freebies/bear0_ads_bundle.zip',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1YhRrwpVc1RhrvKal8aJruCLTmqRw3rzQ?usp=drive_link',
    formats: [
      { format: 'ZIP Bundle', description: 'Complete pack with SVG, PNG, PDF, JPG & License', url: '/assets/freebies/bear0_ads_bundle.zip', ext: 'ZIP' },
      { format: 'SVG Vector', description: 'Clean scalable vector for Cricut, Silhouette, CNC & Glowforge', url: '/assets/freebies/bear0.svg', ext: 'SVG' },
      { format: 'PNG Stencil', description: '1008×1039 transparent silhouette cutout', url: '/assets/freebies/bear0_ads.png', ext: 'PNG' },
      { format: 'PDF Printable', description: 'Vector printable sheet for direct plotting & transfers', url: '/assets/freebies/bear0_ads.pdf', ext: 'PDF' },
      { format: 'JPG High-Res', description: '2752×1536 detailed woodcut illustration with pines', url: '/assets/freebies/bear_detailed.jpg', ext: 'JPG' }
    ],
    tags: ['Cricut', 'Laser Cutting', 'SVG', 'Vector', 'Woodworking', 'T-Shirts', 'Wildlife'],
    features: [
      'Continuous cut-friendly contours engineered for Cricut blades and vinyl weeding',
      'Vector SVG tested for laser cutters (Glowforge, xTool), CNC routers & plotters',
      'Includes high-resolution detailed woodcut artwork for sublimation & print',
      'Free for both Personal and Commercial crafted physical goods'
    ],
    license: 'Free Commercial & Personal Craft Use (Physical Goods)'
  }
];

export const upcomingPackagesData: UpcomingPackage[] = [
  {
    id: 'wildlife-pack-vol1',
    title: 'North American Apex Predators Vector Pack',
    description: 'A curated multi-format pack of 12 precision cutouts and woodcut illustrations: Wolves, Grizzlies, Bighorn Sheep, and Cougars. Engineered for multi-wood laser inlays and multi-color HTV vinyl.',
    price: 'Upcoming ($4.99)',
    status: 'In Development',
    formats: ['SVG', 'DXF', 'PNG', 'PDF']
  },
  {
    id: 'geometric-inlay-pack',
    title: 'Modular Lattice & Sacred Geometry Vector Set',
    description: 'Mathematical line-art and algorithmic geometry derived from Andy\'s number theory research. Designed for laser-etched coasters, CNC relief carving, and wall hangings.',
    price: 'Upcoming ($3.99)',
    status: 'In Development',
    formats: ['SVG', 'DXF', 'LightBurn', 'PDF']
  }
];

export const cargoData: CargoEntry[] = [
  {
    id: "factor-hunter-shirt",
    title: "Factor Hunter Official Tee",
    description: "High-quality cotton tee featuring the Ink on Parchment design. Forged for comfort.",
    price: "$24.99",
    image: "/assets/merch_shirt_factor.webp",
    actionUrl: "https://andysdevstudio.printify.me/product/26691699",
    buttonText: "VIEW GEAR",
    icon: "[+]",
    type: "Apparel"
  },
  {
    id: "eulers-cc-gear",
    title: "Euler's CC Collection",
    description: "Official Euler's CC apparel. The mathematics of the road, printed on high-quality fabric.",
    price: "$24.99",
    image: "/assets/graphite1_x9.webp",
    actionUrl: "https://andys-dev-studio.printify.me/product/26934153/eulers-identity-t-shirt-ei10-math-geek-tee",
    projectPage: "eulers-cc",
    buttonText: "VIEW STORE",
    icon: "[+]",
    type: "Apparel"
  }
];
