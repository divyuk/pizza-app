# Section 4 Thunk Function in the App

Created: February 6, 2024 6:05 PM

Redux works on sycronous nature but what if there is Async need?

Thunks comes in picture.

Thunks is a middleware which sits betweem dispatching and the reducer itself. So it will do something to dispatch function before updating the state.

Redux toolkit has asyncThunk function

```jsx
export const fetchAddress = createAsyncThunk(
  'user/fetchAdreess', // This is the action Creator it can be any name
  async function () { // actual thunk function which will be executed when the above action creator is called
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    return { position, address };
  },
);
```

```jsx
extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.state = 'idle';
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      }),
```

This the recipe which we always follow when we use thunks. When the dispatching of fetch Address is done it will inercepted by the thunk function and the promise will eventually result in three state which will be taken care by the builders.

---

To call the data without navigating into that page we can use useFetcher Provided by react-router

```css
const fetcher = useFetcher();
  useEffect(
    function () {
      if (!fetcher.data && fetcher.idle === 'idle') fetcher.load('/menu');
    },
    [fetcher],
  );
```

We are fetching the menu data without navigating into that page…..

fetcher.state is similar to navigation.state

---

To make order priority even if its order

```jsx
import { useFetcher } from 'react-router-dom';
import Button from '../../ui/Button';
function UpdateOrder({ order }) {
  const fetcher = useFetcher();

  return (
    <fetcher.form method="Patch" claassName="text-right">
      <Button type="primary">Make Priority</Button>;
    </fetcher.form>
  );
}

export default UpdateOrder;

export async function action({ request, params }) {}
```

fetcher.form will not navigate from the page but do revalidation (Meaning the data will be refetched as there is some action performed)

As soon as button is pressed this will go into action

```jsx
import { useFetcher } from 'react-router-dom';
import Button from '../../ui/Button';
import { updateOrder } from '../../services/apiRestaurant';
function UpdateOrder({ order }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH" claassName="text-right">
      <Button type="primary">Make Priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}
```