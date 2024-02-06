# Section 3 Redux in The App

Created: February 5, 2024 12:22 PM

We are going to store user info as global state hence we are going to use Redux.

$ npm i @reduxjs/toolkit react-redux

Create A userSlice.js

```css
const initialState = {
  username: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
});

export const { updateName } = userSlice.actions;
export default userSlice.reducer;
```

The action creator object are automatically created by the redux. So that we dont have to remember the function name.

Action creator are plain javascrript object that has `type`  and `payload`  key.

---

Store

Store is the object which will hold our state.

```css
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
```

The userSlice.reducer which was exported from userSlice.js is imported here in the store with the Store configured here in the reducer, name shoud be the same as mentioned in the slice `user`  

---

In the main.tsx

```css
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
```

---

To user the state in component we use useSelector

```css
import { useSelector } from 'react-redux';

function Username() {
  const username = useSelector((state) => state.user.username);
  if (!username) return null;
  return (
    <div className="hidden text-sm font-semibold md:block">{username}</div>
  );
}

export default Username;
```

---

Its bad practice to mutate the redux state while inputting in the form. Once submitted we should change the redux state.

```css
function CreateUser() {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!username) return;
    dispatch(updateName(username));
    navigate('/menu');
  }
```

---

Bad Practice

```css
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function CartOverview() {
  const cart = useSelector((state) => state.cart.cart);
  return (
    <div className="flex items-center justify-between bg-stone-600 px-4 py-4 uppercase text-stone-200 sm:px-6 md:text-base">
      <p className="space-x-4 text-stone-300 sm:space-x-6">
        <span>{cart.length} pizzas</span>
        <span>
          ₹
          {cart.reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.quantity * currentValue.unitPrice,
            0,
          )}
        </span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
```

Redux dont recommend to do calculation inside the component, best place is when you are selecting the state using useSelector or inside cartSlice file

For larger applications the above method can cause some performance issues hence there is another lib to optimize it ‘reselect’

---

Important

In the cartOverview.jsx

```jsx
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTotalCartPrice, getTotalCartQuantity } from './cartSlice';
import { formatCurrency } from '../../utils/helpers';
function CartOverview() {
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);
  if (!totalCartQuantity) return null;
  return (
    <div className="flex items-center justify-between bg-stone-600 px-4 py-4 uppercase text-stone-200 sm:px-6 md:text-base">
      <p className="space-x-4 text-stone-300 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>{formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
```

We are selecting totalCartQuantity using useSelector

We are not passing any state so it gets access to all state defiend in store.

```jsx
export const getTotalCartQuantity = (state) => {
  console.log(state);
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);
};
```

![Untitled](Section%203%20Redux%20in%20The%20App%2017c92d007b514ea38a22725f7bfcc640/Untitled.png)

---

To call reducer function inside another reducer function we can use `case reducer` 

```css
deleteItem(state, action) {
      // payload = pizzaId
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
```