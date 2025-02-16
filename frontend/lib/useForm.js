import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our uinputs
  const [inputs, setInputs] = useState(initial);
  // the input we get via 'initial' will have several
  // properties which will need to be specified correctly to
  // access which is why 'setInputs' is looking for:
  //   {
  //     ...inputs,
  //     [e.target.name]: e.target.value,
  //   }
  // rather than: 'e.target.value' which is what we would be
  // accessing if we were targeting the user's keyboard strokes
  // directly. The properties on initial are something like:
  // {
  // name: 'Fintan',
  // description: 'some text',
  // price: 1000
  // }

  // THIS is solving the data loading error I encountered after
  // completing lesson 28 then spending a couple of hours trying to
  // solve... :| if only I'd just ploughed on :D
  // it's taking the uesEffect() solution I applied to the UpdateProduct
  // page and applying it here. Probably best to have it here at the
  // "root" of the problem so to speak. Means it will be solved every place
  // the form is located
  // the initial values from initial need to be given to a variable
  // to avoid causing an infinite loop from useEffect() updating initial
  // via 'setInputs(initial)' which trigger a change to initial causing
  // useEffect() to run again, triggering another change and on and on
  const initialValues = Object.values(initial).join('');
  useEffect(() => {
    // this function runs when the things we are watching change.
    // These things are in the []
    setInputs(initial);
  }, [initialValues]);

  function handleChange(e) {
    // destructuring 'value, name, type' from user input
    let { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    // this is to counteract some weird interactions when trying to
    // upload files. WS doesn't go into any description of what & why... lesson 22
    if (type === 'file') {
      // using destructuring to take the first item in the e.target.files array
      // and passing the item to 'value'. This relates to adding images to a
      // product when creating a new product. Discussed in 23 @ 7mins
      [value] = e.target.files;
    }
    setInputs({
      // copy the existing state
      ...inputs,
      //   this allows for dynamic naming of
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    // this clears all info from the form. 'Object.entries' creates an array of arrays
    // with each sub-array containing individual elements for a key: value pair from
    // the object it is given - in this case 'inputs'. It then uses 'map' to iterate over
    // the array destructuring to create variables 'key' & 'value' for the elements,
    // finally returning an array with the 'key' values the same and an empty string for
    // each value. Wrapping the whole thing in 'Object.fromEntries' transforms the array
    // back in to an object
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  // return the things we want to "surface", be able to access
  // I think, from this custom hook
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
