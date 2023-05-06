export interface ApiItem {
  id: number;
  name: string;
  price: string;
  description: string;
  quantity?: number;
  id_weezpay?: number;
  members_only: boolean;
  max_quantity_per_order: number;
  min_quantity_per_order: number;
  max_quantity_per_user?: number;
}

export interface ApiItemCamelCase extends ApiItem {
  id: number;
  name: string;
  price: string;
  description: string;
  quantity?: number;
  idWeezpay?: number;
  membersOnly: boolean;
  maxQuantityPerOrder: number;
  minQuantityPerOrder: number;
  maxQuantityPerUser?: number;
}

export interface ApiAssociation {
  id: string;
  name: string;
  shortname: string;
  mail: string;
}

export interface ApiSale {
  association: ApiAssociation;
  description: string;
  item_set: ApiItem[];
  location: string;
  start_date: string;
  end_date: string;
  slug: string;
  title: string;
}

export interface ApiSaleCamelCase extends ApiSale {
  itemSet: ApiItemCamelCase[];
  startDate: string;
  endDate: string;
}
