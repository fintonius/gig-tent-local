import SingleProduct from '../../components/SingleProduct';

// destructuring the query property from props
export default function SingleProductPage({ query }) {
  return <SingleProduct id={query.id} />;
}
