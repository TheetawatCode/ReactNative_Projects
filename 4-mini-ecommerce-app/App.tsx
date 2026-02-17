import RootNavigator from "./src/navigation/RootNavigator";
import { CartProvider } from "./src/store/cart";

export default function App() {
  return (
    <CartProvider>
      <RootNavigator />
    </CartProvider>
  );
}