import React from 'react';
import { Container } from '@mui/material';
import FilterSortForm from './components/FilterSortForm';
import ProductTable from './components/ProductTable';
import useProducts from './hooks/useProducts';

const ListProductsPage: React.FC = () => {
  const { products, filters, setFilters, deleteProduct } = useProducts({ sortBy: '', search: '' });

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // We're duplicating code here because refactoring is beyond the scope of this exercise but realistically we could
  // move the deleteProduct function into the productTable. It was originally in here as a noop but I've added the ability to delete it because if you 
  // have a delete button on a page, it should do something or tell you why it isn't doing that thing.
  // the product list page probably shouldn't even have delete buttons on it at all, because it's a list product page not a manage product page...
  // but again, that's beyond scope right now.
  const handleDeleteProduct = (id: number) => {
    deleteProduct(id);
  };

  return (
    <Container>
      <FilterSortForm
        filter={filters}
        handleFilterChange={handleFilterChange}
      />
    <ProductTable
        products={products}
        handleDeleteProduct={handleDeleteProduct}
      />
    </Container>
  );
};

export default ListProductsPage;