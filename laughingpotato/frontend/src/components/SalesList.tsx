import React, {lazy, useEffect, useState} from 'react';

import {Item} from 'semantic-ui-react';

const SaleRow = lazy(() => import('@sparkle/components/SaleRow'));

export interface SalesApiResponse {
  count: number;
  next: string;
  previous: string;
  results: Array<{
    slug: string;
    title: string;
    location: string;
    description: string;
    association: {
      shortname: string;
    };
  }>;
}

const SalesList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<SalesApiResponse | null>(null);

  useEffect(() => {
    fetch(`${process.env.LAUGHINGPOTATO_BASE_URL}/api/sales/`)
      .then((response) => response.json())
      .then((apiResponse: SalesApiResponse) => {
        setData(apiResponse);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  if (data.count === 0) {
    return (
      <>Aucune vente en cours.</>
    );
  }

  return (
    <Item.Group divided>
      {data.results.map((sale: any) => (
        <SaleRow
          key={sale.slug}
          title={sale.title}
          slug={sale.slug}
          association={sale.association}
          description={sale.description}
          startDate={sale.start_date}
        />
      ))}
    </Item.Group>
  );
};

export default SalesList;
