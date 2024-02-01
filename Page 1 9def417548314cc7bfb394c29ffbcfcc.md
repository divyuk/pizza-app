<h1 style="color:blue">How to plan and Build A React Applications</h1>

1. Gather application reqirements and features.
2. Divide the application into pages.
   1. Thinking about the overall and page-level UI.
   2. Break the desired UI into components.
   3. Design and build a static versions (no state yet)
3. Divide the appplications into feature categories.
   1. Think about state management and data flow.
4. Decide on what libraries to use. (technology decisions.)

<h1 style="color:teal">Pizza App</h1>

## Step 1. Requirements

1. Very simple application, where user can order one or more pizzas from a menu.
2. Requires no user accounts, user just input there names before using the app.
3. Pizza would be loaded from an API. ✅
4. Users can add multiple pizza in the cart before ordering.
5. Ordering requires just the user name, phone number and address.
6. If possible GPS location.
7. User can mark there order as priority with extra cost, 20% of the cart price.
8. Orders are made by sending POST request with the order data (user data+selected pizza ) to the API.
9. Each order will get unique id that will be displayed in the UI
10. User should be able to mark priority even if the order is made.

## Step 2+3. Feature Categories

Features

1. User
2. Menu
3. Cart
4. Order

Pages

1. Homepage /
2. Pizza Menu /menu
3. Cart /cart
4. Placing a new order /order/new
5. Looking for the order /order/:orderID

## Step 3+ 4 State and Technology Decisions

1. User → Global UI state
2. Menu → Global remote state (menu is fetched from API)
3. Cart → Global UI state (no need of api)
4. Order → Global remote state (fetched and submitted to API)

- React Router
- Tailwind CSS
- Remote state management → New way of fetching data right inside React Router (6.4+) that is worth exporing (render a you fetch instead fetch-on-render). Not really state management, as it doesnt persist state.
- UI state management → Redux

## Installation

npm create vite@latest

npm i eslint vite-plugin-eslint eslint-config-react-app --save-dev

## Project

Based on the features taken we have created a folder for each of them

![Untitled](Page%201%209def417548314cc7bfb394c29ffbcfcc/Untitled.png)

- app.jsx

  ```jsx
  import { RouterProvider, createBrowserRouter } from "react-router-dom";
  import Home from "./ui/Home";
  import Menu from "./features/menu/Menu";
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/menu",
      element: <Menu />,
    },
  ]);

  function App() {
    return <RouterProvider router={router} />;
  }
  export default App;
  ```

createBrowserRouter this is the new way which will allow data fetching but the old way doesnt.

```jsx
{
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
}
```

children will become part of the appLayout like nested route

```jsx
function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <CartOverview />
    </>
  );
}
```

The Outlet will render all the childrens here according to the URL path clicked.

### Data Loaders

Data loader is powerful.

Create function which fetches data, provide it route, as soon as the route is hit it will load data automatically.

Loader function can be placed anywhere but convention is to place where that feature is present.

- menu.jsx

  ```jsx
  import { useLoaderData } from "react-router-dom";
  import { getMenu } from "../../services/apiRestaurant";

  function Menu() {
    const menu = useLoaderData();
    console.log(menu);
    return <h1>Menu</h1>;
  }

  export async function loader() {
    const menu = await getMenu();
    return menu;
  }

  export default Menu;
  ```

  import Menu, { loader as menuLoader } from "./features/menu/Menu";

  ```jsx
  {
          path: "/menu",
          element: <Menu />,
          loader: menuLoader,
        },
  ```

  As soon as the /menu route is hit, it wil auto call getMenu() function which is the api to get Menu.

  > So this renders as you fetch and not fetch as you render which creates a waterfall

  ***

  To show loading spinner when loading is there we can use useNavigation which will show loading if any page is loading!! hence its centralized.

  ```jsx
  function AppLayout() {
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";
    return (
      <div className="layout">
        {isLoading && <Loader />}
  				Other Components....
  ```

  ***

  Error Handling when there is no route matched

  ```jsx
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      errorElement: <Error />,
  ```

  When no route found Error component will shown

  ```jsx
  import { useNavigate, useRouteError } from "react-router-dom";

  function Error() {
    const navigate = useNavigate();
    const error = useRouteError();
    return (
      <div>
        <h1>Something went wrong 😢</h1>
        <p>{error.data || error.message}</p> // THe message will be shown in this
        <button onClick={() => navigate(-1)}>&larr; Go back</button>
      </div>
    );
  }

  export default Error;
  ```

### Data Fetching

useParams doesnt work into normal function, works only with react function so to get the params loader function can destructure {params}

```jsx
{
        path: "/order/:orderId",
        element: <Order />,
      }
.
.
.
.
export async function loader({ params }) {
  const order = await getOrder(params.orderId);
}
```

- order.jsx

  ```jsx
  // Test ID: IIDSAT

  import {
    calcMinutesLeft,
    formatCurrency,
    formatDate,
  } from "../../utils/helpers";
  import { getOrder } from "../../services/apiRestaurant";
  import { useLoaderData } from "react-router-dom";

  function Order() {
    const order = useLoaderData();
    // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
    const {
      id,
      status,
      priority,
      priorityPrice,
      orderPrice,
      estimatedDelivery,
      cart,
    } = order;
    const deliveryIn = calcMinutesLeft(estimatedDelivery);

    return (
      <div>
        <div>
          <h2>Status</h2>

          <div>
            {priority && <span>Priority</span>}
            <span>{status} order</span>
          </div>
        </div>

        <div>
          <p>
            {deliveryIn >= 0
              ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
              : "Order should have arrived"}
          </p>
          <p>(Estimated delivery: {formatDate(estimatedDelivery)})</p>
        </div>

        <div>
          <p>Price pizza: {formatCurrency(orderPrice)}</p>
          {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
          <p>
            To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
          </p>
        </div>
      </div>
    );
  }

  export async function loader({ params }) {
    const order = await getOrder(params.orderId);
    return order;
  }

  export default Order;
  ```

### Actions

Allow us to mutate state stored in server.

![Untitled](Page%201%209def417548314cc7bfb394c29ffbcfcc/Untitled%201.png)

- createOrder.jsx

  ```jsx
  function CreateOrder() {
    // const [withPriority, setWithPriority] = useState(false);
    const cart = fakeCart;

    return (
      <div>
        <h2>Ready to order? Let's go!</h2>

        {/* <Form method="POST" action="/order/new"> */}
        {/* This will auto point to nearest route */}
        <Form method="POST">
          <div>
            <label>First Name</label>
            <input type="text" name="customer" required />
          </div>

          <div>
            <label>Phone number</label>
            <div>
              <input type="tel" name="phone" required />
            </div>
          </div>

          <div>
            <label>Address</label>
            <div>
              <input type="text" name="address" required />
            </div>
          </div>

          <div>
            <input
              type="checkbox"
              name="priority"
              id="priority"
              // value={withPriority}
              // onChange={(e) => setWithPriority(e.target.checked)}
            />
            <label htmlFor="priority">
              Want to yo give your order priority?
            </label>
          </div>

          <div>
            <button>Order now</button>
          </div>
        </Form>
      </div>
    );
  }

  export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(data);
    return null;
  }

  export default CreateOrder;
  ```

  ![Untitled](Page%201%209def417548314cc7bfb394c29ffbcfcc/Untitled%202.png)
  ![Untitled](Page%201%209def417548314cc7bfb394c29ffbcfcc/Untitled%203.png)

  ```jsx
  export async function action({ request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(data);
    const order = {
      ...data,
      cart: JSON.parse(data.cart),
      priority: data.priority === "on",
    };
    const newOrder = await createOrder(order);
    return redirect(`/order/${newOrder.id}`);
  }
  ```

  You cant use navigate here because that hook can only be used in component and not in regular function hence we have redirect function to achieve the same.
