import CreateProduct from '../components/UpdateProduct';

// destructuring props.query into variable 'query'
export default function UpdatePage({ query }) {
  console.log(query);
  return (
    <div>
      <CreateProduct id={query.id} />
    </div>
  );
}
