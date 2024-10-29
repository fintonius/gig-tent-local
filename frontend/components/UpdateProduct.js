import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import useForm from '../lib/useForm';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;

// destructuring variable 'id' from props.id that is being sent via
// via props in update.js when it invokes this component
export default function UpdateProduct({ id }) {
  // 1: We need to get the existing product
  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });

  // 2: we need to get the mutation to update the product
  const [
    updateProduct,
    // this is renaming the variables declared a few lines above. It is
    // destructuring the property into a new variable. Not sure why it can't
    // just destructure the property directly in to the new variable name?
    // In lesson 28 at about 12:00
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);
  //   2.5: Create some state for the form inputs
  // using destructuring to 'inputs' & 'handleChange'
  // from the useForm custom hook
  const { inputs, handleChange, clearForm, resetForm } = useForm(data?.Product);
  if (loading) return <p>Loading... </p>;
  // 3: We need the form to handle the updates
  return (
    <Form
      // this is a quick inline function that fires when the user clicks
      // the submit button
      //   TODO: Handle submit
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await updateProduct({
          variables: {
            id,
            name: inputs.name,
            description: inputs.description,
            price: inputs.price,
          },
        }).catch(console.error);
        console.log(res);
        //     // submit the input fields to the backend
        //     const res = await createProduct();
        //     clearForm();
        //     // go to the products page once it has been created
        //     Router.push({
        //       pathname: `/product/${res.data.createProduct.id}`,
        //     });
      }}
    >
      <DisplayError error={error || updateError} />
      <fieldset
        // the 'disabled' & 'aria-busy' properties are being triggered when
        // the page state is 'loading'. It means that all the form inputs will be
        // disabled so a user can't change any data after clicking submit and the
        // 'aria-busy' is triggering some CSS to make the orange loading bar move
        // so the user knows something is happening
        disabled={updateLoading}
        aria-busy={updateLoading}
      >
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Product</button>
      </fieldset>
    </Form>
  );
}
