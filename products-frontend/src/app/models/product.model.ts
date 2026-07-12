export interface Product {
  id: number;
  productCode: number;
  descriptive: string;
  quantity: number;
  unitPrice: number;
  vatPercentage: number | null;
}