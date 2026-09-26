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

export const cargoData: CargoEntry[] = [
  {
    id: "factor-hunter-shirt",
    title: "Factor Hunter Official Tee",
    description: "High-quality cotton tee featuring the Ink on Parchment design. Forged for comfort.",
    price: "$24.99",
    image: "/assets/merch_shirt_factor.webp",
    actionUrl: "https://andys-dev-studio.printify.me/product/26691699",
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
